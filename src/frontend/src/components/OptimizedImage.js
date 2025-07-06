import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Composant d'image optimisé pour les connexions lentes
 * Implémente le chargement progressif et le fallback
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  layout = 'responsive',
  objectFit = 'cover',
  quality = 75,
  priority = false,
  placeholder = 'blur',
  className = '',
  blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmN2YwIi8+PC9zdmc+',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState('high');

  // Détection de la vitesse de connexion
  useEffect(() => {
    if (navigator.connection) {
      const { effectiveType } = navigator.connection;
      if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
        setConnectionSpeed('low');
      }
    }
  }, []);

  // Gestion des erreurs de chargement d'image
  const handleError = () => {
    setImgSrc('/images/placeholder-product.jpg');
  };

  // Qualité d'image adaptative selon la connexion
  const adaptiveQuality = connectionSpeed === 'low' ? 50 : quality;

  return (
    <div className={`optimized-image-wrapper ${className} ${isLoading ? 'is-loading' : 'is-loaded'}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        objectFit={objectFit}
        quality={adaptiveQuality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
        {...props}
      />
      <noscript>
        <img
          src={imgSrc}
          alt={alt}
          className="noscript-image"
          style={{ width: '100%', height: 'auto' }}
        />
      </noscript>
      
      <style jsx>{`
        .optimized-image-wrapper {
          position: relative;
          overflow: hidden;
        }
        .optimized-image-wrapper.is-loading {
          background-color: #f0f7f0;
        }
        .optimized-image-wrapper.is-loaded {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
        .noscript-image {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
