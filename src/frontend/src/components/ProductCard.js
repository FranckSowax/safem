import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

/**
 * Carte de produit
 * Affiche les informations principales d'un produit avec image et action d'achat
 */
const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const {
    slug,
    name,
    price,
    is_organic,
    is_featured,
    short_description,
    images
  } = product;

  // Utilise la première image ou une image par défaut
  const imageUrl = images && images.length > 0 && images[0].publicUrl
    ? images[0].publicUrl
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  
  // Texte alternatif pour l'image
  const imageAlt = images && images.length > 0 && images[0].alt_text
    ? images[0].alt_text
    : `Image de ${name}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart(product, 1);
      toast.success(`${name} ajouté au panier`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="card group bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all duration-300">
      {/* Badge pour produit mis en avant */}
      {is_featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            Populaire
          </span>
        </div>
      )}
      
      {/* Image du produit avec proportion fixe */}
      <Link href={`/products/${slug}`} className="block relative overflow-hidden group-hover:opacity-90 transition-opacity">
        <div className="relative pt-[100%] w-full"> {/* Ratio 1:1 */}
          <img 
            src={imageUrl} 
            alt={imageAlt} 
            className="absolute top-0 left-0 object-cover w-full h-full"
          />
        </div>
      </Link>
      
      {/* Informations du produit */}
      <div className="p-4">
        <Link href={`/products/${slug}`} className="block no-underline">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">{name}</h3>
        </Link>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-base sm:text-lg font-bold text-primary">{formatPrice(price)}</span>
          <button 
            onClick={handleAddToCart} 
            className="inline-flex items-center justify-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50 transition-colors text-sm"
            disabled={isAddingToCart}
            aria-label="Ajouter au panier"
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ajout...</span>
              </>
            ) : (
              <>
                <FiShoppingCart size={16} className="mr-1" />
                <span>Acheter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
