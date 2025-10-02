// Temporairement désactivé jusqu'à ce que le backend soit disponible
// import supabase from './supabaseClient';
// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Données fictives pour les produits en cas d'échec des API
const mockProducts = [
  {
    id: 1,
    name: 'Piment',
    slug: 'piment',
    price: 2800,
    description: 'Piments frais et colorés, parfaits pour relever vos plats',
    images: [{ publicUrl: '/images/piments.webp' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 2,
    name: 'Tomates',
    slug: 'tomates',
    price: 2500,
    description: 'Tomates fraîches et juteuses, cultivées en pleine terre',
    images: [{ publicUrl: '/images/tomate.webp' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 3,
    name: 'Poivrons',
    slug: 'poivrons',
    price: 3000,
    description: 'Poivrons multicolores, riches en vitamines et saveurs',
    images: [{ publicUrl: '/images/poivrons.webp' }],
    category: 'legumes',
    is_organic: false,
  },
  {
    id: 4,
    name: 'Pastèques',
    slug: 'pasteques',
    price: 2000,
    description: 'Pastèques fraîches et sucrées, cultivées à Meba',
    images: [{ publicUrl: '/images/pasteque.webp' }],
    category: 'fruits',
    is_organic: true,
  },
  {
    id: 5,
    name: 'Oignons',
    slug: 'oignons',
    price: 3500,
    description: 'Oignons frais de qualité supérieure, cultivés à Meba sur la route de Cocobeach',
    images: [{ publicUrl: '/images/oignons.webp' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 6,
    name: 'Carottes',
    slug: 'carottes',
    price: 1500,
    description: 'Carottes fraîches et croquantes, cultivées selon des principes de permaculture à Meba',
    images: [{ publicUrl: '/images/carotte.webp' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 7,
    name: 'Aubergines',
    slug: 'aubergines',
    price: 4000,
    description: 'Aubergines fraîches et fermes, cultivées dans notre ferme à Meba sans pesticides',
    images: [{ publicUrl: '/images/aubergine.webp' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 8,
    name: 'Oseille',
    slug: 'oseille',
    price: 1800,
    description: 'Oseille fraîche et savoureuse, cultivée à Meba selon des pratiques durables',
    images: [{ publicUrl: '/images/oseille.webp' }],
    category: 'legumes',
    is_organic: true,
  }
];

// Données fictives pour les catégories en cas d'échec des API
const mockCategories = [
  { id: '1', name: 'Fruits', slug: 'fruits', count: 1 },
  { id: '2', name: 'Légumes', slug: 'legumes', count: 7 }
];

/**
 * Service pour gérer les opérations liées aux produits
 */
const productService = {
  /**
   * Récupérer tous les produits avec filtrage et pagination optionnels
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Promise<Array>} - Liste des produits
   */
  async getAllProducts(options = {}) {
    // Utiliser directement les données fictives pour le développement
    // TODO: Réactiver les appels API quand le backend sera disponible
    
    // Appliquer les filtres aux données fictives
    let filteredProducts = [...mockProducts];
    
    // Filtrer par catégorie si spécifié
    if (options.category) {
      filteredProducts = filteredProducts.filter(p => p.category === options.category);
    }
    
    // Filtrer par produits bio si demandé
    if (options.isOrganic) {
      filteredProducts = filteredProducts.filter(p => p.is_organic === true);
    }
    
    // Filtrer par recherche si spécifié
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Trier les produits
    if (options.sort) {
      switch(options.sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        // Par défaut, tri par popularité (basé sur l'ID pour les données fictives)
        default:
          filteredProducts.sort((a, b) => a.id - b.id);
      }
    }
    
    return filteredProducts;
  },
  
  /**
   * Récupérer un produit par son slug
   * @param {string} slug - Slug du produit
   * @returns {Promise<Object>} - Détails du produit
   */
  async getProductBySlug(slug) {
    // Utiliser directement les données fictives pour le développement
    // TODO: Réactiver les appels API quand le backend sera disponible
    return mockProducts.find(p => p.slug === slug) || null;
  },
  
  /**
   * Récupérer les produits en vedette
   * @param {number} limit - Nombre maximum de produits à récupérer
   * @returns {Promise<Array>} - Liste des produits en vedette
   */
  async getFeaturedProducts(limit = 4) {
    // Utiliser directement les données fictives pour le développement
    // TODO: Réactiver les appels API quand le backend sera disponible
    return mockProducts.filter(p => p.is_featured === true).slice(0, limit);
  },
  
  /**
   * Récupérer les produits liés à un produit donné
   * @param {string} productId - ID du produit
   * @param {number} limit - Nombre maximum de produits à récupérer
   * @returns {Promise<Array>} - Liste des produits liés
   */
  async getRelatedProducts(productId, limit = 4) {
    // Utiliser directement les données fictives pour le développement
    // TODO: Réactiver les appels API quand le backend sera disponible
    
    const currentProduct = mockProducts.find(p => p.id === parseInt(productId));
    if (!currentProduct) return [];
    
    return mockProducts
      .filter(p => p.category === currentProduct.category && p.id !== parseInt(productId))
      .slice(0, limit);
  },
  
  /**
   * Récupérer toutes les catégories de produits
   * @returns {Promise<Array>} - Liste des catégories
   */
  async getCategories() {
    // Utiliser directement les données fictives pour le développement
    // TODO: Réactiver les appels API quand le backend sera disponible
    return mockCategories;
  }
};

export default productService;
