import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import { FiArrowRight, FiBriefcase, FiHeart, FiTrendingUp, FiGlobe } from 'react-icons/fi';

/**
 * Page Notre Histoire présentant la SAFEM
 */
export default function AboutPage() {
  // Pas d'effet parallaxe
  
  return (
    <MainLayout>
      <Head>
        <title>Notre Histoire | SAFEM</title>
        <meta name="description" content="Découvrez l'histoire et les valeurs de la SAFEM - Une agriculture durable et de qualité au Gabon" />
      </Head>

      {/* Section Hero avec bannière */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28 relative bg-gray-50">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            style={{ 
              backgroundImage: "url('/static/banner_notre_histoire.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            aria-label="SAFEM - Notre Histoire"
            className="banner-image"
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">Notre Histoire</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white opacity-90 mb-4 sm:mb-6 drop-shadow-md">
              Une vision durable de l'agriculture gabonaise
            </p>
            <div className="h-1 w-16 sm:w-20 bg-white opacity-80 mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-white opacity-90 drop-shadow-md max-w-lg sm:max-w-xl md:max-w-2xl">
              Découvrez comment la SAFEM contribue à l'excellence agricole au service du développement du Gabon.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Présentation de la Ferme */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container-custom animate-fade-in-up px-4 sm:px-6">
          <div className="mb-8 sm:mb-12 text-center">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-xs sm:text-sm mb-3 sm:mb-4">Notre Ferme</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">Présentation de la SAFEM</h2>
            <div className="h-1 w-16 sm:w-20 bg-primary-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto">
              La SAFEM met l'accent sur la durabilité et la qualité des produits, en adoptant des méthodes respectueuses de l'environnement telles que la permaculture.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-10 sm:mb-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-3 sm:mb-4">Nos pratiques agricoles durables</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1 flex-shrink-0">✓</span>
                  <span>Utilisation de cendre de bois comme amendement naturel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1 flex-shrink-0">✓</span>
                  <span>Utilisation de fiente de poule comme engrais organique</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1 flex-shrink-0">✓</span>
                  <span>Minimisation de l'usage d'engrais chimiques</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1 flex-shrink-0">✓</span>
                  <span>Plus de 500 arbres fruitiers plantés pour favoriser la biodiversité</span>
                </li>
              </ul>
              
              <div className="mt-6 sm:mt-8">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-3 sm:mb-4">Nos cultures</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <h4 className="font-heading font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Produits maraîchers</h4>
                    <p className="text-gray-700 text-sm sm:text-base">Piments, tomates, poivrons, pastèques, carottes, aubergines, oseille, amarante, oignons, etc.</p>
                  </div>
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <h4 className="font-heading font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Produits vivriers</h4>
                    <p className="text-gray-700 text-sm sm:text-base">Banane plantain, taros, patates douces, ignames, pommes de terre, etc.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image de la ferme avec les cultures */}
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-xl mb-8 md:mb-0 order-1 md:order-2">
              <div className="relative" style={{ height: "300px", maxHeight: "50vh" }}>
                <div 
                  style={{ 
                    backgroundImage: "url('/static/notre_histoire1.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                  }}
                  aria-label="SAFEM - Cultures durables"
                  className="banner-image"
                ></div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-base sm:text-lg text-gray-800 font-medium italic">
              La SAFEM est fière de promouvoir une agriculture durable au bénéfice de la communauté.
            </p>
          </div>
        </div>
      </section>
      
      {/* Section 2: Nos Valeurs */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container-custom animate-fade-in-up delay-100 px-4 sm:px-6">
          <div className="mb-8 sm:mb-12 text-center">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-xs sm:text-sm mb-3 sm:mb-4">Notre Philosophie</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">Nos Valeurs</h2>
            <div className="h-1 w-16 sm:w-20 bg-primary-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto">
              La SAFEM porte ses valeurs autour de quatre piliers qui guident notre vision de l'agriculture gabonaise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {/* Valeur 1 - Travail */}
            <div className="bg-white rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <FiBriefcase className="text-primary-700 text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-1 sm:mb-2">Travail en agriculture</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Cela englobe toutes les activités physiques et mentales nécessaires à la production agricole, de la préparation du sol jusqu'à la récolte, en passant par l'élevage.
                </p>
              </div>
            </div>
            
            {/* Valeur 2 - Engagement */}
            <div className="bg-white rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <FiHeart className="text-primary-700 text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-1 sm:mb-2">Engagement</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Passion et dévouement des agriculteurs à produire des aliments de qualité tout en préservant l'environnement, respectant les normes de durabilité et contribuant positivement à la communauté.
                </p>
              </div>
            </div>
            
            {/* Valeur 3 - Durabilité */}
            <div className="bg-white rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <FiGlobe className="text-primary-700 text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-1 sm:mb-2">Durabilité</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Produire de manière responsable en préservant les ressources naturelles (eau, sol, biodiversité), en réduisant les émissions de gaz à effet de serre et en limitant l'utilisation de produits chimiques.
                </p>
              </div>
            </div>
            
            {/* Valeur 4 - Progrès */}
            <div className="bg-white rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <FiTrendingUp className="text-primary-700 text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-1 sm:mb-2">Progrès</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Recherche continue d'innovation et d'améliorations visant à accroître l'efficacité, la productivité et la durabilité à travers l'adoption de technologies nouvelles et des méthodes agricoles avancées.
                </p>
              </div>
            </div>
          </div>
          
          {/* Bannière illustrative simple */}
          <div className="relative rounded-xl overflow-hidden h-64 sm:h-72 md:h-80 mt-8 sm:mt-10 md:mt-12">
            <div className="absolute inset-0">
              <div 
                style={{ 
                  backgroundImage: "url('/static/banner_farmer.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "absolute",
                  width: "100%",
                  height: "100%"
                }}
                aria-label="Une agriculture responsable pour le Gabon"
                className="banner-image"
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white max-w-xl px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 sm:mb-4 text-white">Une agriculture responsable pour le Gabon</h3>
                <p className="text-sm sm:text-base md:text-lg opacity-90">Notre ambition est de contribuer à un avenir agricole durable, respectueux des écosystèmes et profitable aux communautés locales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 3: Notre Équipe */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="container-custom animate-fade-in-up delay-200 px-4 sm:px-6">
          <div className="mb-6 sm:mb-8 md:mb-10 text-center">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-xs sm:text-sm mb-3 sm:mb-4">Les Experts</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">Notre Équipe</h2>
            <div className="h-1 w-16 sm:w-20 bg-primary-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto">
              La SAFEM dispose d'une équipe jeune et qualifiée qui s'engage pour l'excellence agricole et le développement du Gabon.
            </p>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row gap-6 sm:gap-8 md:gap-10 items-start mb-8 sm:mb-10 md:mb-12">
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-3 sm:mb-5">Une équipe jeune et qualifiée</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-primary-50 text-primary-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 mr-3 font-medium">1</div>
                  <div>
                    <span className="block font-medium text-primary-700 mb-1 text-base">5 techniciens agricoles</span>
                    <span className="text-gray-600 text-sm sm:text-base">Formés à l'école des cadres d'Oyem (Certificat d'aptitude aux sciences agricoles)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-50 text-primary-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 mr-3 font-medium">2</div>
                  <div>
                    <span className="block font-medium text-primary-700 mb-1 text-base">1 spécialiste de la banane plantain</span>
                    <span className="text-gray-600 text-sm sm:text-base">Formé par le PNUD (Programme des Nations Unies pour le développement)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-50 text-primary-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 mr-3 font-medium">3</div>
                  <div>
                    <span className="block font-medium text-primary-700 mb-1 text-base">2 ouvriers agricoles</span>
                    <span className="text-gray-600 text-sm sm:text-base">Expérimentés dans les techniques agricoles locales</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 sm:mt-8">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold mb-3 sm:mb-4">Notre mission</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                  Notre objectif principal est de contribuer à l'autosuffisance alimentaire du Gabon et de l'Afrique centrale, en fournissant des produits de qualité, en soutenant l'emploi des jeunes, et en améliorant les balances commerciale et des paiements du pays.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  La ferme ambitionne également d'industrialiser et automatiser ses activités afin d'accroître sa production et participer au développement économique local.
                </p>
              </div>
            </div>
            
            {/* Image de l'équipe avec une mise en page circulaire */}
            <div className="w-full md:w-1/2">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div 
                  style={{ 
                    backgroundImage: "url('/static/image_histoire4.jpg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    height: "280px",
                    maxHeight: "40vh",
                    width: "100%",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f3f4f6"
                  }}
                  aria-label="Équipe SAFEM"
                  className="banner-image"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section CTA */}
      <section className="py-12 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Découvrez nos produits cultivés à Meba</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Venez découvrir nos produits frais cultivés selon des pratiques durables à notre ferme située à Meba, sur la route de Cocobeach.
          </p>
          <Link href="/products" className="inline-flex items-center bg-white text-primary-800 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
            Voir nos produits
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
