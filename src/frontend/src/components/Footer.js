import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import NewsletterForm from './NewsletterForm';

/**
 * Composant de pied de page
 */
const Footer = () => {
  return (
    <footer className="text-white relative" style={{
      backgroundImage: "url('/images/new banner bas .jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }}>
      {/* Overlay vert transparent */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary-800 bg-opacity-85"></div>
      
      {/* Contenu du footer avec position relative pour s'afficher au-dessus de l'overlay */}
      <div className="relative z-10">
      {/* Section principale du footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et courte description */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="font-heading font-bold text-xl">SAFEM</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Une Ferme et une plateforme de produits frais, locaux et durables du Gabon.
              Notre coopérative agricole promeut des pratiques respectueuses de l'environnement.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex space-x-4 mt-4">
              <SocialLink href="https://facebook.com/safem" icon={<FiFacebook size={20} />} label="Facebook" />
              <SocialLink href="https://instagram.com/safem" icon={<FiInstagram size={20} />} label="Instagram" />
              <SocialLink href="https://twitter.com/safem" icon={<FiTwitter size={20} />} label="Twitter" />
            </div>
          </div>

          {/* Coordonnées et carte */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Nous contacter</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mr-2 mt-1 text-primary-300" />
                <span>Meba - Route de Cocobeach,<br />à 9 Km de Ntoum, Gabon</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 text-primary-300" />
                <span>+241 77 123 456</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 text-primary-300" />
                <span>contact@safem.ga</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-md p-2 text-center text-sm">
              <p className="text-black font-medium">Visite de la ferme sur rendez-vous</p>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <FooterLink href="/products">Nos produits</FooterLink>
              <FooterLink href="/about">Notre histoire</FooterLink>
              <FooterLink href="/subscription-plans">Abonnements</FooterLink>
              <FooterLink href="/events">Événements à la ferme</FooterLink>
            </ul>
          </div>

          {/* Inscription newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Inscrivez-vous pour recevoir nos actualités et offres spéciales.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Copyright et mentions légales */}
      <div className="bg-primary-900 py-4">
        <div className="container-custom text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SAFEM. Tous droits réservés.</p>
        </div>
      </div>
      </div>
    </footer>
  );
};

// Composant lien de pied de page
const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-gray-300 hover:text-white transition-colors">
      {children}
    </Link>
  </li>
);

// Composant lien de réseau social
const SocialLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-primary-700 hover:bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
