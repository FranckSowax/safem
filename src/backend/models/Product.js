/**
 * Modèle de produit pour Safem
 * Ce fichier définit les opérations CRUD pour les produits dans Supabase.
 */

const supabase = require('../config/db');
const { getPublicUrl } = require('../config/storage');

const TABLE_NAME = 'products';

/**
 * Récupère tous les produits avec filtrage optionnel
 * @param {Object} options - Options de filtrage et pagination
 * @returns {Promise} Liste des produits
 */
const getAllProducts = async (options = {}) => {
  const {
    categoryId,
    producerId,
    isFeatured,
    isOrganic,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 20,
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;

  let query = supabase
    .from(TABLE_NAME)
    .select(`
      *,
      category:categories(*),
      producer:producers(*),
      images:product_images(*)
    `);

  // Appliquer les filtres si fournis
  if (categoryId) query = query.eq('category_id', categoryId);
  if (producerId) query = query.eq('producer_id', producerId);
  if (isFeatured !== undefined) query = query.eq('is_featured', isFeatured);
  if (isOrganic !== undefined) query = query.eq('is_organic', isOrganic);
  if (minPrice !== undefined) query = query.gte('price', minPrice);
  if (maxPrice !== undefined) query = query.lte('price', maxPrice);
  if (search) {
    query = query.textSearch('name', search, { 
      config: 'french',
      type: 'websearch'
    });
  }

  // Appliquer tri et pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // Ajouter les URLs publiques pour les images
  const productsWithImageUrls = data.map(product => {
    if (product.images) {
      product.images = product.images.map(image => ({
        ...image,
        publicUrl: getPublicUrl('product-images', image.url)
      }));
    }
    return product;
  });

  return {
    products: productsWithImageUrls,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

/**
 * Récupère un produit par son slug
 * @param {string} slug - Slug du produit
 * @returns {Promise} Détails du produit
 */
const getProductBySlug = async (slug) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      *,
      category:categories(*),
      producer:producers(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Ajouter les URLs publiques pour les images
  if (data.images) {
    data.images = data.images.map(image => ({
      ...image,
      publicUrl: getPublicUrl('product-images', image.url)
    }));
  }

  return data;
};

/**
 * Crée un nouveau produit
 * @param {Object} productData - Données du produit
 * @returns {Promise} Produit créé
 */
const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Met à jour un produit existant
 * @param {string} id - ID du produit
 * @param {Object} productData - Données mises à jour
 * @returns {Promise} Produit mis à jour
 */
const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Supprime un produit
 * @param {string} id - ID du produit
 * @returns {Promise} Résultat de l'opération
 */
const deleteProduct = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true, id };
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
