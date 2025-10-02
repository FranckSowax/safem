/**
 * Configuration du stockage Supabase pour Safem
 * Ce fichier définit les paramètres de stockage et expose les fonctions pour gérer les fichiers.
 */

const supabase = require('./db');

// Configuration des buckets de stockage
const buckets = [
  { id: 'product-images', public: true },
  { id: 'producer-images', public: true },
  { id: 'category-images', public: true },
  { id: 'event-images', public: true },
  { id: 'user-avatars', public: true },
  { id: 'blog-images', public: true }
];

/**
 * Télécharge un fichier vers un bucket Supabase
 * @param {string} bucketName - Nom du bucket (ex: 'product-images')
 * @param {string} filePath - Chemin du fichier dans le bucket
 * @param {File|Blob} file - Fichier à télécharger
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} Résultat de l'opération
 */
const uploadFile = async (bucketName, filePath, file, options = {}) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      ...options
    });

  if (error) throw error;
  return data;
};

/**
 * Récupère l'URL publique d'un fichier
 * @param {string} bucketName - Nom du bucket
 * @param {string} filePath - Chemin du fichier dans le bucket
 * @returns {string} URL publique du fichier
 */
const getPublicUrl = (bucketName, filePath) => {
  const { publicURL } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return publicURL;
};

/**
 * Supprime un fichier d'un bucket
 * @param {string} bucketName - Nom du bucket
 * @param {string} filePath - Chemin du fichier dans le bucket
 * @returns {Promise} Résultat de l'opération
 */
const removeFile = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) throw error;
  return data;
};

module.exports = {
  buckets,
  uploadFile,
  getPublicUrl,
  removeFile
};
