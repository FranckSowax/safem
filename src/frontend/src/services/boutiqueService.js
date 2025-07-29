import { supabase } from '../lib/supabaseClient';

class BoutiqueService {
  // Récupérer tous les produits avec leurs relations
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select(`
          *,
          categories_produits (
            id,
            nom,
            types_agriculture (
              id,
              nom
            )
          ),
          produits_images (
            id,
            image_url,
            alt_text,
            ordre
          ),
          reviews_produits (
            id,
            rating,
            commentaire,
            nom_utilisateur,
            verifie,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  // Récupérer un produit par ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select(`
          *,
          categories_produits (
            id,
            nom,
            types_agriculture (
              id,
              nom
            )
          ),
          produits_images (
            id,
            image_url,
            alt_text,
            ordre
          ),
          reviews_produits (
            id,
            rating,
            commentaire,
            nom_utilisateur,
            verifie,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  }

  // Créer un nouveau produit
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('produits')
        .insert([{
          nom: productData.nom,
          description: productData.description,
          prix: productData.prix,
          prix_original: productData.prix_original,
          image_url: productData.image_url,
          categorie_id: productData.categorie_id,
          stock: productData.stock,
          rating: productData.rating || 0,
          reviews_count: productData.reviews_count || 0,
          puissance: productData.puissance,
          tags: productData.tags || [],
          nouveau: productData.nouveau || false,
          promo: productData.promo || false,
          distance_km: productData.distance_km,
          installations: productData.installations,
          economie: productData.economie,
          actif: productData.actif !== false,
          marque_nom: productData.marque_nom
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  // Mettre à jour un produit
  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase
        .from('produits')
        .update({
          nom: productData.nom,
          description: productData.description,
          prix: productData.prix,
          prix_original: productData.prix_original,
          image_url: productData.image_url,
          categorie_id: productData.categorie_id,
          stock: productData.stock,
          rating: productData.rating,
          reviews_count: productData.reviews_count,
          puissance: productData.puissance,
          tags: productData.tags,
          nouveau: productData.nouveau,
          promo: productData.promo,
          distance_km: productData.distance_km,
          installations: productData.installations,
          economie: productData.economie,
          actif: productData.actif,
          marque_nom: productData.marque_nom,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  // Supprimer un produit
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  // Gestion des images
  async addProductImage(productId, imageData) {
    try {
      const { data, error } = await supabase
        .from('produits_images')
        .insert([{
          produit_id: productId,
          image_url: imageData.image_url,
          alt_text: imageData.alt_text,
          ordre: imageData.ordre
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error);
      throw error;
    }
  }

  async updateProductImage(imageId, imageData) {
    try {
      const { data, error } = await supabase
        .from('produits_images')
        .update({
          image_url: imageData.image_url,
          alt_text: imageData.alt_text,
          ordre: imageData.ordre
        })
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      throw error;
    }
  }

  async deleteProductImage(imageId) {
    try {
      const { error } = await supabase
        .from('produits_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }

  // Récupérer les catégories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories_produits')
        .select(`
          *,
          types_agriculture (
            id,
            nom
          )
        `)
        .order('nom');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }

  // Récupérer les types d'agriculture
  async getAgricultureTypes() {
    try {
      const { data, error } = await supabase
        .from('types_agriculture')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des types d\'agriculture:', error);
      throw error;
    }
  }

  // Upload d'image (placeholder pour intégration future avec Supabase Storage)
  async uploadImage(file, folder = 'products') {
    try {
      // Pour l'instant, on retourne un placeholder
      // À implémenter avec Supabase Storage
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      
      // Simulation d'upload
      return {
        url: `/api/placeholder/600/400`,
        fileName: fileName
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }

  // Statistiques de la boutique
  async getBoutiqueStats() {
    try {
      // Nombre total de produits
      const { count: totalProducts } = await supabase
        .from('produits')
        .select('*', { count: 'exact', head: true });

      // Produits actifs
      const { count: activeProducts } = await supabase
        .from('produits')
        .select('*', { count: 'exact', head: true })
        .eq('actif', true);

      // Produits en stock
      const { count: inStockProducts } = await supabase
        .from('produits')
        .select('*', { count: 'exact', head: true })
        .gt('stock', 0);

      // Produits en promotion
      const { count: promoProducts } = await supabase
        .from('produits')
        .select('*', { count: 'exact', head: true })
        .eq('promo', true);

      return {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        inStockProducts: inStockProducts || 0,
        promoProducts: promoProducts || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalProducts: 0,
        activeProducts: 0,
        inStockProducts: 0,
        promoProducts: 0
      };
    }
  }
}

export default new BoutiqueService();
