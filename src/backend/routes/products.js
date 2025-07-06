/**
 * Routes de l'API pour les produits Safem
 * Ce fichier définit les endpoints API liés aux produits.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// Configuration de multer pour le téléchargement de fichiers en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limite à 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accepter uniquement les images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

/**
 * @route GET /api/products
 * @desc Récupérer tous les produits avec filtrage optionnel
 * @access Public
 */
router.get('/', productController.getProducts);

/**
 * @route GET /api/products/featured
 * @desc Récupérer les produits mis en avant
 * @access Public
 */
router.get('/featured', (req, res) => {
  req.query.featured = 'true';
  productController.getProducts(req, res);
});

/**
 * @route GET /api/products/category/:slug
 * @desc Récupérer les produits par catégorie
 * @access Public
 */
router.get('/category/:slug', async (req, res) => {
  // Cette route pourrait récupérer d'abord la catégorie par son slug,
  // puis utiliser son ID pour filtrer les produits
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', req.params.slug)
      .single();

    if (error || !category) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Catégorie non trouvée'
        }
      });
    }

    req.query.category = category.id;
    productController.getProducts(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération des produits par catégorie'
      }
    });
  }
});

/**
 * @route GET /api/products/producer/:slug
 * @desc Récupérer les produits par producteur
 * @access Public
 */
router.get('/producer/:slug', async (req, res) => {
  try {
    const { data: producer, error } = await supabase
      .from('producers')
      .select('id')
      .eq('slug', req.params.slug)
      .single();

    if (error || !producer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Producteur non trouvé'
        }
      });
    }

    req.query.producer = producer.id;
    productController.getProducts(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération des produits par producteur'
      }
    });
  }
});

/**
 * @route GET /api/products/:slug
 * @desc Récupérer un produit par son slug
 * @access Public
 */
router.get('/:slug', productController.getProductBySlug);

/**
 * @route POST /api/products
 * @desc Créer un nouveau produit
 * @access Private (admin seulement)
 */
router.post('/', auth.requireAdmin, productController.createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Mettre à jour un produit existant
 * @access Private (admin seulement)
 */
router.put('/:id', auth.requireAdmin, productController.updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Supprimer un produit
 * @access Private (admin seulement)
 */
router.delete('/:id', auth.requireAdmin, productController.deleteProduct);

/**
 * @route POST /api/products/:id/images
 * @desc Télécharger une image pour un produit
 * @access Private (admin seulement)
 */
router.post('/:id/images', auth.requireAdmin, upload.single('image'), productController.uploadProductImage);

module.exports = router;
