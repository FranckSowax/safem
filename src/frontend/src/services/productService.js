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
    name: 'Bananes plantains',
    slug: 'bananes-plantains',
    price: 2000,
    description: 'Bananes plantains de qualité, idéales pour les plats traditionnels',
    images: [{ publicUrl: '/images/pasteque.webp' }], // Utilisation de l'image pasteque en remplacement
    category: 'fruits',
    is_organic: true,
  },
  {
    id: 5,
    name: 'Ananas',
    slug: 'ananas',
    price: 3500,
    description: 'Ananas frais et sucrés, cultivés au Gabon',
    images: [{ publicUrl: '/images/PHOTO-2025-05-13-22-31-38.jpg' }], // Utilisation d'une photo
    category: 'fruits',
    is_organic: true,
  },
  {
    id: 6,
    name: 'Manioc',
    slug: 'manioc',
    price: 1500,
    description: 'Manioc frais de première qualité',
    images: [{ publicUrl: '/images/carotte.webp' }], // Utilisation de l'image carotte en remplacement
    category: 'tubercules',
    is_organic: false,
  },
  {
    id: 7,
    name: 'Jus de fruits locaux',
    slug: 'jus-de-fruits',
    price: 4000,
    description: 'Jus de fruits pressés, sans conservateurs',
    images: [{ publicUrl: '/images/PHOTO-2025-05-13-22-31-37-2.jpg' }], // Utilisation d'une photo
    category: 'transformes',
    is_organic: true,
  },
  {
    id: 8,
    name: 'Panier découverte',
    slug: 'panier-decouverte',
    price: 10000,
    description: 'Assortiment de fruits et légumes frais de saison',
    images: [{ publicUrl: '/images/vegetables.jpg' }], // Utilisation de l'image vegetables
    category: 'paniers',
    is_organic: false,
  }
];

// Données fictives pour les catégories en cas d'échec des API
const mockCategories = [
  { id: '1', name: 'Fruits', slug: 'fruits', count: 2 },
  { id: '2', name: 'Légumes', slug: 'legumes', count: 3 },
  { id: '3', name: 'Produits transformés', slug: 'transformes', count: 1 },
  { id: '4', name: 'Paniers', slug: 'paniers', count: 1 },
  { id: '5', name: 'Tubercules', slug: 'tubercules', count: 1 }
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
