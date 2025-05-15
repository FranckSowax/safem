/**
 * Middleware de gestion des erreurs pour Safem
 * Ce fichier centralise la gestion des erreurs de l'application.
 */

const errorHandler = (err, req, res, next) => {
  console.error(`Erreur: ${err.message}`);
  console.error(err.stack);

  // Journaliser l'erreur
  console.error({
    error: err.message,
    stack: err.stack,
    user: req.user?.id,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Déterminer le code et le message d'erreur appropriés
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      }
    });
  }

  if (err.type === 'not_found') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    });
  }

  if (err.type === 'auth') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: err.message || 'Non autorisé'
      }
    });
  }

  if (err.type === 'forbidden') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: err.message || 'Accès interdit'
      }
    });
  }

  // En mode production, ne pas exposer les détails de l'erreur
  const isDev = process.env.NODE_ENV !== 'production';
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Erreur interne du serveur',
      ...(isDev && { details: err.message, stack: err.stack })
    }
  });
};

module.exports = errorHandler;
