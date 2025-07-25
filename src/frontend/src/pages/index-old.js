import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

// Composant pour éviter les erreurs d'hydration
const ClientOnly = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
};

// Hook personnalisé pour la responsivité
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const { width: windowWidth } = useWindowSize();

  // Gestion du scroll pour les animations (simplifiée)
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer optimisé pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setIsVisible(prev => {
                if (prev[id]) return prev; // Éviter les re-rendus inutiles
                return { ...prev, [id]: true };
              });
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Déclencher un peu plus tôt pour éviter le clignotement
      }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Calcul de l'effet parallax avec useMemo pour optimiser
  const parallaxOffset = useMemo(() => scrollPosition * 0.5, [scrollPosition]);

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
      title: 'Agriculture Biologique',
      description: 'Produits 100% biologiques, cultivés sans pesticides ni produits chimiques.',
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
      content: 'Je recommande SAFEM à tous mes patients pour la qualité bio.',
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
        <title>SAFEM - Leader de l'Agriculture Biologique au Gabon</title>
        <meta name="description" content="SAFEM - Votre partenaire de confiance pour des produits biologiques de qualité supérieure, cultivés avec passion au cœur du Gabon" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              transform: `translateY(${parallaxOffset}px)`,
              willChange: 'transform', // Optimisation GPU
              backfaceVisibility: 'hidden', // Éviter le clignotement
              perspective: 1000 // Améliorer les performances 3D
            }}
          >
            {/* Overlay gradient moderne */}
            <div className="absolute inset-0 z-10" style={{
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.8) 0%, rgba(76, 175, 80, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)'
            }}></div>
            
            {/* Contenu hero */}
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center">
                {/* Badge premium */}
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
                  <span className="mr-2">⭐</span>
                  Leader de l'Agriculture Biologique au Gabon
                </div>
                
                {/* Titre principal */}
                <h1 className="text-white mb-6" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: windowWidth < 768 ? '2.5rem' : windowWidth < 1024 ? '3.5rem' : '4.5rem',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Des Produits Bio
                  <br />
                  <span style={{ color: '#81C784' }}>Cultivés avec Passion</span>
                </h1>
                
                {/* Sous-titre */}
                <p className="text-white/90 mb-8 max-w-3xl mx-auto" style={{
                  fontSize: windowWidth < 768 ? '1.1rem' : '1.3rem',
                  lineHeight: '1.6',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Découvrez l'excellence de l'agriculture biologique gabonaise avec SAFEM. 
                  Des produits frais, sains et durables, cultivés dans le respect de la nature et des traditions locales.
                </p>
                
                {/* Boutons CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/produits" className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Découvrir nos produits
                    <span className="ml-2">→</span>
                  </Link>
                  <Link href="/abonnements" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-300">
                    Nos abonnements
                    <span className="ml-2">❤️</span>
                  </Link>
                </div>
                
                {/* Badges de confiance */}
                <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-white/80">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">100% Bio</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🚚</span>
                    <span className="text-sm">Livraison 24h</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🛡️</span>
                    <span className="text-sm">Qualité Garantie</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Statistiques & Impact */}
          <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50" id="stats" data-animate>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <span className="mr-2">⭐</span>
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
                  return (
                    <div key={index} className={`text-center transform transition-all duration-700 ${
                      isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`} style={{ transitionDelay: `${index * 100}ms` }}>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${stat.color}20` }}>
                        <span className="text-3xl">{getStatEmoji(index)}</span>
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
                  <span className="mr-2">🛡️</span>
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
                  return (
                    <div key={index} className={`group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl transform ${
                      isVisible.benefits ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`} style={{ transitionDelay: `${index * 150}ms` }}>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${benefit.color}20` }}>
                        <span className="text-2xl">{getBenefitEmoji(index)}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section Produits Vedettes */}
          <section className="py-20 bg-gray-50" id="products" data-animate>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <span className="mr-2">🌱</span>
                  Nos Produits
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Fraîcheur & Qualité
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Découvrez notre sélection de produits biologiques cultivés avec soin dans nos fermes
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Produit 1 */}
                <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                  isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-6xl">🍅</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tomates Bio</h3>
                    <p className="text-gray-600 mb-4">Tomates fraîches cultivées sans pesticides, riches en saveur et en nutriments.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">1500 FCFA/kg</span>
                      <Link href="/produits" className="text-green-600 hover:text-green-700 font-medium">
                        Voir plus →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Produit 2 */}
                <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                  isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '150ms' }}>
                  <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <span className="text-6xl">🌶️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Piments Bio</h3>
                    <p className="text-gray-600 mb-4">Piments authentiques du Gabon, parfaits pour relever vos plats traditionnels.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">2000 FCFA/kg</span>
                      <Link href="/produits" className="text-green-600 hover:text-green-700 font-medium">
                        Voir plus →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Produit 3 */}
                <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                  isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '300ms' }}>
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-6xl">🍌</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Bananes Plantain</h3>
                    <p className="text-gray-600 mb-4">Bananes plantain fraîches, base de l'alimentation gabonaise traditionnelle.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">1000 FCFA/kg</span>
                      <Link href="/produits" className="text-green-600 hover:text-green-700 font-medium">
                        Voir plus →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/produits" className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Voir tous nos produits
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Section Témoignages */}
          <section className="py-20 bg-white" id="testimonials" data-animate>
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
                  <div key={index} className={`bg-gray-50 rounded-2xl p-8 transform transition-all duration-700 ${
                    isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: `${index * 200}ms` }}>
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

          {/* Section CTA Final */}
          <section className="py-20 bg-gradient-to-r from-green-600 to-green-700" id="cta" data-animate>
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Prêt à Découvrir SAFEM ?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers de clients satisfaits et découvrez le goût authentique de l'agriculture biologique gabonaise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/produits" className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Commander maintenant
                  <span className="ml-2">→</span>
                </Link>
                <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-green-700 transition-all duration-300">
                  Nous contacter
                  <span className="ml-2">📞</span>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-green-100">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Libreville, Gabon</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🕐</span>
                  <span>Livraison 7j/7</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+241 XX XX XX XX</span>
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
                  Leader de l'agriculture biologique au Gabon, cultivant l'excellence depuis plus de 15 ans.
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
                  <li><Link href="/produits" className="hover:text-white transition-colors">Tous nos produits</Link></li>
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
