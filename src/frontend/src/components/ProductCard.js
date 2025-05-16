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

  return (
    <div className="card group">
      {/* Badge pour produit mis en avant */}
      {is_featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            Populaire
          </span>
        </div>
      )}
      
      {/* Image du produit avec effet de zoom au survol */}
      <div className="relative h-48 overflow-hidden">
        <Link href={`/products/${slug}`}>
          <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
            <div className="relative w-full h-full">
              <img 
                src={imageUrl} 
                alt={imageAlt} 
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Informations sur le produit */}
      <div className="p-4">
        <Link href={`/products/${slug}`} className="block">
          <h3 className="font-heading font-medium text-lg mb-1 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-text-light text-sm mb-2 line-clamp-2">
          {short_description || 'Produit frais de qualité premium, cultivé localement au Gabon.'}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-lg">{formatPrice(price)}</span>
          
          <button 
            className="btn-primary py-1.5 px-3 flex items-center justify-center"
            aria-label={`Ajouter ${name} au panier`}
            disabled={isAddingToCart}
            onClick={async (e) => {
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
            }}
          >
            <FiShoppingCart className="mr-1" />
            <span>{isAddingToCart ? 'Ajout...' : 'Acheter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
