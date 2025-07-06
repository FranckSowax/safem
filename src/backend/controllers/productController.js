/**
 * Contrôleur de produits pour Safem
 * Gère les requêtes HTTP liées aux produits et appelle les méthodes du modèle correspondant.
 */

const Product = require('../models/Product');
const { uploadFile, removeFile } = require('../config/storage');

/**
 * Récupère la liste des produits
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const getProducts = async (req, res) => {
  try {
    const options = {
      categoryId: req.query.category,
      producerId: req.query.producer,
      isFeatured: req.query.featured === 'true',
      isOrganic: req.query.organic === 'true',
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      search: req.query.search,
      page: parseInt(req.query.page || '1'),
      limit: parseInt(req.query.limit || '20'),
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'asc'
    };

    const result = await Product.getAllProducts(options);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur dans getProducts:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération des produits'
      }
    });
  }
};

/**
 * Récupère un produit par son slug
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Produit non trouvé'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur dans getProductBySlug:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération du produit'
      }
    });
  }
};

/**
 * Crée un nouveau produit
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Validation des données
    if (!productData.name || !productData.price || !productData.category_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Les champs name, price et category_id sont requis'
        }
      });
    }

    const newProduct = await Product.createProduct(productData);
    
    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error('Erreur dans createProduct:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la création du produit'
      }
    });
  }
};

/**
 * Met à jour un produit existant
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const updatedProduct = await Product.updateProduct(id, productData);
    
    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Erreur dans updateProduct:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la mise à jour du produit'
      }
    });
  }
};

/**
 * Supprime un produit
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Product.deleteProduct(id);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur dans deleteProduct:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la suppression du produit'
      }
    });
  }
};

/**
 * Télécharge une image de produit
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'Aucun fichier téléchargé'
        }
      });
    }

    // Générer un nom de fichier unique
    const fileName = `${id}_${Date.now()}.${file.originalname.split('.').pop()}`;
    
    // Télécharger vers Supabase Storage
    const uploadResult = await uploadFile('product-images', fileName, file.buffer, {
      contentType: file.mimetype
    });

    // Créer l'entrée dans la table product_images
    const { data: imageData, error: imageError } = await supabase
      .from('product_images')
      .insert([{
        product_id: id,
        url: fileName,
        alt_text: req.body.alt_text || '',
        is_primary: req.body.is_primary === 'true'
      }])
      .select()
      .single();

    if (imageError) throw imageError;

    res.status(201).json({
      success: true,
      data: imageData
    });
  } catch (error) {
    console.error('Erreur dans uploadProductImage:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors du téléchargement de l\'image'
      }
    });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};
