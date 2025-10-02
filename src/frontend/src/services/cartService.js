import supabase from './supabaseClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Service pour gérer les opérations liées au panier et aux commandes
 */
const cartService = {
  /**
   * Récupérer le panier de l'utilisateur actuel
   * @returns {Promise<Object>} - Détails du panier
   */
  async getCart() {
    try {
      // Vérifier si Supabase est disponible et si l'utilisateur est connecté
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // Si l'utilisateur est connecté, récupérer son panier depuis l'API
            const response = await axios.get(`${API_URL}/cart`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
            return response.data.data;
          }
        } catch (authError) {
          console.error('Erreur d\'authentification:', authError);
          // Continuez vers le panier local si l'authentification échoue
        }
      }
      
      // Si Supabase n'est pas disponible ou l'utilisateur n'est pas connecté,
      // récupérer le panier depuis le localStorage
      return this.getLocalCart();
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      // En cas d'erreur, utiliser le panier local
      return this.getLocalCart();
    }
  },
  
  /**
   * Vérifie si le localStorage est disponible
   * @returns {boolean} - Indique si le localStorage est disponible
   */
  isLocalStorageAvailable() {
    if (typeof window === 'undefined') return false;
    
    try {
      // Test d'accès au localStorage
      const testKey = '__safem_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage n\'est pas disponible:', e);
      return false;
    }
  },

  /**
   * Récupérer le panier stocké localement
   * @returns {Object} - Détails du panier local
   */
  getLocalCart() {
    if (!this.isLocalStorageAvailable()) {
      return { items: [], total: 0 };
    }
    
    try {
      const cartData = localStorage.getItem('safem_cart');
      return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
    } catch (e) {
      console.error('Erreur lors de la récupération du panier local:', e);
      return { items: [], total: 0 };
    }
  },
  
  /**
   * Sauvegarder le panier localement
   * @param {Object} cart - Données du panier à sauvegarder
   */
  saveLocalCart(cart) {
    if (!this.isLocalStorageAvailable()) return;
    
    try {
      localStorage.setItem('safem_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du panier local:', e);
    }
  },
  
  /**
   * Ajouter un produit au panier
   * @param {Object} product - Produit à ajouter
   * @param {number} quantity - Quantité à ajouter
   * @returns {Promise<Object>} - Panier mis à jour
   */
  async addToCart(product, quantity = 1) {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.post(
          `${API_URL}/cart/add`,
          { productId: product.id, quantity },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );
        return response.data.data;
      } else {
        // Si l'utilisateur n'est pas connecté, gérer le panier localement
        const cart = this.getLocalCart();
        
        // Vérifier si le produit est déjà dans le panier
        const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Mettre à jour la quantité si le produit existe déjà
          cart.items[existingItemIndex].quantity += quantity;
          cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
        } else {
          // Ajouter un nouvel élément si le produit n'existe pas
          cart.items.push({
            product: {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              images: product.images,
              unit: product.unit || 'unité'
            },
            quantity,
            price: product.price,
            subtotal: product.price * quantity
          });
        }
        
        // Recalculer le total du panier
        cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);
        
        // Sauvegarder le panier mis à jour
        this.saveLocalCart(cart);
        
        return cart;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour la quantité d'un produit dans le panier
   * @param {string} productId - ID du produit à mettre à jour
   * @param {number} quantity - Nouvelle quantité
   * @returns {Promise<Object>} - Panier mis à jour
   */
  async updateCartItem(productId, quantity) {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.put(
          `${API_URL}/cart/update`,
          { productId, quantity },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );
        return response.data.data;
      } else {
        // Si l'utilisateur n'est pas connecté, gérer le panier localement
        const cart = this.getLocalCart();
        
        // Trouver l'élément du panier
        const itemIndex = cart.items.findIndex(item => item.product.id === productId);
        
        if (itemIndex >= 0) {
          if (quantity > 0) {
            // Mettre à jour la quantité
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
          } else {
            // Supprimer l'élément si la quantité est 0 ou négative
            cart.items.splice(itemIndex, 1);
          }
          
          // Recalculer le total du panier
          cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);
          
          // Sauvegarder le panier mis à jour
          this.saveLocalCart(cart);
        }
        
        return cart;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error);
      throw error;
    }
  },
  
  /**
   * Supprimer un produit du panier
   * @param {string} productId - ID du produit à supprimer
   * @returns {Promise<Object>} - Panier mis à jour
   */
  async removeFromCart(productId) {
    return this.updateCartItem(productId, 0);
  },
  
  /**
   * Vider le panier
   * @returns {Promise<Object>} - Panier vide
   */
  async clearCart() {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.delete(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        return response.data.data;
      } else {
        // Si l'utilisateur n'est pas connecté, vider le panier local
        const emptyCart = { items: [], total: 0 };
        this.saveLocalCart(emptyCart);
        return emptyCart;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  },
  
  /**
   * Appliquer un code promo au panier
   * @param {string} couponCode - Code promo à appliquer
   * @returns {Promise<Object>} - Panier mis à jour avec remise
   */
  async applyCoupon(couponCode) {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.post(
          `${API_URL}/cart/coupon`,
          { couponCode },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );
        return response.data.data;
      } else {
        // Pour simplifier, dans la version locale, nous simulons quelques codes promo
        const cart = this.getLocalCart();
        
        if (couponCode.toUpperCase() === 'SAFEM10') {
          cart.discount = 10; // 10% de réduction
          cart.discountType = 'percentage';
          cart.discountAmount = (cart.total * 0.1);
          cart.couponCode = 'SAFEM10';
        } else if (couponCode.toUpperCase() === 'BIENVENUE') {
          cart.discount = 1000; // 1000 XAF de réduction fixe
          cart.discountType = 'fixed';
          cart.discountAmount = 1000;
          cart.couponCode = 'BIENVENUE';
        } else {
          throw new Error('Code promo invalide');
        }
        
        cart.totalWithDiscount = cart.total - cart.discountAmount;
        this.saveLocalCart(cart);
        
        return cart;
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du code promo:', error);
      throw error;
    }
  },
  
  /**
   * Créer une commande à partir du panier
   * @param {Object} orderData - Données de la commande (adresse de livraison, etc.)
   * @returns {Promise<Object>} - Détails de la commande créée
   */
  async createOrder(orderData) {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.post(
          `${API_URL}/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );
        return response.data.data;
      } else {
        // Si l'utilisateur n'est pas connecté, nous simulons la création d'une commande
        // Dans une vraie implémentation, l'utilisateur devrait s'inscrire/se connecter
        const cart = this.getLocalCart();
        
        // Vérifier si le panier est vide
        if (cart.items.length === 0) {
          throw new Error('Le panier est vide');
        }
        
        // Simuler une commande
        const order = {
          id: 'SAFEM-' + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toISOString(),
          status: 'confirmed',
          customer: {
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone
          },
          shipping: {
            address: orderData.address,
            city: orderData.city,
            postalCode: orderData.postalCode,
            method: orderData.deliveryMethod,
            cost: orderData.deliveryMethod === 'express' ? 2000 : 1000
          },
          payment: {
            method: orderData.paymentMethod,
            status: orderData.paymentMethod === 'delivery' ? 'pending' : 'paid'
          },
          items: cart.items,
          subtotal: cart.total,
          discount: cart.discountAmount || 0,
          total: (cart.totalWithDiscount || cart.total) + (orderData.deliveryMethod === 'express' ? 2000 : 1000),
          estimatedDelivery: new Date(Date.now() + (orderData.deliveryMethod === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Vider le panier après la commande
        this.clearCart();
        
        return order;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer les détails d'une commande
   * @param {string} orderId - ID de la commande
   * @returns {Promise<Object>} - Détails de la commande
   */
  async getOrderDetails(orderId) {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si l'utilisateur est connecté, utiliser l'API
        const response = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        return response.data.data;
      } else {
        // Dans une vraie implémentation, cela ne devrait pas être accessible sans authentification
        throw new Error('Authentification requise pour accéder aux détails de la commande');
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${orderId}:`, error);
      throw error;
    }
  }
};

export default cartService;
