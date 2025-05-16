import supabase from './supabaseClient';
import axios from 'axios';
import cartService from './cartService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Service pour gérer l'authentification et les opérations liées aux utilisateurs
 */
const authService = {
  /**
   * Vérifie si Supabase est disponible
   * @returns {boolean} - Si Supabase est disponible
   */
  isSupabaseAvailable() {
    return supabase !== null;
  },
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Informations de l'utilisateur
   * @returns {Promise<Object>} - Données de la session utilisateur
   */
  async register(userData) {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        throw new Error('Supabase n\'est pas configuré. Impossible de s\'inscrire.');
      }
      
      // Inscrire l'utilisateur avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          }
        }
      });
      
      if (error) throw error;
      
      // Après l'inscription, nous pouvons migrer le panier local vers le panier utilisateur
      if (data.session) {
        const localCart = cartService.getLocalCart();
        
        if (localCart.items.length > 0) {
          // Utiliser l'API pour migrer le panier local vers le compte utilisateur
          try {
            await axios.post(
              `${API_URL}/cart/migrate`,
              { cart: localCart },
              {
                headers: {
                  Authorization: `Bearer ${data.session.access_token}`
                }
              }
            );
          } catch (migrateError) {
            console.error('Erreur lors de la migration du panier:', migrateError);
            // Continuer malgré l'erreur
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },
  
  /**
   * Connexion d'un utilisateur existant
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} - Données de la session utilisateur
   */
  async login(email, password) {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        throw new Error('Supabase n\'est pas configuré. Impossible de se connecter.');
      }
      
      // Connecter l'utilisateur avec Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Après la connexion, nous pouvons migrer le panier local vers le panier utilisateur
      if (data.session) {
        const localCart = cartService.getLocalCart();
        
        if (localCart.items.length > 0) {
          // Utiliser l'API pour migrer le panier local vers le compte utilisateur
          try {
            await axios.post(
              `${API_URL}/cart/migrate`,
              { cart: localCart },
              {
                headers: {
                  Authorization: `Bearer ${data.session.access_token}`
                }
              }
            );
          } catch (migrateError) {
            console.error('Erreur lors de la migration du panier:', migrateError);
            // Continuer malgré l'erreur
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },
  
  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        return;  // Si Supabase n'est pas disponible, rien à déconnecter
      }
      
      // Déconnecter l'utilisateur avec Supabase Auth
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer la session de l'utilisateur actuel
   * @returns {Promise<Object>} - Données de la session utilisateur
   */
  async getCurrentSession() {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        return null;  // Si Supabase n'est pas disponible, aucune session
      }
      
      // Récupérer la session depuis Supabase Auth
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer l'utilisateur actuel
   * @returns {Promise<Object>} - Données de l'utilisateur
   */
  async getCurrentUser() {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        return null;  // Si Supabase n'est pas disponible, aucun utilisateur
      }
      
      // Récupérer l'utilisateur actuel depuis Supabase Auth
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour le profil utilisateur
   * @param {Object} userData - Données à mettre à jour
   * @returns {Promise<Object>} - Données de l'utilisateur mises à jour
   */
  async updateProfile(userData) {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        throw new Error('Supabase n\'est pas configuré. Impossible de mettre à jour le profil.');
      }
      
      // D'abord, récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Mettre à jour les métadonnées utilisateur
      const { data, error } = await supabase.auth.updateUser({
        data: {
          first_name: userData.firstName || user.user_metadata?.first_name,
          last_name: userData.lastName || user.user_metadata?.last_name,
          phone: userData.phone || user.user_metadata?.phone,
          address: userData.address || user.user_metadata?.address,
          city: userData.city || user.user_metadata?.city,
          postal_code: userData.postalCode || user.user_metadata?.postal_code
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },
  
  /**
   * Réinitialiser le mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        throw new Error('Supabase n\'est pas configuré. Impossible de réinitialiser le mot de passe.');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour le mot de passe
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<void>}
   */
  async updatePassword(newPassword) {
    try {
      // Vérifier si Supabase est disponible
      if (!this.isSupabaseAvailable()) {
        throw new Error('Supabase n\'est pas configuré. Impossible de mettre à jour le mot de passe.');
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  }
};

export default authService;
