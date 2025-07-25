import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiUsers, FiLeaf, FiAward, FiShield, FiHeart, FiMapPin, FiClock, FiPhone } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Attendre que le client soit chargé avant d'afficher le contenu pour éviter les erreurs d'hydration
function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

// Données des produits
const featuredProducts = [
  {
    id: 1,
    name: 'Piment',
    slug: 'piment',
    price: 2800,
    description: 'Piments frais et colorés, parfaits pour relever vos plats',
    images: [{ publicUrl: 'https://i.imgur.com/6nluzTc.jpeg' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 2,
    name: 'Tomates',
    slug: 'tomates',
    price: 2500,
    description: 'Tomates fraîches et juteuses, cultivées en pleine terre',
    images: [{ publicUrl: 'https://i.imgur.com/s6FY1eW.png' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 3,
    name: 'Poivrons',
    slug: 'poivrons',
    price: 3000,
    description: 'Poivrons multicolores, riches en vitamines et saveurs',
    images: [{ publicUrl: 'https://i.imgur.com/MfEY1vJ.png' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 4,
    name: 'Pastèques',
    slug: 'pasteques',
    price: 4500,
    description: 'Pastèques juteuses et rafraîchissantes, parfaites pour l’été',
    images: [{ publicUrl: 'https://i.imgur.com/Rsb4OXA.png' }],
    category: 'fruits',
    is_organic: false,
  },
  {
    id: 5,
    name: 'Carottes',
    slug: 'carottes',
    price: 2000,
    description: 'Carottes fraîches et croquantes, riches en béta-carotène',
    images: [{ publicUrl: 'https://i.imgur.com/7xcURux.jpeg' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 6,
    name: 'Aubergines',
    slug: 'aubergines',
    price: 2700,
    description: 'Aubergines brillantes à la chair tendre et fondante',
    images: [{ publicUrl: 'https://i.imgur.com/q4xcrMV.jpeg' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 7,
    name: 'Oseille',
    slug: 'oseille',
    price: 1800,
    description: 'Oseille fraîche aux feuilles vertes et au goût acidulé',
    images: [{ publicUrl: 'https://i.imgur.com/7uCdlsi.jpeg' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 8,
    name: 'Oignons',
    slug: 'oignons',
    price: 1500,
    description: 'Oignons frais aux saveurs intenses, base de toute bonne cuisine',
    images: [{ publicUrl: 'https://i.imgur.com/CHwP1Y2.jpeg' }],
    category: 'legumes',
    is_organic: false,
  },
];

// Témoignages clients
const testimonials = [
  {
    id: 1,
    name: 'Marie Ndong',
    location: 'Libreville',
    content: 'Je suis ravie de la qualité des produits de SAFEM. Les légumes sont vraiment frais et savoureux!',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Thomas Engonga',
    location: 'Port-Gentil',
    content: 'Excellent service de livraison et produits de grande qualité. Je recommande vivement!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sophie Mba',
    location: 'Franceville',
    content: 'Produits frais et service client exemplaire. Je suis cliente depuis 6 mois et je n\'ai jamais été déçue.',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    rating: 4,
  },
];

// Hook personnalisé pour la responsivité
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Vérifier que le code s'exécute côté client
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Appeler une fois au montage pour initialiser
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default function HomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const { width: windowWidth } = useWindowSize();

  // Effet pour l'effet parallax
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation d'apparition des sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Calculer le décalage pour l'effet parallax
  const parallaxOffset = scrollPosition * 0.4;
  
  // Ajuster la hauteur de la bannière en fonction de la taille de l'écran
  const getBannerHeight = () => {
    if (windowWidth < 480) return '100vh';
    if (windowWidth < 768) return '90vh';
    return '100vh';
  };
  
  const getBannerPadding = () => {
    if (windowWidth < 480) return '0';
    if (windowWidth < 768) return '0';
    return '0';
  };

  // Données pour les statistiques
  const stats = [
    { icon: FiUsers, value: '10,000+', label: 'Clients satisfaits', color: '#2E7D32' },
    { icon: FiLeaf, value: '500+', label: 'Hectares cultivés', color: '#4CAF50' },
    { icon: FiAward, value: '15+', label: 'Années d\'expérience', color: '#FFC107' },
    { icon: FiShield, value: '100%', label: 'Produits certifiés', color: '#FF5722' }
  ];

  // Données pour les avantages
  const benefits = [
    {
      icon: FiLeaf,
      title: 'Agriculture Biologique',
      description: 'Produits cultivés sans pesticides ni engrais chimiques, respectueux de l\'environnement.',
      color: '#4CAF50'
    },
    {
      icon: FiMapPin,
      title: 'Production Locale',
      description: 'Cultivés au cœur du Gabon, nos produits soutiennent l\'économie locale.',
      color: '#2E7D32'
    },
    {
      icon: FiClock,
      title: 'Fraîcheur Garantie',
      description: 'De la ferme à votre table en moins de 24h, fraîcheur et qualité assurées.',
      color: '#FF9800'
    },
    {
      icon: FiShield,
      title: 'Traçabilité Complète',
      description: 'Suivez le parcours de vos produits depuis la plantation jusqu\'à votre assiette.',
      color: '#3F51B5'
    }
  ];

  // Données pour les témoignages
  const testimonials = [
    {
      name: 'Marie Nguema',
      role: 'Cliente fidèle',
      content: 'Les produits SAFEM ont transformé ma cuisine. La qualité est exceptionnelle et le goût incomparable !',
      rating: 5,
      avatar: '👩🏾'
    },
    {
      name: 'Jean-Pierre Obame',
      role: 'Chef restaurateur',
      content: 'En tant que chef, je ne jure que par SAFEM. Leurs légumes subliment tous mes plats.',
      rating: 5,
      avatar: '👨🏾‍🍳'
    },
    {
      name: 'Fatou Diallo',
      role: 'Nutritionniste',
      content: 'Je recommande SAFEM à tous mes patients. Des produits sains pour une alimentation équilibrée.',
      rating: 5,
      avatar: '👩🏾‍⚕️'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>SAFEM - Leader de l'Agriculture Biologique au Gabon</title>
        <meta name="description" content="SAFEM - Votre partenaire de confiance pour des produits biologiques de qualité supérieure, cultivés avec passion au cœur du Gabon" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <ClientOnly>
        <Header />

        <main className="overflow-hidden">
          {/* Hero Section Ultra Moderne */}
          <section className="relative" style={{ height: getBannerHeight() }}>
            {/* Image de fond avec parallax */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/new banner parallaxe.jpg"
                alt="Agriculture SAFEM"
                className="w-full h-full object-cover"
                style={{
                  transform: `translateY(${parallaxOffset}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
            
            {/* Overlay gradient moderne */}
            <div className="absolute inset-0 z-10" style={{
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.8) 0%, rgba(76, 175, 80, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)'
            }}></div>
            
            {/* Contenu hero */}
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center">
                {/* Badge premium */}
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
                  <FiAward className="mr-2" />
                  Leader de l'Agriculture Biologique au Gabon
                </div>
                
                {/* Titre principal */}
                <h1 className="text-white mb-6" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: windowWidth < 480 ? '2.5rem' : windowWidth < 768 ? '3.5rem' : '4.5rem',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  <span className="block">Mangez Sain,</span>
                  <span className="block text-yellow-300">Mangez SAFEM</span>
                </h1>
                
                {/* Sous-titre */}
                <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed" style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}>
                  Des produits biologiques d'exception, cultivés avec passion au cœur du Gabon. 
                  De la ferme à votre table, nous garantissons fraîcheur, qualité et traçabilité.
                </p>
                
                {/* Badges de confiance */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                    <FiLeaf className="mr-2 text-green-300" />
                    100% Bio
                  </div>
                  <div className="flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                    <FiMapPin className="mr-2 text-blue-300" />
                    Made in Gabon
                  </div>
                  <div className="flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                    <FiClock className="mr-2 text-orange-300" />
                    Livraison 24h
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <FiArrowRight className="mr-2" />
                    Découvrir nos produits
                  </Link>
                  <Link href="/abonnements" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300">
                    <FiHeart className="mr-2" />
                    Nos abonnements
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Indicateur de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Statistiques & Impact */}
          <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50" id="stats" data-animate>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <FiTrendingUp className="mr-2" />
                  Notre Impact
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Des Chiffres qui Parlent
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Plus de 15 ans d'engagement pour une agriculture durable et responsable au Gabon
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`text-center transform transition-all duration-700 ${
                      isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`} style={{ transitionDelay: `${index * 100}ms` }}>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${stat.color}20` }}>
                        <Icon className="text-2xl" style={{ color: stat.color }} />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section Avantages Premium */}
          <section className="py-20 bg-white" id="benefits" data-animate>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
                  <FiShield className="mr-2" />
                  Nos Engagements
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Pourquoi Choisir SAFEM ?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Une approche holistique de l'agriculture biologique pour votre bien-être et celui de la planète
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className={`group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl transform ${
                      isVisible.benefits ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`} style={{ transitionDelay: `${index * 150}ms` }}>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${benefit.color}20` }}>
                        <Icon className="text-xl" style={{ color: benefit.color }} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
              {/* Article 1 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.8rem', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="/images/pasteque.webp"
                    alt="Nouvelle récolte de pastèques"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <span style={{ color: '#2E7D32', fontSize: '0.8rem', fontWeight: 'bold' }}>08 Mai 2025</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Nouvelle récolte exceptionnelle de pastèques</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                    Notre dernière récolte de pastèques est désormais disponible ! Cultivées dans des conditions optimales et respectant toutes les normes sanitaires, ces pastèques juteuses sauront vous rafraîchir pendant les journées chaudes.
                  </p>
                  <a href="/news/recolte-pasteques" style={{ color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                    Lire la suite <span style={{ marginLeft: '0.5rem' }}>→</span>
                  </a>
                </div>
              </div>

              {/* Article 2 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.8rem', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="/images/PHOTO-2025-05-13-22-31-38.jpg"
                    alt="Certification agricole"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <span style={{ color: '#2E7D32', fontSize: '0.8rem', fontWeight: 'bold' }}>02 Mai 2025</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>La SAFEM obtient la certification sanitaire internationale</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                    Nous sommes fiers d'annoncer que la SAFEM vient d'obtenir la certification sanitaire internationale, attestant du respect rigoureux des normes sanitaires dans tous nos processus de production et transformation.
                  </p>
                  <a href="/news/certification" style={{ color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                    Lire la suite <span style={{ marginLeft: '0.5rem' }}>→</span>
                  </a>
                </div>
              </div>

              {/* Article 3 */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.8rem', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src="/images/piments.webp"
                    alt="Marchés locaux"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <span style={{ color: '#2E7D32', fontSize: '0.8rem', fontWeight: 'bold' }}>28 Avril 2025</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Extension de notre réseau de revendeurs dans 3 nouvelles villes</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                    La SAFEM étend son réseau de distribution avec 5 nouveaux partenaires revendeurs dans 3 villes supplémentaires au Gabon. Nos produits frais et locaux seront désormais disponibles à Port-Gentil, Franceville et Oyem.
                  </p>
                  <a href="/news/nouveaux-revendeurs" style={{ color: '#2E7D32', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                    Lire la suite <span style={{ marginLeft: '0.5rem' }}>→</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <a href="/news" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                Voir toutes les actualités
              </a>
            </div>
          </div>
        </section>

        {/* Types de commandes Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Comment commander</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Choisissez la solution qui vous convient</h2>
              <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', color: '#666', fontSize: '1.1rem' }}>
                Nous proposons différentes façons d'accéder à nos produits biologiques frais du Gabon
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Sur Place */}
              <div style={{ flex: '1 1 300px', maxWidth: '350px', backgroundColor: '#f9f9f9', borderRadius: '1rem', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ margin: '0 auto 1.5rem', width: '100px', height: '100px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>🏪</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2E7D32' }}>Venez sur Place</h3>
                <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Visitez la SAFEM pour sélectionner vos produits frais directement à la source et découvrir nos méthodes de culture responsable.
                </p>
                <a href="/sur-place" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                  En savoir plus
                </a>
              </div>
              
              {/* Abonnements */}
              <div style={{ flex: '1 1 300px', maxWidth: '350px', backgroundColor: '#f9f9f9', borderRadius: '1rem', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ margin: '0 auto 1.5rem', width: '100px', height: '100px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>📦</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2E7D32' }}>Abonnements Livraisons</h3>
                <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Recevez régulièrement vos produits frais à domicile avec nos formules d'abonnement adaptables à vos besoins.
                </p>
                <a href="/abonnements" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                  Découvrir les formules
                </a>
              </div>
              
              {/* Professionnel */}
              <div style={{ flex: '1 1 300px', maxWidth: '350px', backgroundColor: '#f9f9f9', borderRadius: '1rem', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ margin: '0 auto 1.5rem', width: '100px', height: '100px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>🍴</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2E7D32' }}>Professionnel</h3>
                <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Solutions sur mesure pour les restaurants, hôtels et distributeurs avec service de livraison prioritaire et tarifs avantageux.
                </p>
                <a href="/professionnel" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                  Offre professionnelle
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Fresh Products Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#f9f9f9' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Agriculture Responsable</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Nos Produits Frais</h2>
              <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', color: '#666', fontSize: '1.1rem' }}>
                Découvrez nos produits cultivés avec passion au sein de la SAFEM au Gabon, respectant les normes sanitaires internationales
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {featuredProducts.map(product => (
                <div key={product.id} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img 
                      src={product.images[0].publicUrl} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    {product.is_organic && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        backgroundColor: '#2E7D32', 
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontWeight: 'bold'
                      }}>
                        Bio
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                    <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#2E7D32', fontWeight: 'bold', fontSize: '1.1rem' }}>{product.price} FCFA</span>
                      <a href={`/products/${product.slug}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', color: '#2E7D32', borderRadius: '0.25rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Voir →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="/products" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Voir tous nos produits
              </a>
            </div>
          </div>
        </section>

        {/* Section Parallax */}
        <section style={{ 
          position: 'relative',
          height: windowWidth < 480 ? '300px' : windowWidth < 768 ? '400px' : '500px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('/images/new banner parallaxe.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%', /* Positionner l'image pour montrer la main avec la plante */
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed' /* Crée un vrai effet parallax natif */
        }}>
          
          {/* Overlay semi-transparent */}
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2
          }}></div>
          
          {/* Contenu centré */}
          <div style={{ 
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '800px'
          }}>
            <h2 style={{ 
              fontSize: windowWidth < 480 ? '2.3rem' : '3.5rem', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              lineHeight: '1.2'
            }}>
              Mangez bien, <br />
              Mangez SAFEM !
            </h2>
            <p style={{ 
              fontSize: windowWidth < 480 ? '1.1rem' : '1.3rem', 
              color: 'white',
              maxWidth: '600px',
              margin: '0 auto',
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              lineHeight: '1.6'
            }}>
              Des produits bio cultivés avec passion au cœur du Gabon
            </p>
          </div>
        </section>

        {/* Notre Histoire Section */}
        <section style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>À propos de nous</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Notre Histoire</h2>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: windowWidth < 768 ? 'column' : 'row', 
              gap: windowWidth < 768 ? '1.5rem' : '2rem', 
              flexWrap: 'wrap', 
              alignItems: 'center' 
            }}>
              {/* Image de gauche */}
              <div style={{ flex: '1 1 300px', minHeight: '300px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#eee' }}>
                <img 
                  src="https://imgur.com/pVlqrKq.jpeg" 
                  alt="Culture biologique SAFEM" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              {/* Texte central */}
              <div style={{ flex: '2 1 500px', textAlign: 'left', padding: '0 1rem' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                  <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>La SAFEM</span> met l'accent sur la durabilité et la qualité des produits. Nous utilisons des méthodes respectueuses de l'environnement en veillant à préserver notre environnement immédiat.
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                  Notre méthode repose sur la <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>permaculture</span> : utilisation de cendre de bois, de fiente de poule et de techniques peu consommatrices d'engrais chimiques. Nous avons planté <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>plus de 500 arbres fruitiers</span> pour enrichir notre écosystème.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                  Nous cultivons tous les produits de maraîchage (piment, tomates, poivrons, pastèques, carottes, aubergines, oseille, amarante, oignons, etc.) ainsi que des produits vivriers (banane plantain, taros, patates douces, igname, pomme de terre, etc.).
                </p>
                
                <div style={{ marginTop: '2rem' }}>
                  <a href="/about" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 'bold' }}>
                    En savoir plus
                  </a>
                </div>
              </div>
              
              {/* Image de droite */}
              <div style={{ flex: '1 1 300px', minHeight: '300px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#eee' }}>
                <img 
                  src="https://imgur.com/yq2XCym.jpeg" 
                  alt="Agriculture SAFEM Gabon" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nos valeurs Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#f9f9f9' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Notre philosophie</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Nos valeurs</h2>
              <p style={{ maxWidth: '700px', margin: '1rem auto 0', color: '#666', fontSize: '1.1rem' }}>
                Les quatre piliers qui guident nos actions et façonnent notre vision de l'agriculture durable au Gabon, inspirée des principes de permaculture et d'agroécologie
              </p>
            </div>
            
            {/* Grille de valeurs */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: windowWidth < 768 ? '1fr' : windowWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {/* Valeur 1 - TRAVAIL */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.8rem', 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#2E7D32',
                  width: '100%'
                }}></div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    color: '#2E7D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1.2rem'
                  }}>
                    <span role="img" aria-label="agriculture">🌱</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2E7D32' }}>TRAVAIL</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem' }}>
                    Le travail en agriculture représente nos efforts quotidiens pour cultiver des produits de qualité, de la préparation des sols à la récolte, en passant par le soin méticuleux apporté à chaque plante.
                  </p>
                </div>
              </div>
              
              {/* Valeur 2 - ENGAGEMENT */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.8rem',  
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#43A047',
                  width: '100%'
                }}></div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    color: '#43A047',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1.2rem'
                  }}>
                    <span role="img" aria-label="engagement">🤝</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#43A047' }}>ENGAGEMENT</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem' }}>
                    Notre passion et notre dévouement nous poussent à offrir des produits d'excellence, à préserver notre environnement et à soutenir les communautés locales gabonaises.
                  </p>
                </div>
              </div>
              
              {/* Valeur 3 - DURABILITÉ */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.8rem', 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#66BB6A',
                  width: '100%'
                }}></div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    color: '#66BB6A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1.2rem'
                  }}>
                    <span role="img" aria-label="durabilité">🍃</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#66BB6A' }}>DURABILITÉ</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem' }}>
                    Nous appliquons les principes de permaculture et d'agroécologie pour préserver les ressources naturelles du Gabon. Notre ferme à Meba pratique une agriculture à taux de rémanence réduit, garantissant le respect de la biodiversité et des écosystèmes locaux.
                  </p>
                </div>
              </div>
              
              {/* Valeur 4 - PROGRÈS */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.8rem', 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#81C784',
                  width: '100%'
                }}></div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    color: '#81C784',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1.2rem'
                  }}>
                    <span role="img" aria-label="progrès">🚀</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#81C784' }}>PROGRÈS</h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem' }}>
                    Nous innovons constamment pour améliorer nos méthodes agricoles, augmenter notre productivité et développer des solutions durables adaptées au contexte africain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir SAFEM Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Nos atouts</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Pourquoi choisir SAFEM ?</h2>
              <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', color: '#666', fontSize: '1.1rem' }}>
                Découvrez les raisons pour lesquelles nos clients nous font confiance pour leurs besoins en produits frais et biologiques
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: windowWidth < 768 ? 'repeat(1, 1fr)' : windowWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
              gap: '2rem', 
              marginTop: '2rem' 
            }}>
              {/* Argument 1 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌱</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Normes sanitaires strictes</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Tous nos produits respectent rigoureusement les normes sanitaires internationales avec un contrôle systématique des taux de rémanence des produits phytosanitaires, garantissant une qualité optimale pour votre santé.
                </p>
              </div>
              
              {/* Argument 2 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🍏</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Fraîcheur garantie</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  De la récolte à votre assiette en moins de 24h, nous garantissons des produits d'une fraîcheur et d'une saveur incomparables.
                </p>
              </div>
              
              {/* Argument 3 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🛎</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Service client premium</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Une équipe dédiée à votre écoute 7j/7 pour s'assurer que vous êtes pleinement satisfait de votre expérience SAFEM.
                </p>
              </div>
              
              {/* Argument 4 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📦</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Abonnements flexibles</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Choisissez la fréquence et le contenu de vos paniers selon vos besoins, avec possibilité de modifier ou suspendre à tout moment.
                </p>
              </div>
              
              {/* Argument 5 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🍽️</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Solutions professionnelles</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Des offres sur mesure pour les restaurants, hôtels et distributeurs avec livraison prioritaire et tarifs préférentiels.
                </p>
              </div>
              
              {/* Argument 6 */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '0.8rem', padding: '2rem', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#e8f5e9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌍</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Impact environnemental</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  En choisissant SAFEM, vous soutenez l'agriculture durable au Gabon et contribuez à réduire l'empreinte carbone alimentaire.
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="/why-safem" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', backgroundColor: '#2E7D32', color: 'white', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                En savoir plus sur nos engagements
              </a>
            </div>
          </div>
        </section>

        {/* Localisation Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#f9f9f9' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#f0f7f0', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Nous trouver</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>La SAFEM au Gabon</h2>
              <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', color: '#666', fontSize: '1.1rem' }}>
                Venez nous rendre visite et découvrir nos installations au cœur de la nature gabonaise
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: windowWidth < 1024 ? 'column' : 'row',
              gap: '2rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {/* Carte Google Maps */}
              <div style={{ 
                flex: '1 1 60%',
                height: windowWidth < 768 ? '350px' : '450px',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d64502.389840468095!2d9.726788060400507!3d0.4372064426224455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f0f8cef905057%3A0x58b30038aae2c488!2sMeba%2C%20Gabon!5e0!3m2!1sfr!2sfr!4v1747396142678!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              {/* Informations de contact */}
              <div style={{ flex: '1 1 40%', padding: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2E7D32' }}>Contactez-nous</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Adresse</h4>
                  <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                    Meba - Route de Cocobeach,<br />
                    à 9 Km de Ntoum, Gabon
                  </p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Heures d'ouverture</h4>
                  <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                    Lundi - Vendredi: 8h00 - 17h00<br />
                    Samedi: 9h00 - 13h00<br />
                    Dimanche: Fermé
                  </p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Contact</h4>
                  <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                    Téléphone: +241 77 123 456<br />
                    Email: contact@safem.ga
                  </p>
                </div>
                
                <a href="/contact" style={{ 
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2E7D32',
                  color: 'white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  marginTop: '1rem'
                }}>
                  Demander une visite
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Témoignages Section */}
        <section style={{ padding: '5rem 0', backgroundColor: '#f0f7f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: 'white', borderRadius: '2rem', color: '#2E7D32', fontSize: '0.9rem', fontWeight: 'bold' }}>Témoignages</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginTop: '1rem' }}>Ce que disent nos clients</h2>
              <p style={{ maxWidth: '700px', margin: '1.5rem auto 0', color: '#444', fontSize: '1.1rem' }}>
                Découvrez les expériences de nos clients qui ont choisi les produits SAFEM pour leur qualité exceptionnelle
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Témoignage 1 */}
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <img 
                    src="https://randomuser.me/api/portraits/women/12.jpg" 
                    alt="Marie Ndong" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Marie Ndong</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Libreville</p>
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  "Je suis ravie de la qualité des produits de SAFEM. Les légumes sont vraiment frais et savoureux! Mon alimentation s'est nettement améliorée depuis que je commande chez eux."
                </p>
                <div style={{ display: 'flex', color: '#FFB800' }}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              
              {/* Témoignage 2 */}
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Thomas Engonga" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Thomas Engonga</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Port-Gentil</p>
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  "Excellent service de livraison et produits de grande qualité. Je recommande vivement! C'est un plaisir de pouvoir compter sur des produits locaux aussi frais."
                </p>
                <div style={{ display: 'flex', color: '#FFB800' }}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>

              {/* Témoignage 3 */}
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <img 
                    src="https://randomuser.me/api/portraits/women/42.jpg" 
                    alt="Sylvie Mba" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Sylvie Mba</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Franceville</p>
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  "Grâce à SAFEM, je peux enfin cuisiner avec des produits bio et locaux. Merci! Je suis fidèle depuis plusieurs mois et je n'ai jamais été déçue."
                </p>
                <div style={{ display: 'flex', color: '#FFB800' }}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={{ 
          padding: '5rem 0', 
          backgroundImage: "url('/images/new banner bas .jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: 'white' 
        }}>
          {/* Overlay semi-transparent pour garantir la lisibilité */}
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1
          }}></div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>Prêt à devenir revendeur ?</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2.5rem', opacity: '0.9' }}>
              Rejoignez notre réseau de partenaires et distribuez des produits bio du Gabon dans votre région. Bénéficiez de nos conditions avantageuses et de notre support dédié.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a 
                href="/demo" 
                style={{ 
                  padding: '0.9rem 2rem', 
                  backgroundColor: 'white', 
                  color: '#2E7D32', 
                  borderRadius: '0.375rem', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                Devenir partenaire
              </a>
              <a 
                href="/contact" 
                style={{ 
                  padding: '0.9rem 2rem', 
                  backgroundColor: 'transparent', 
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '0.375rem', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Nos conditions
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f7f7f7', padding: '2rem 0', marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #eaeaea' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} SAFEM - Tous droits réservés</p>
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>Libreville, Gabon | info@safem-gabon.com | +241 074 589 632</p>
        </div>
      </footer>
      </ClientOnly>
    </div>
  );
}
