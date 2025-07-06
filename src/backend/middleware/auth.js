/**
 * Middleware d'authentification pour Safem
 * Ce fichier gère la vérification des jetons JWT et des autorisations.
 */

const supabase = require('../config/db');

/**
 * Vérifie si l'utilisateur est authentifié
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const requireAuth = async (req, res, next) => {
  try {
    // Récupérer le token d'autorisation de l'en-tête
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentification requise'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token invalide ou expiré'
        }
      });
    }

    // Ajouter l'utilisateur à l'objet req pour une utilisation ultérieure
    req.user = user;
    
    // Récupérer les informations utilisateur supplémentaires depuis la base de données
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!userError && userDetails) {
      req.userDetails = userDetails;
    }

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Erreur lors de l\'authentification'
      }
    });
  }
};

/**
 * Vérifie si l'utilisateur est un administrateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const requireAdmin = async (req, res, next) => {
  try {
    // D'abord vérifier l'authentification
    await requireAuth(req, res, () => {
      // Ensuite vérifier le rôle de l'utilisateur
      if (!req.userDetails || req.userDetails.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Accès réservé aux administrateurs'
          }
        });
      }
      
      next();
    });
  } catch (error) {
    console.error('Erreur d\'autorisation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Erreur lors de la vérification des autorisations'
      }
    });
  }
};

/**
 * Vérifie si l'utilisateur est un producteur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const requireProducer = async (req, res, next) => {
  try {
    // D'abord vérifier l'authentification
    await requireAuth(req, res, () => {
      // Ensuite vérifier le rôle de l'utilisateur
      if (!req.userDetails || req.userDetails.role !== 'producer') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Accès réservé aux producteurs'
          }
        });
      }
      
      next();
    });
  } catch (error) {
    console.error('Erreur d\'autorisation:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Erreur lors de la vérification des autorisations'
      }
    });
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireProducer
};
