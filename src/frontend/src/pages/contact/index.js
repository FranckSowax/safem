import React, { useState } from 'react';
import Head from 'next/head';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheck } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';

/**
 * Page de contact de la SAFEM
 */
export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    submitted: false,
    error: false
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dans un cas réel, vous enverriez les données à une API
    // Pour cette démonstration, nous simulons simplement une soumission réussie
    setFormState({
      ...formState,
      submitted: true
    });
  };

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  return (
    <MainLayout>
      <Head>
        <title>Contact | SAFEM</title>
        <meta name="description" content="Contactez la SAFEM pour plus d'informations sur nos produits frais et durables, ou pour organiser une visite à notre ferme au Gabon." />
      </Head>

      {/* Section Hero avec bannière */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28 relative bg-gray-50">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            style={{ 
              backgroundImage: "url('/static/banner_contact.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            aria-label="SAFEM - Contact"
            className="banner-image"
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 sm:mb-4 text-white drop-shadow-lg">Contactez-nous</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white opacity-90 mb-4 sm:mb-6 drop-shadow-md">
              Nous sommes à votre écoute
            </p>
            <div className="h-1 w-16 sm:w-20 bg-white opacity-80 mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-white opacity-90 drop-shadow-md max-w-lg sm:max-w-xl md:max-w-2xl">
              N'hésitez pas à nous contacter pour toute question concernant nos produits, nos services ou pour planifier une visite à notre ferme.
            </p>
          </div>
        </div>
      </section>

      {/* Section principale avec carte et infos de contact */}
      <section className="py-8 sm:py-10 md:py-16 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Carte Google Maps - Placée en second dans l'ordre pour les mobiles mais affichée en premier sur desktop */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-4 sm:mb-6 text-gray-800">Notre localisation</h2>
              <div className="rounded-lg overflow-hidden shadow-md h-[300px] sm:h-[350px] md:h-[450px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d64502.389840468095!2d9.726788060400507!3d0.4372064426224455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f0f8cef905057%3A0x58b30038aae2c488!2sMeba%2C%20Gabon!5e0!3m2!1sfr!2sfr!4v1747396142678!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation de la SAFEM"
                  aria-label="Carte Google Maps montrant l'emplacement de la SAFEM à Meba, Gabon"
                />
              </div>
            </div>
            
            {/* Informations de contact - Affiché en premier sur mobile */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-4 sm:mb-6 text-gray-800">Coordonnées</h2>
              
              <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 shadow-sm mb-6 sm:mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Adresse */}
                  <div className="flex items-start">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <FiMapPin className="text-primary-700 text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base sm:text-lg mb-1 sm:mb-2">Adresse</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Meba - Route de Cocobeach,<br />
                        à 9 Km de Ntoum, Gabon
                      </p>
                    </div>
                  </div>
                  
                  {/* Téléphone */}
                  <div className="flex items-start">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <FiPhone className="text-primary-700 text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base sm:text-lg mb-1 sm:mb-2">Téléphone</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        <a href="tel:+24177123456" className="hover:text-primary-700 active:text-primary-800 touch-target-extra">
                          +241 77 123 456
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <FiMail className="text-primary-700 text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base sm:text-lg mb-1 sm:mb-2">Email</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        <a href="mailto:contact@safem.ga" className="hover:text-primary-700 active:text-primary-800 touch-target-extra">
                          contact@safem.ga
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  {/* Heures d'ouverture */}
                  <div className="flex items-start">
                    <div className="bg-primary-50 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <FiClock className="text-primary-700 text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base sm:text-lg mb-1 sm:mb-2">Heures d'ouverture</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Lundi - Vendredi: 8h00 - 17h00<br />
                        Samedi: 9h00 - 13h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Visites */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-primary-700 text-base sm:text-lg" />
                    </div>
                    <h3 className="font-heading font-medium text-base sm:text-lg">Visite de la ferme sur rendez-vous</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    Nous vous proposons des visites guidées de notre ferme pour découvrir nos méthodes de culture durables et notre engagement pour une agriculture responsable.
                  </p>
                  <a 
                    href="#contact-form" 
                    className="inline-block bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base touch-target-extra"
                  >
                    Demander une visite
                  </a>
                </div>
              </div>
              
              {/* Réseaux sociaux */}
              <div className="mt-6 sm:mt-8">
                <h3 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">Suivez-nous</h3>
                <div className="flex space-x-5">
                  <a 
                    href="https://facebook.com/safem" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors touch-target-extra"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="text-sm sm:text-base" />
                  </a>
                  <a 
                    href="https://instagram.com/safem" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors touch-target-extra"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-sm sm:text-base" />
                  </a>
                  <a 
                    href="https://twitter.com/safem" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors touch-target-extra"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-sm sm:text-base" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Formulaire de contact */}
      <section id="contact-form" className="py-8 sm:py-10 md:py-16 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-3 sm:mb-4">Envoyez-nous un message</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Vous avez des questions sur nos produits, nos services ou souhaitez planifier une visite ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {formState.submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-5 sm:p-6 text-center">
                <FiCheck className="text-green-600 text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 text-green-700">Message envoyé avec succès !</h3>
                <p className="text-green-600 text-sm sm:text-base">
                  Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5 sm:mb-6">
                  {/* Nom */}
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5 sm:mb-6">
                  {/* Téléphone */}
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+241 XX XXX XXX"
                    />
                  </div>
                  
                  {/* Sujet */}
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2">Sujet *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="information">Demande d'information</option>
                      <option value="order">Commander des produits</option>
                      <option value="visit">Planifier une visite</option>
                      <option value="partnership">Proposition de partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>
                
                {/* Message */}
                <div className="mb-5 sm:mb-6">
                  <label htmlFor="message" className="block text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Votre message ici..."
                  ></textarea>
                </div>
                
                <div className="flex justify-center sm:justify-end">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-8 w-full sm:w-auto rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
