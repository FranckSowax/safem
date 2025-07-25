import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiShoppingCart, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Composant d'en-tête avec navigation responsive
 * Header unifié pour toutes les pages avec menu accordéon sur mobile
 */
const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return router.pathname === path;
  };
  
  // Fonction de bascule du menu sur mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo - avec dimensions fixes pour éviter la déformation */}
          <Link href="/" className="flex items-center no-underline">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <img 
                src="/images/safem-logo.png" 
                alt="SAFEM Logo" 
                className="object-contain w-full h-full"
              />
            </div>
            <span className="ml-2 text-[#2E7D32] font-heading font-medium text-lg sm:text-xl hidden sm:block">SAFEM</span>
          </Link>
          
          {/* Navigation principale - affichée uniquement sur desktop */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 list-none m-0 p-0 items-center">
              <li>
                <Link href="/" className={`${isActive('/') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] font-medium no-underline`}>Accueil</Link>
              </li>
              <li>
                <Link href="/products" className={`${isActive('/products') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] no-underline`}>Produits</Link>
              </li>
              <li>
                <Link href="/abonnements" className={`${isActive('/abonnements') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] no-underline`}>Abonnements</Link>
              </li>
              <li>
                <Link href="/boutique" className={`${isActive('/boutique') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] no-underline`}>Boutique Pro</Link>
              </li>
              <li>
                <Link href="/about" className={`${isActive('/about') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] no-underline`}>Notre Histoire</Link>
              </li>
              <li>
                <Link href="/contact" className={`${isActive('/contact') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] no-underline`}>Contact</Link>
              </li>
              <li>
                <Link href="/cart" className="relative inline-flex items-center p-2 text-gray-800 hover:text-[#2E7D32] no-underline">
                  <FiShoppingCart className="h-6 w-6" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#2E7D32] rounded-full">{cartCount}</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Bouton de panier et menu pour mobile */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Icône de panier sur mobile */}
            <Link href="/cart" className="relative inline-flex items-center text-gray-800 hover:text-[#2E7D32] no-underline">
              <FiShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 bg-[#2E7D32] text-white text-xs font-bold rounded-full">{cartCount}</span>
            </Link>
            
            {/* Bouton de menu pour mobile */}
            <button 
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} 
              className="text-gray-800 hover:text-[#2E7D32] focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Menu mobile en accordéon */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mt-4 animate-fadeIn">
            <nav>
              <ul className="flex flex-col space-y-4 list-none">
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/" 
                    className={`${isActive('/') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Accueil
                  </Link>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/products" 
                    className={`${isActive('/products') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Produits
                  </Link>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/abonnements" 
                    className={`${isActive('/abonnements') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Abonnements
                  </Link>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/boutique" 
                    className={`${isActive('/boutique') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Boutique Pro
                  </Link>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/about" 
                    className={`${isActive('/about') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Notre Histoire
                  </Link>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <Link 
                    href="/contact" 
                    className={`${isActive('/contact') ? 'text-[#2E7D32]' : 'text-gray-800'} hover:text-[#2E7D32] flex justify-between items-center w-full py-2 font-medium no-underline`}
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cart" 
                    className="text-gray-800 hover:text-[#2E7D32] block py-2 no-underline flex items-center"
                    onClick={toggleMenu}
                  >
                    <span className="mr-2">Panier</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Charger le nombre d'articles dans le panier au montage du composant
Header.getInitialProps = async (ctx) => {
  // Dans une implémentation réelle, nous chargerions le nombre depuis l'API ou localStorage
  return { initialCartCount: 0 };
};

export default Header;
