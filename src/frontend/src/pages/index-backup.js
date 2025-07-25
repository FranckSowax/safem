import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

// Hook pour la taille de la fenêtre
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

export default function HomePage() {
  const [isVisible, setIsVisible] = useState({});
  const { width: windowWidth } = useWindowSize();

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setIsVisible(prev => {
                if (prev[id]) return prev;
                return { ...prev, [id]: true };
              });
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>SAFEM - L'Avenir de l'Agriculture au Gabon</title>
        <meta name="description" content="Leader de l'agriculture moderne au Gabon. Produits frais, de qualité et durables livrés directement chez vous." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="overflow-hidden">
        {/* Hero Section - Welcome to the Future of Agriculture */}
        <section className="relative min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-green-600/20 backdrop-blur-sm rounded-full border border-green-400/30 mb-6">
                  <span className="text-green-300 text-sm font-medium">🌱 Leader de l'Agriculture Moderne</span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  Bienvenue dans le
                  <span className="block text-green-300">Futur de l'Agriculture</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-lg">
                  Révolutionnons ensemble l'agriculture gabonaise avec des produits de qualité supérieure, 
                  cultivés avec passion et livrés avec soin.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/produits" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Découvrir nos produits
                    <span className="ml-2">→</span>
                  </Link>
                  <Link href="/abonnements" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-green-900 font-semibold rounded-full transition-all duration-300">
                    Nos abonnements
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-6 text-sm text-green-200">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    100% Qualité
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    Livraison 24h
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    Qualité Garantie
                  </div>
                </div>
              </div>

              {/* Right Content - Certificate/Stats Card */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Certification Qualité</h3>
                    <p className="text-green-200">Certifié par les autorités gabonaises</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-300">15+</div>
                      <div className="text-sm text-green-200">Années d'expérience</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-300">10k+</div>
                      <div className="text-sm text-green-200">Clients satisfaits</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-300">500+</div>
                      <div className="text-sm text-green-200">Hectares cultivés</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-300">50+</div>
                      <div className="text-sm text-green-200">Livraisons/jour</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Découvrir</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Changing the World */}
        <section className="py-20 bg-gray-50" id="mission" data-animate>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Image */}
              <div className="relative">
                <div className="aspect-[4/3] bg-green-100 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/agriculture-moderne.jpg" 
                    alt="Agriculture moderne SAFEM"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Overlay pattern like in capture */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>

              {/* Right - Benefits Panel (Yellow/Green like capture) */}
              <div className="bg-gradient-to-br from-yellow-200 via-lime-200 to-green-300 p-12 flex items-center">
                <div className="w-full">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                    Avantages Modernes et Futuristes :
                  </h2>

                  <div className="space-y-6">
                    {/* Precision Farming */}
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm">📍</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Agriculture de Précision</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Utilisation de drones, capteurs IoT et analyse de données pour optimiser 
                          les rendements et réduire les coûts de production.
                        </p>
                      </div>
                    </div>

                    {/* Sustainable Innovations */}
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm">🌱</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Innovations Durables</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Méthodes agricoles respectueuses de l'environnement, gestion 
                          intelligente de l'eau et techniques de culture régénérative.
                        </p>
                      </div>
                    </div>

                    {/* Smart Automation */}
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Automatisation Intelligente</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Robots agricoles, systèmes d'irrigation automatisés et machines 
                          intelligentes pour une productivité maximale.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <div className="mt-10">
                    <Link href="/about" className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg">
                      En savoir plus sur nos innovations
                      <span className="ml-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-sm">→</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Right Time to Get Into Farming */}
        <section className="py-20 bg-green-600" id="opportunity" data-animate>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                C'est le bon moment pour
                <span className="block">se lancer dans l'agriculture</span>
              </h2>
              
              <p className="text-xl text-green-100 mb-12 leading-relaxed">
                Le Gabon mise sur l'agriculture durable. Rejoignez le mouvement et 
                découvrez les opportunités infinies de l'agriculture moderne et innovante.
              </p>

              {/* Drone/Technology Image */}
              <div className="relative mb-12">
                <div className="aspect-[16/9] bg-green-700 rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🚁</div>
                      <p className="text-lg">Technologie Agricole Moderne</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/boutique" className="inline-flex items-center px-8 py-4 bg-white text-green-600 hover:bg-green-50 font-semibold rounded-full transition-all duration-300 shadow-lg">
                Découvrir notre matériel agricole
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section - Traditional vs Modern Farming */}
        <section className="py-20 bg-white" id="comparison" data-animate>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                L'agriculture traditionnelle rencontre l'innovation moderne
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nous combinons les savoirs ancestraux avec les technologies les plus avancées 
                pour une agriculture efficace, durable et respectueuse.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Traditional */}
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🌾</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Savoir Traditionnel</h3>
                <p className="text-gray-600">
                  Techniques ancestrales transmises de génération en génération, 
                  respectueuses de la terre et des cycles naturels.
                </p>
              </div>

              {/* Plus Icon */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+</span>
                </div>
              </div>

              {/* Modern */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation Moderne</h3>
                <p className="text-gray-600">
                  Technologies de pointe, analyses de sol, irrigation intelligente 
                  et monitoring en temps réel pour optimiser les rendements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Testimonials */}
        <section className="py-20 bg-gray-50" id="testimonials" data-animate>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ce que disent nos clients
              </h2>
              <p className="text-xl text-gray-600">
                Plus de 10 000 clients nous font confiance au quotidien
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">MN</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Marie Nguema</h4>
                    <p className="text-gray-600 text-sm">Restauratrice</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Les produits SAFEM sont d'une fraîcheur exceptionnelle. 
                  Mes clients adorent la qualité et le goût authentique !"
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">JO</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Jean-Pierre Obame</h4>
                    <p className="text-gray-600 text-sm">Chef de famille</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Depuis que j'achète chez SAFEM, ma famille mange plus sainement. 
                  La livraison est toujours ponctuelle !"
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">SM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sylvie Mba</h4>
                    <p className="text-gray-600 text-sm">Nutritionniste</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Je recommande SAFEM à tous mes patients. 
                  La qualité des produits est irréprochable !"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Latest Updates */}
        <section className="py-20 bg-white" id="updates" data-animate>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Dernières Actualités
              </h2>
              <p className="text-xl text-gray-600">
                Restez informé de nos dernières innovations et récoltes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Update 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] bg-green-100 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🌱</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  Nouvelle récolte de tomates
                </h3>
                <p className="text-gray-600 mb-4">
                  Découvrez notre dernière récolte de tomates de qualité supérieure, 
                  cultivées avec amour dans nos serres modernes.
                </p>
                <div className="text-sm text-gray-500">Il y a 2 jours</div>
              </div>

              {/* Update 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] bg-blue-100 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🚁</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  Innovation technologique
                </h3>
                <p className="text-gray-600 mb-4">
                  Nous avons intégré des drones pour le monitoring de nos cultures, 
                  optimisant ainsi la qualité de nos produits.
                </p>
                <div className="text-sm text-gray-500">Il y a 1 semaine</div>
              </div>

              {/* Update 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] bg-yellow-100 rounded-xl overflow-hidden mb-6">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🏆</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  Certification excellence
                </h3>
                <p className="text-gray-600 mb-4">
                  SAFEM reçoit la certification d'excellence pour ses pratiques 
                  agricoles durables et responsables.
                </p>
                <div className="text-sm text-gray-500">Il y a 2 semaines</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Join Us Now */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700" id="cta" data-animate>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Rejoignez-nous Maintenant
            </h2>
            <p className="text-xl text-green-100 mb-12 leading-relaxed">
              Découvrez l'agriculture du futur et faites partie de la révolution verte au Gabon. 
              Ensemble, cultivons un avenir plus durable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/produits" className="inline-flex items-center px-8 py-4 bg-white text-green-600 hover:bg-green-50 font-semibold rounded-full transition-all duration-300 shadow-lg">
                Commander maintenant
                <span className="ml-2">→</span>
              </Link>
              <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-all duration-300">
                Nous contacter
              </Link>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-8 text-green-100">
              <div className="flex items-center justify-center">
                <span className="mr-3">📍</span>
                <div>
                  <div className="font-semibold">Localisation</div>
                  <div className="text-sm">Libreville, Gabon</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-3">🕐</span>
                <div>
                  <div className="font-semibold">Horaires</div>
                  <div className="text-sm">Lun-Sam 8h-18h</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-3">📞</span>
                <div>
                  <div className="font-semibold">Contact</div>
                  <div className="text-sm">+241 XX XX XX XX</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {/* SAFEM */}
              <div>
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-2">🌱</span>
                  <span className="text-xl font-bold">SAFEM</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Leader de l'agriculture biologique au Gabon, 
                  cultivant l'avenir avec passion et durabilité.
                </p>
              </div>

              {/* Produits */}
              <div>
                <h3 className="font-semibold mb-4">Produits</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/produits" className="hover:text-white transition-colors">Tous nos produits</Link></li>
                  <li><Link href="/abonnements" className="hover:text-white transition-colors">Abonnements</Link></li>
                  <li><Link href="/boutique" className="hover:text-white transition-colors">Matériel agricole</Link></li>
                </ul>
              </div>

              {/* Entreprise */}
              <div>
                <h3 className="font-semibold mb-4">Entreprise</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-3">📧</span>
                    <span>contact@safem.ga</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📞</span>
                    <span>+241 XX XX XX XX</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📍</span>
                    <span>Libreville, Gabon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 SAFEM. Tous droits réservés. Cultivons ensemble l'avenir du Gabon.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
