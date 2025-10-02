import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
// Suppression des imports React Icons - remplacement par des emojis
import Header from '../components/Header';

// Composant pour éviter les erreurs d'hydration (optimisé)
const ClientOnly = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Utiliser un timeout pour éviter les boucles de rendu
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) {
    return <div style={{ minHeight: '100vh' }}></div>;
  }

  return <div {...delegated}>{children}</div>;
};

// Hook personnalisé pour la responsivité (optimisé pour éviter les boucles infinies)
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Éviter les re-rendus inutiles en vérifiant les changements
      setWindowSize(prevSize => {
        if (prevSize.width !== newWidth || prevSize.height !== newHeight) {
          return { width: newWidth, height: newHeight };
        }
        return prevSize;
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// Fonction helper pour rendre les emojis de manière sécurisée
const getStatEmoji = (index) => {
  switch (index) {
    case 0: return "👥"; // Clients satisfaits
    case 1: return "🌱"; // Hectares cultivés
    case 2: return "⭐"; // Années d'expérience
    case 3: return "🚚"; // Livraisons/jour
    default: return "🌱";
  }
};

const getBenefitEmoji = (index) => {
  switch (index) {
    case 0: return "🌱"; // Agriculture Biologique
    case 1: return "🛡️"; // Qualité Garantie
    case 2: return "🚚"; // Livraison Rapide
    case 3: return "❤️"; // Engagement Social
    default: return "🌱";
  }
};

export default function HomePage() {
  const { width: windowWidth } = useWindowSize();

  // Données pour les statistiques (mémorisées)
  const stats = useMemo(() => [
    { iconName: 'FiUsers', value: '10,000+', label: 'Clients satisfaits', color: '#2E7D32' },
    { iconName: 'FiLeaf', value: '500+', label: 'Hectares cultivés', color: '#4CAF50' },
    { iconName: 'FiStar', value: '15+', label: 'Années d\'expérience', color: '#66BB6A' },
    { iconName: 'FiTruck', value: '50+', label: 'Livraisons/jour', color: '#81C784' }
  ], []);

  // Données pour les avantages (mémorisées)
  const benefits = useMemo(() => [
    {
      iconName: 'FiLeaf',
      title: 'Agriculture Durable',
      description: 'Produits 100% naturels, cultivés sans pesticides ni produits chimiques.',
      color: '#2E7D32'
    },
    {
      iconName: 'FiShield',
      title: 'Qualité Garantie',
      description: 'Contrôles qualité rigoureux à chaque étape de la production.',
      color: '#4CAF50'
    },
    {
      iconName: 'FiTruck',
      title: 'Livraison Rapide',
      description: 'Livraison en 24h dans toute la région de Libreville.',
      color: '#66BB6A'
    },
    {
      iconName: 'FiHeart',
      title: 'Engagement Social',
      description: 'Soutien aux communautés locales et développement durable.',
      color: '#81C784'
    }
  ], []);

  // Données pour les témoignages (mémorisées)
  const testimonials = useMemo(() => [
    {
      name: 'Marie Nguema',
      role: 'Restauratrice',
      content: 'Les produits SAFEM sont d\'une fraîcheur exceptionnelle. Mes clients adorent !',
      rating: 5
    },
    {
      name: 'Jean-Pierre Obame',
      role: 'Chef de famille',
      content: 'Depuis que j\'achète chez SAFEM, ma famille mange plus sainement.',
      rating: 5
    },
    {
      name: 'Sylvie Mba',
      role: 'Nutritionniste',
      content: 'Je recommande SAFEM à tous mes patients pour la qualité exceptionnelle.',
      rating: 5
    }
  ], []);

  // Fonction pour obtenir la hauteur de la bannière (optimisée)
  const getBannerHeight = useMemo(() => {
    if (windowWidth >= 768) return 600;
    return 500;
  }, [windowWidth]);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>SAFEM - Leader de l'Agriculture Durable au Gabon</title>
        <meta name="description" content="SAFEM - Votre partenaire de confiance pour des produits frais de qualité supérieure, cultivés avec passion au cœur du Gabon" />
        <link rel="icon" href="/favicon.ico" />

        <style>{`
          .gallery-container {
            overflow-x: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .gallery-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
          .gallery-scroll {
            cursor: grab;
            user-select: none;
          }
          .gallery-scroll:active {
            cursor: grabbing;
          }
          .product-card {
            background: white;
            border-radius: 1rem;
            border: 2px solid #4CAF50;
            transition: all 0.3s ease;
            box-shadow: 0 0 0 1px #81C784, 0 4px 12px rgba(76, 175, 80, 0.1);
          }
          .product-card:hover {
            border-color: #2E7D32;
            box-shadow: 0 0 0 1px #4CAF50, 0 0 0 2px #66BB6A, 0 10px 25px rgba(76, 175, 80, 0.2);
            transform: translateY(-2px);
          }
          .product-emoji {
            transition: transform 0.3s ease;
          }
          .product-card:hover .product-emoji {
            transform: scale(1.2) rotate(10deg);
            animation: bounce 0.6s ease-in-out;
          }
          .histoire-stat-card {
            background: white;
            border-radius: 1rem;
            border: 2px solid #4CAF50;
            transition: all 0.3s ease;
            box-shadow: 0 0 0 1px #81C784, 0 4px 12px rgba(76, 175, 80, 0.1);
          }
          .histoire-stat-card:hover {
            border-color: #2E7D32;
            box-shadow: 0 0 0 1px #4CAF50, 0 0 0 2px #66BB6A, 0 10px 25px rgba(76, 175, 80, 0.2);
            transform: translateY(-2px) scale(1.05);
          }
          @keyframes bounce {
            0%, 20%, 60%, 100% {
              transform: scale(1.2) rotate(10deg) translateY(0);
            }
            40% {
              transform: scale(1.2) rotate(10deg) translateY(-10px);
            }
            80% {
              transform: scale(1.2) rotate(10deg) translateY(-5px);
            }
          }
        `}</style>
      </Head>
      
      <ClientOnly>
        <Header />

        <main className="overflow-hidden">
          {/* Hero Section Ultra Moderne */}
          <section 
            className="relative overflow-hidden"
            style={{
              height: getBannerHeight,
              backgroundImage: 'url("/images/new banner parallaxe.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay gradient moderne */}
            <div className="absolute inset-0 z-10" style={{
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.4) 0%, rgba(76, 175, 80, 0.3) 50%, rgba(0, 0, 0, 0.2) 100%)'
            }}></div>
            
            {/* Contenu hero en 2 colonnes */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Colonne gauche - Contenu texte */}
                <div className="text-left">

                  {/* Titre principal */}
                  <h1 className="text-white mb-6" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2.8rem' : '3.5rem',
                    fontWeight: '700',
                    lineHeight: '1.1',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    Mangez Sain,
                    <br />
                    <span style={{ color: '#81C784' }}>Mangez SAFEM</span>
                  </h1>
                  
                  {/* Sous-titre */}
                  <p className="text-white/90 mb-8" style={{
                    fontSize: windowWidth < 768 ? '1rem' : '1.1rem',
                    lineHeight: '1.6',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    maxWidth: '500px'
                  }}>
                    Des produits cultivés avec passion au cœur du Gabon et respectant les normes sanitaires, 
                    livrés directement du producteur au consommateur.
                  </p>
                  
                  {/* Boutons CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Découvrir nos produits
                    <span className="ml-2">→</span>
                  </Link>

                  </div>

                </div>
                
                {/* Colonne droite - Espace visuel */}
                <div className="hidden lg:block">
                  {/* Espace réservé pour laisser l'image de fond visible */}
                </div>
              </div>
            </div>
          </section>

          {/* Module Nos Produits - Galerie Dynamique */}
          <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* En-tête du module */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-100 rounded-full text-green-700 text-xs md:text-sm font-medium mb-3 md:mb-4">
                  <span className="mr-1.5 md:mr-2">🌱</span>
                  Nos Produits
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Découvrez Notre Production
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                  Des produits frais et naturels cultivés avec passion au cœur du Gabon
                </p>
              </div>

              {/* Galerie défilante contrôlée par la souris */}
              <div className="relative">
                <div className="gallery-container pb-3 md:pb-4">
                  <div className="flex gallery-scroll space-x-3 sm:space-x-4 md:space-x-6 w-max px-4 sm:px-0">
                    {/* Produits de la caisse */}
                    {[
                      { name: 'Demon', icon: '🌶️', category: 'Piments', price: '2000 FCFA/kg' },
                      { name: 'Padma', icon: '🍅', category: 'Tomates', price: '1500 FCFA/kg' },
                      { name: 'Plantain Ebanga', icon: '🍌', category: 'Bananes', price: '1000 FCFA/kg' },
                      { name: 'Yolo Wander', icon: '🫑', category: 'Poivrons', price: '2000 FCFA/kg' },
                      { name: 'Africaine', icon: '🍆', category: 'Aubergines', price: '1800 FCFA/kg' },
                      { name: 'Taro Blanc', icon: '🥔', category: 'Taros', price: '1000 FCFA/kg' },
                      { name: 'Shamsi', icon: '🌶️', category: 'Piments', price: '2500 FCFA/kg' },
                      { name: 'Anita', icon: '🍅', category: 'Tomates', price: '1200 FCFA/kg' },
                      { name: 'De Conti', icon: '🫑', category: 'Poivrons', price: '2500 FCFA/kg' },
                      { name: 'Bonita', icon: '🍆', category: 'Aubergines', price: '1600 FCFA/kg' },
                      { name: 'Banane Douce', icon: '🍌', category: 'Bananes', price: '1200 FCFA/kg' },
                      { name: 'Taro Rouge', icon: '🥔', category: 'Taros', price: '1500 FCFA/kg' },
                      { name: 'Avenir', icon: '🌶️', category: 'Piments', price: '1800 FCFA/kg' },
                      { name: 'The King', icon: '🌶️', category: 'Piments', price: '3000 FCFA/kg' },
                      { name: 'Nobili', icon: '🫑', category: 'Poivrons', price: '2200 FCFA/kg' },
                      { name: 'Ping Tung', icon: '🍆', category: 'Aubergines', price: '2000 FCFA/kg' }
                    ].map((product, index) => (
                      <div key={index} className="flex-shrink-0 w-36 sm:w-40 md:w-48 product-card rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 hover:scale-105">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3 product-emoji">{product.icon}</div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight">{product.name}</h3>
                          <p className="text-xs text-green-600 mb-1 md:mb-2">{product.category}</p>
                          <p className="text-xs font-medium text-gray-700">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Indicateur de défilement */}
                <div className="text-center text-gray-500 text-xs sm:text-sm mb-6 md:mb-8 px-4">
                  <span className="inline-flex items-center">
                    <span className="mr-1.5 md:mr-2">👆</span>
                    <span className="hidden sm:inline">Faites glisser pour découvrir plus de produits</span>
                    <span className="sm:hidden">Glissez pour plus de produits</span>
                  </span>
                </div>
              </div>

              {/* Bouton CTA */}
              <div className="text-center px-4">
                <a href="/products" className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span className="hidden sm:inline">Passer commande</span>
                  <span className="sm:hidden">Passer commande</span>
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* Section Nos Abonnements */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* En-tête de la section */}
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <span className="mr-2">💬</span>
                  Nos Abonnements
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Recevez Vos Produits SAFEM
                  <br className="hidden sm:block" />
                  <span className="text-green-600">Régulièrement</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Simplifiez votre quotidien avec nos abonnements personnalisés. 
                  Choisissez vos produits, votre fréquence, et recevez le meilleur de SAFEM directement chez vous.
                </p>
              </div>

              {/* Avantages des abonnements */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Économisez jusqu'à 15%</h3>
                  <p className="text-gray-600">
                    Profitez de tarifs préférentiels sur tous vos produits avec nos abonnements.
                  </p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Automatique</h3>
                  <p className="text-gray-600">
                    Plus besoin de commander ! Vos produits arrivent selon la fréquence choisie.
                  </p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">100% Personnalisable</h3>
                  <p className="text-gray-600">
                    Modifiez, pausez ou annulez votre abonnement à tout moment en un clic.
                  </p>
                </div>
              </div>

              {/* Options d'abonnement simplifiées */}
              <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                {/* Pour les Familles */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pour les Familles</h3>
                    <p className="text-gray-600 mb-6">Des paniers adaptés aux besoins de votre foyer</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Produits de saison variés</strong>
                        <p className="text-sm text-gray-600">Légumes, fruits et produits frais selon vos besoins</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Quantités familiales</strong>
                        <p className="text-sm text-gray-600">Portions adaptées pour 2 à 6 personnes</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Livraison gratuite</strong>
                        <p className="text-sm text-gray-600">Directement chez vous, selon votre planning</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Flexibilité totale</strong>
                        <p className="text-sm text-gray-600">Modifiez, pausez ou annulez à tout moment</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Pour les Professionnels */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏢</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pour les Professionnels</h3>
                    <p className="text-gray-600 mb-6">Solutions sur mesure pour restaurants et collectivités</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Volumes professionnels</strong>
                        <p className="text-sm text-gray-600">Quantités adaptées à votre activité</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Produits certifiés qualité</strong>
                        <p className="text-sm text-gray-600">Qualité premium pour vos clients</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Livraison planifiée</strong>
                        <p className="text-sm text-gray-600">Selon vos horaires et contraintes</p>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-3 mt-1">✓</span>
                      <div>
                        <strong>Tarifs préférentiels</strong>
                        <p className="text-sm text-gray-600">Remises dégressives selon les volumes</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Call to Action final avec image parallax */}
              <div className="relative rounded-2xl overflow-hidden">
                {/* Image de fond avec effet parallax */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-fixed"
                  style={{
                    backgroundImage: 'url(/images/abonnements.jpg)',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                ></div>
                
                {/* Overlay sombre pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* Contenu */}
                <div className="relative z-10 text-center p-8 md:p-12 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                    Prêt à Commencer Votre Abonnement ?
                  </h3>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                    Rejoignez plus de 2000 familles gabonaises qui font confiance à SAFEM 
                    pour leur alimentation quotidienne.
                  </p>
                  <div className="flex justify-center">
                    <a href="/abonnements" className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <span className="mr-2">🚚</span>
                      Créer Mon Abonnement
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Notre Histoire */}
          <section className="py-20 bg-white" id="notre-histoire">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <span className="mr-2">📖</span>
                  Notre Histoire
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  15 Ans d'Excellence Agricole
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Découvrez l'histoire de SAFEM et notre engagement pour une agriculture durable au Gabon
                </p>
              </div>

              {/* Chiffres clés de notre histoire */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center group">
                  <div className="histoire-stat-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <img src="/images/Arbre-fruitier.png" alt="Arbres Fruitiers" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                    <div className="text-green-600 font-bold mb-1">Arbres Fruitiers</div>
                    <div className="text-sm text-gray-500">Plantés pour la biodiversité</div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="histoire-stat-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <img src="/images/expert_agricole.png" alt="Experts Agricoles" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
                    <div className="text-green-600 font-bold mb-1">Experts Agricoles</div>
                    <div className="text-sm text-gray-500">Techniciens & spécialistes</div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="histoire-stat-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <img src="/images/annee_experiece.png" alt="Années d'Expérience" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
                    <div className="text-green-600 font-bold mb-1">Années d'Expérience</div>
                    <div className="text-sm text-gray-500">Dans l'agriculture durable</div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="histoire-stat-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <img src="/images/hectare_cultive.png" alt="Hectares Cultivés" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                    <div className="text-green-600 font-bold mb-1">Hectares Cultivés</div>
                    <div className="text-sm text-gray-500">En agriculture durable</div>
                  </div>
                </div>
              </div>

              {/* Nos 4 valeurs fondamentales */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Nos Valeurs Fondamentales
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Quatre piliers qui guident notre vision de l'agriculture gabonaise
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      💼
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Travail</h4>
                    <p className="text-gray-600 text-sm">
                      Excellence dans toutes les activités agricoles, de la préparation du sol à la récolte
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                      ❤️
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Engagement</h4>
                    <p className="text-gray-600 text-sm">
                      Passion et dévouement pour produire des aliments de qualité en préservant l'environnement
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      🌍
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Durabilité</h4>
                    <p className="text-gray-600 text-sm">
                      Production responsable préservant les ressources naturelles et la biodiversité
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                      📈
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Progrès</h4>
                    <p className="text-gray-600 text-sm">
                      Innovation continue pour accroître l'efficacité et adopter des technologies avancées
                    </p>
                  </div>
                </div>

                {/* Call to Action vers la page Notre Histoire */}
                <div className="text-center mt-12">
                  <a 
                    href="/about" 
                    className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">📖</span>
                    Découvrir Notre Histoire Complète
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section Boutique Pro - Matériel Agricole */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50" id="boutique-pro">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
                  <span className="mr-2">🚜</span>
                  Boutique Professionnelle
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Matériel & Équipements Agricoles
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Solutions complètes pour les professionnels de l'agriculture : matériel, intrants et équipements avec livraison jusqu'à Libreville
                </p>
              </div>

              {/* Galerie défilante horizontale des catégories */}
              <div className="mb-12">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                    {/* Tracteurs */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🚜
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Tracteurs</h3>
                      </div>
                    </div>

                    {/* Motoculteurs */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          ⚙️
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Motoculteurs</h3>
                      </div>
                    </div>

                    {/* Pulvérisateurs */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          💧
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Pulvérisateurs</h3>
                      </div>
                    </div>

                    {/* Irrigation */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-cyan-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🌊
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Irrigation</h3>
                      </div>
                    </div>

                    {/* Semoirs */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🌱
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Semoirs</h3>
                      </div>
                    </div>

                    {/* Serres */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🏠
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Serres</h3>
                      </div>
                    </div>

                    {/* Broyeurs */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🔨
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Broyeurs</h3>
                      </div>
                    </div>

                    {/* Tondeuses */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" style={{ minWidth: '200px' }}>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                          🌿
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Tondeuses</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avantages et services */}
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Nos Services Professionnels</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Un accompagnement complet pour optimiser votre exploitation agricole
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      🚚
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Livraison Gratuite</h4>
                    <p className="text-gray-600">
                      Livraison gratuite à Libreville pour toute commande supérieure à 500 000 FCFA
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      🔧
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Installation & Formation</h4>
                    <p className="text-gray-600">
                      Service d'installation et formation à l'utilisation de vos équipements agricoles
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">SAV Réactif</h4>
                    <p className="text-gray-600">
                      Service après-vente réactif avec pièces détachées et maintenance préventive
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="relative rounded-3xl p-8 md:p-12 text-white overflow-hidden" style={{ backgroundImage: 'url(/images/motoculteur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
                  <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Équipez Votre Exploitation
                  </h3>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    Découvrez notre gamme complète de matériel agricole professionnel avec conseils d'experts
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/boutique" 
                      className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="mr-2">🛒</span>
                      Voir la Boutique Complète
                    </a>
                    <a 
                      href="tel:+24101234567" 
                      className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <span className="mr-2">📞</span>
                      Conseil Expert
                    </a>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </section>



          {/* Section Témoignages */}
          <section className="py-20 bg-white" id="testimonials">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium mb-4">
                  <span className="mr-2">⭐</span>
                  Témoignages
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Ce que Disent nos Clients
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  La satisfaction de nos clients est notre plus belle récompense
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-green-600 font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section Contact */}
          <section className="py-20 bg-gray-50" id="contact">
            <div className="max-w-7xl mx-auto px-4">
              {/* En-tête de section */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
                  📍 Nous Localiser
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Contactez la SAFEM
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Venez découvrir notre ferme et rencontrer nos experts agricoles. Nous sommes là pour répondre à toutes vos questions.
                </p>
              </div>

              {/* Contenu à 2 colonnes */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Colonne gauche - Carte Google Maps */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-green-600 to-green-700">
                    <h3 className="text-xl font-bold text-white mb-2">Notre Localisation</h3>
                    <p className="text-green-100">Ferme SAFEM - Agriculture Durable</p>
                  </div>
                  <div className="relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d5153.343345227159!2d9.767809875995308!3d0.4680934995273209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwMjgnMDUuMSJOIDnCsDQ2JzEzLjQiRQ!5e1!3m2!1sen!2sga!4v1753403489494!5m2!1sen!2sga" 
                      width="100%" 
                      height="400" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    ></iframe>
                  </div>
                </div>

                {/* Colonne droite - Informations de contact */}
                <div className="space-y-8">
                  {/* Informations de contact */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations de Contact</h3>
                    
                    <div className="space-y-6">
                      {/* Adresse */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xl">📍</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Adresse</h4>
                          <p className="text-gray-600">Ferme SAFEM<br />Meba - Route de Cocobeach,<br />à 9 Km de Ntoum, Gabon</p>
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xl">📞</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Téléphone</h4>
                          <p className="text-gray-600">+241 01 23 45 67</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xl">✉️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                          <p className="text-gray-600">contact@safem.ga</p>
                        </div>
                      </div>

                      {/* Horaires */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xl">🕐</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Horaires de visite</h4>
                          <p className="text-gray-600">
                            Lundi - Vendredi: 8h00 - 17h00<br />
                            Samedi: 8h00 - 14h00<br />
                            Dimanche: Fermé
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Visitez Notre Ferme</h3>
                    <p className="text-green-100 mb-6">
                      Découvrez nos méthodes d'agriculture durable et rencontrez nos experts agricoles.
                    </p>
                    <button className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                      🚜 Visiter la Ferme
                      <span className="ml-2">→</span>
                    </button>
                    <p className="text-green-200 text-sm mt-4">
                      Visite gratuite sur rendez-vous
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">SAFEM</h3>
                <p className="text-gray-400 mb-4">
                  Leader de l'agriculture durable au Gabon, cultivant l'excellence depuis plus de 15 ans.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white">🌱</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Produits</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/products" className="hover:text-white transition-colors">Tous nos produits</Link></li>
                  <li><Link href="/abonnements" className="hover:text-white transition-colors">Abonnements</Link></li>
                  <li><Link href="/boutique" className="hover:text-white transition-colors">Matériel agricole</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>Libreville, Gabon</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>+241 XX XX XX XX</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 SAFEM. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </ClientOnly>
    </div>
  );
}
