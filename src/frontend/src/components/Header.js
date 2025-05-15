import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';

/**
 * Composant d'en-tête avec navigation responsive
 * Style correspondant à la page d'accueil
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Fonction de bascule du menu sur mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <img 
                src="/images/safem-logo.png" 
                alt="SAFEM Logo" 
                className="h-20 w-auto"
              />
            </div>
          </Link>
          
          {/* Navigation principale - affichée uniquement sur desktop */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 list-none m-0 p-0 items-center">
              <li>
                <Link href="/" className="text-[#2E7D32] hover:text-green-700 font-medium no-underline">Accueil</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-800 hover:text-[#2E7D32] no-underline">Produits</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-800 hover:text-[#2E7D32] no-underline">Notre Histoire</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-800 hover:text-[#2E7D32] no-underline">Contact</Link>
              </li>
              <li>
                <Link href="/cart" className="relative inline-flex items-center p-2 text-gray-800 hover:text-[#2E7D32] no-underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#2E7D32] rounded-full">0</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Bouton de menu pour mobile */}
          <button 
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} 
            className="md:hidden text-gray-800 hover:text-[#2E7D32]"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav>
              <ul className="flex flex-col space-y-3 list-none">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-800 hover:text-[#2E7D32] block py-2 no-underline"
                    onClick={toggleMenu}
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="text-gray-800 hover:text-[#2E7D32] block py-2 no-underline"
                    onClick={toggleMenu}
                  >
                    Produits
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-800 hover:text-[#2E7D32] block py-2 no-underline"
                    onClick={toggleMenu}
                  >
                    Notre Histoire
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-gray-800 hover:text-[#2E7D32] block py-2 no-underline"
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

export default Header;
