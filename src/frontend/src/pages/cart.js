import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/MainLayout';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiCheck, FiX, FiMapPin, FiNavigation } from 'react-icons/fi';
import productOrdersService from '../services/productOrdersService';

// Fonction pour formater le prix
const formatPrice = (price) => {
  if (price === undefined || price === null) return "0 FCFA";
  return typeof price === 'number' ? price.toLocaleString('fr-FR') + ' FCFA' : price;
};

/**
 * Page du panier SAFEM - Version corrigée
 * Affiche les produits ajoutés depuis la page produits
 */
const CartPage = () => {
  const router = useRouter();
  
  // États principaux
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // États du formulaire de commande
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    quartier: '',
    notes: ''
  });
  
  // États pour la géolocalisation
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: ''
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const [showCheckout, setShowCheckout] = useState(false);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('safem_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCart([]);
      }
    };
    
    loadCart();
  }, []);

  // Calculer le total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fonction pour obtenir la géolocalisation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur.');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Formater les coordonnées pour l'affichage
        const formatCoordinate = (coord, isLatitude) => {
          const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'O');
          return `${Math.abs(coord).toFixed(4)}°${direction}`;
        };

        const formattedAddress = `Position: ${formatCoordinate(latitude, true)}, ${formatCoordinate(longitude, false)}`;

        setLocation({
          latitude,
          longitude,
          address: formattedAddress
        });
        setGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Autorisation de géolocalisation refusée. Veuillez l\'activer dans les paramètres de votre navigateur.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible. Vérifiez votre connexion.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé pour la géolocalisation.';
            break;
          default:
            errorMessage = 'Erreur inconnue lors de la géolocalisation.';
            break;
        }
        setLocationError(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Fonctions de gestion du panier
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem('safem_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('safem_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('safem_cart');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_quartier: customerInfo.quartier,
        notes: customerInfo.notes,
        location: location.latitude && location.longitude ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        } : null,
        total_amount: total,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }))
      };

      console.log('Envoi de la commande:', { orderData, cart });

      const result = await productOrdersService.createOrder(orderData);
      
      if (result.success) {
        setOrderSuccess(true);
        clearCart();
        
        setTimeout(() => {
          setOrderSuccess(false);
          setShowCheckout(false);
          setCustomerInfo({
            name: '',
            phone: '',
            quartier: '',
            notes: ''
          });
          setLocation({
            latitude: null,
            longitude: null,
            address: ''
          });
        }, 3000);
      } else {
        setError('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
      setError(`Erreur lors de l'envoi de la commande: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <MainLayout>
        <Head>
          <title>Commande confirmée - SAFEM</title>
        </Head>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
            <p className="text-gray-600 mb-6">
              Votre commande a été envoyée avec succès. Nous vous contacterons bientôt pour la livraison.
            </p>
            <Link href="/products">
              <span className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                Continuer mes achats
              </span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Mon Panier - SAFEM</title>
        <meta name="description" content="Votre panier SAFEM - Finalisez votre commande de produits agricoles frais" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <span className="flex items-center text-green-600 hover:text-green-700 cursor-pointer">
                  <FiArrowLeft className="mr-2" />
                  Retour aux produits
                </span>
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiShoppingCart className="mr-3" />
              Mon Panier
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos produits agricoles frais et ajoutez-les à votre panier.
              </p>
              <Link href="/products">
                <span className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  Voir les produits
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Liste des produits */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Produits ({cart.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center"
                    >
                      <FiTrash2 className="mr-1" />
                      Vider le panier
                    </button>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      {/* Informations produit */}
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{item.icon || '📦'}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category || 'Non catégorisé'}</p>
                          <p className="text-sm font-medium text-green-600">
                            {formatPrice(item.price)}/kg
                          </p>
                        </div>
                      </div>

                      {/* Contrôles quantité */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <span className="min-w-[60px] text-center font-semibold">
                            {item.quantity} kg
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Prix total pour ce produit */}
                        <div className="text-right min-w-[100px]">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé et commande */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Résumé de la commande</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      Total: {formatPrice(total)}
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Passer la commande
                  </button>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quartier
                      </label>
                      <input
                        type="text"
                        name="quartier"
                        value={customerInfo.quartier}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes supplémentaires
                      </label>
                      <textarea
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Instructions de livraison, préférences..."
                      />
                    </div>

                    {/* Section géolocalisation */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Localisation (optionnel)</h4>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-gray-700">
                            {location.latitude ? 'Position détectée' : 'Cliquez pour obtenir votre position'}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={gettingLocation}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <FiNavigation className={`w-4 h-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                          <span>{gettingLocation ? 'Localisation...' : 'Ma position'}</span>
                        </button>
                      </div>
                      
                      {/* Affichage de l'erreur */}
                      {locationError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <FiX className="text-red-600 mr-2" />
                            <span className="text-red-700 text-sm">{locationError}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Carte simple avec coordonnées */}
                      {location.latitude && location.longitude && (
                        <div className="bg-white rounded-lg border border-gray-300 p-4">
                          <div className="flex items-start space-x-3">
                            <FiMapPin className="text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Position détectée</p>
                              <p className="text-sm text-gray-600">{location.address}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <FiX className="text-red-600 mr-2" />
                          <span className="text-red-700 text-sm">{error}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
