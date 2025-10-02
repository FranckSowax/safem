/**
 * Service Worker pour SAFEM
 * Améliore les performances sur les connexions lentes du Gabon
 * Permet un accès partiel hors-ligne aux produits
 */

const CACHE_NAME = 'safem-v1';
const OFFLINE_URL = '/offline.html';

// Ressources à mettre en cache immédiatement
// Mise à jour pour éviter les erreurs de cache avec des ressources inexistantes
const PRECACHE_ASSETS = [
  '/',
  '/caisse',
  '/dashboard',
  '/favicon.ico'
  // Suppression des ressources inexistantes qui causaient l'erreur
  // '/offline.html', '/images/vegetables.jpg', '/css/main.min.css', etc.
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des ressources statiques');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Suppression des anciennes caches
          return cacheName.startsWith('safem-') && cacheName !== CACHE_NAME;
        }).map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('Service Worker activé - SAFEM');
      return self.clients.claim();
    })
  );
});

// Stratégie de mise en cache pour les connexions lentes
self.addEventListener('fetch', event => {
  // Skip les requêtes non GET et celles vers des API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Stratégie pour les images
  if (event.request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Stratégie pour les pages HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Stratégie par défaut
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Utiliser la version en cache si disponible
        if (cachedResponse) {
          // Mais aussi mettre à jour le cache en arrière-plan (stale-while-revalidate)
          const fetchPromise = fetch(event.request).then(networkResponse => {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }).catch(error => console.log('Erreur de mise à jour du cache:', error));
          
          return cachedResponse;
        }

        // Pas de version en cache, essayer le réseau
        return fetch(event.request)
          .then(response => {
            // Mettre en cache la nouvelle réponse
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(error => {
            console.log('Erreur de récupération:', error);
            // Pour les ressources CSS/JS, on peut retourner une réponse vide
            if (event.request.destination === 'style' || event.request.destination === 'script') {
              return new Response('', { status: 499, statusText: 'network error' });
            }
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// Stratégie Cache First pour les images (optimisation pour connexions lentes)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Fallback pour les images si le réseau échoue
    return caches.match('/images/placeholder-product.jpg');
  }
}

// Synchronisation en arrière-plan quand la connexion est rétablie
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCartData());
  }
});

// Fonction pour synchroniser les données du panier
async function syncCartData() {
  const cartData = await localforage.getItem('offline-cart-data');
  if (cartData) {
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });
      
      if (response.ok) {
        await localforage.removeItem('offline-cart-data');
        console.log('Panier synchronisé avec succès');
      }
    } catch (error) {
      console.error('Échec de synchronisation du panier:', error);
    }
  }
}
