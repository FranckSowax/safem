/**
 * Utilitaires pour le formatage des prix
 */

/**
 * Formate un prix en devise
 * @param {number} price - Prix à formater
 * @param {string} currency - Code de la devise (XAF par défaut pour Franc CFA)
 * @param {string} locale - Locale pour le formatage (fr-FR par défaut)
 * @returns {string} Prix formaté
 */
export const formatPrice = (price, currency = 'XAF', locale = 'fr-FR') => {
  // S'assurer que le prix est un nombre
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return 'Prix non disponible';
  }
  
  try {
    // Utiliser l'API Intl pour formater le prix selon la locale
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  } catch (error) {
    // Fallback en cas d'erreur avec l'API Intl
    return `${numericPrice.toFixed(0)} ${currency}`;
  }
};

/**
 * Calcule le prix avec remise
 * @param {number} originalPrice - Prix original
 * @param {number} discountPercentage - Pourcentage de remise
 * @returns {number} Prix après remise
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (typeof originalPrice !== 'number' || typeof discountPercentage !== 'number') {
    return originalPrice;
  }
  
  return originalPrice * (1 - discountPercentage / 100);
};

/**
 * Formate un prix avec remise
 * @param {number} originalPrice - Prix original
 * @param {number} discountPercentage - Pourcentage de remise
 * @param {string} currency - Code de la devise
 * @param {string} locale - Locale pour le formatage
 * @returns {Object} Prix original et prix remisé formatés
 */
export const formatDiscountedPrice = (originalPrice, discountPercentage, currency = 'XAF', locale = 'fr-FR') => {
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);
  
  return {
    original: formatPrice(originalPrice, currency, locale),
    discounted: formatPrice(discountedPrice, currency, locale),
    savings: formatPrice(originalPrice - discountedPrice, currency, locale),
    percentOff: `${discountPercentage}%`
  };
};
