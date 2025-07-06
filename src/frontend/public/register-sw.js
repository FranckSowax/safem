/**
 * Enregistrement du service worker pour optimiser SAFEM
 * sur les connexions internet limitées au Gabon
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch(function(error) {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });

    // Détection de la vitesse de connexion
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Adapter l'expérience selon la qualité de la connexion
      function updateConnectionQuality() {
        const connectionType = connection.effectiveType;
        const downlink = connection.downlink;
        
        // Définir la qualité de connexion
        let connectionQuality = 'high';
        
        if (connectionType === 'slow-2g' || connectionType === '2g' || downlink < 0.5) {
          connectionQuality = 'very-low';
        } else if (connectionType === '3g' || downlink < 1.5) {
          connectionQuality = 'low';
        } else if (connectionType === '4g' && downlink < 5) {
          connectionQuality = 'medium';
        }
        
        // Ajouter une classe sur le document pour le CSS
        document.documentElement.dataset.connectionQuality = connectionQuality;
        
        // Prendre des mesures basées sur la qualité de connexion
        if (connectionQuality === 'very-low') {
          // Désactiver les animations et effets lourds
          document.documentElement.classList.add('reduce-animations');
          
          // Précharger les ressources essentielles
          const pagesToPreload = ['/offline.html'];
          caches.open('safem-v1').then(cache => {
            cache.addAll(pagesToPreload);
          });
          
          // Afficher un message à l'utilisateur si nécessaire
          const connectionBanner = document.createElement('div');
          connectionBanner.classList.add('connection-banner');
          connectionBanner.innerHTML = 'Connexion Internet limitée détectée. Le site a été optimisé pour réduire la consommation de données.';
          document.body.prepend(connectionBanner);
          
          setTimeout(() => {
            connectionBanner.classList.add('fade-out');
            setTimeout(() => connectionBanner.remove(), 1000);
          }, 5000);
        }
      }
      
      // Mettre à jour la qualité de connexion initialement et lorsqu'elle change
      updateConnectionQuality();
      connection.addEventListener('change', updateConnectionQuality);
    }
  });

  // Gérer les synchronisations en arrière-plan quand la connexion est rétablie
  window.addEventListener('online', function() {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.sync.register('sync-cart');
    });
  });
}
