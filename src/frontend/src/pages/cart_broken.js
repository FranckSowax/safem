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
 * Page du panier SAFEM
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

  // Fonction pour obtenir la géolocalisation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur.');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Générer une adresse simple basée sur les coordonnées
        // Pas besoin d'API externe - plus robuste et rapide
        const formatAddress = (lat, lng) => {
          const latDir = lat >= 0 ? 'N' : 'S';
          const lngDir = lng >= 0 ? 'E' : 'O';
          return `Position: ${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
        };
        
        setLocation({
          latitude,
          longitude,
          address: formatAddress(latitude, longitude)
        });
        
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Accès à la géolocalisation refusé.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Informations de localisation non disponibles.');
            break;
          case error.TIMEOUT:
            setLocationError('Délai d\'attente dépassé pour la géolocalisation.');
            break;
          default:
            setLocationError('Erreur inconnue lors de la géolocalisation.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('safem_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('safem_cart');
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('safem_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('safem_cart');
    }
  }, [cart]);

  // Ajouter une unité (paliers de 0,5 kg)
  const addToCart = (productId) => {
    const stepQuantity = 0.5;
    
    setCart(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + stepQuantity;
          if (newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  // Retirer une unité (paliers de 0,5 kg)
  const removeFromCart = (productId) => {
    const stepQuantity = 0.5;
    
    setCart(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity - stepQuantity;
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  // Supprimer complètement un produit du panier
  const removeProductFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('safem_cart');
  };

  // Calculer le total
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculer le nombre total d'articles
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Gérer la soumission de la commande
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.quartier || (!location.latitude && !location.longitude)) {
      setError('Veuillez remplir tous les champs obligatoires et autoriser la géolocalisation.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Préparer les données de la commande
      const orderData = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        quartier: customerInfo.quartier,
        latitude: location.latitude,
        longitude: location.longitude,
        address_formatted: location.address,
        notes: customerInfo.notes
      };

      console.log('Envoi de la commande:', { orderData, cart });

      // Créer la commande via Supabase
      const result = await productOrdersService.createOrder(orderData, cart);
      
      if (result.success) {
        console.log('Commande créée avec succès:', result);
        
        // Succès de la commande
        setOrderSuccess(true);
        setShowCheckout(false);
        
        // Vider le panier après 3 secondes
        setTimeout(() => {
          clearCart();
          setOrderSuccess(false);
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
        throw new Error('Erreur lors de la création de la commande');
      }
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(`Erreur lors de l'envoi de la commande: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Panier - SAFEM" description="Votre panier de produits SAFEM">
      <Head>
        <title>Panier - SAFEM</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/products" 
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Retour aux produits
            </Link>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FiShoppingCart className="mr-3" />
            Mon Panier
          </h1>
        </div>

        {/* Message de succès */}
        {orderSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FiCheck className="text-green-600 mr-2" />
            <span className="text-green-700">
              Commande envoyée avec succès ! Nous vous contacterons bientôt.
            </span>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FiX className="text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Panier vide */}
        {cart.length === 0 && !orderSuccess && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits bio frais et ajoutez-les à votre panier.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        )}

        {/* Contenu du panier */}
        {cart.length > 0 && !showCheckout && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Articles ({cart.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center"
                  >
                    <FiTrash2 className="mr-1" />
                    Vider le panier
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      {/* Informations produit */}
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{item.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-sm font-medium text-green-600">
                            {formatPrice(item.price)}/kg
                          </p>
                        </div>
                      </div>

                      {/* Contrôles quantité */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                            title="Retirer 0,5 kg"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className="font-semibold text-lg">{item.quantity}</span>
                            <span className="text-xs text-gray-500">kg</span>
                          </div>
                          
                          <button
                            onClick={() => addToCart(item.id)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Ajouter 0,5 kg"
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
                            onClick={() => removeProductFromCart(item.id)}
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
            </div>

            {/* Résumé de commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Résumé de commande
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Articles ({getTotalItems()} kg)</span>
                    <span className="text-gray-900">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-green-600">{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Passer commande
                </button>

                <div className="mt-4 text-center">
                  <Link 
                    href="/products"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de commande */}
        {showCheckout && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Informations de livraison
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+241 XX XX XX XX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartier *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.quartier}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, quartier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre quartier"
                    required
                  />
                </div>

                {/* Carte de géolocalisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation *
                  </label>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* Bouton de géolocalisation */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="text-green-600" />
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
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">Position confirmée</div>
                            <div className="text-sm text-gray-600 mb-2">{location.address}</div>
                            <div className="text-xs text-gray-500">
                              Coordonnées: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Carte interactive avec iframe Google Maps ou fallback */}
                        <div className="mt-4 h-48 bg-gray-100 rounded-lg relative overflow-hidden border">
                          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'votre-cle-google-maps-ici' ? (
                            // Carte Google Maps avec clé API valide
                            <iframe
                              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}&zoom=16&maptype=roadmap`}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Carte de votre position"
                              className="rounded-lg"
                            />
                          ) : (
                            // Fallback élégant sans clé API
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 text-center p-4">
                              <div className="mb-4">
                                <FiMapPin className="text-green-600 text-4xl mx-auto mb-2" />
                                <div className="text-lg font-semibold text-gray-800 mb-1">Position GPS confirmée</div>
                                <div className="text-sm text-gray-600 mb-2">{location.address}</div>
                                <div className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded">
                                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 max-w-xs">
                                💡 Configurez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY pour afficher la carte interactive
                              </div>
                            </div>
                          )}
                          
                          {/* Overlay avec informations */}
                          <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
                            <div className="flex items-center space-x-1">
                              <FiMapPin className="text-green-600" />
                              <span className="font-medium">Position confirmée</span>
                            </div>
                          </div>
                          
                          {/* Lien vers Google Maps */}
                          <a
                            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 px-2 py-1 bg-white bg-opacity-90 text-xs text-blue-600 rounded hover:bg-opacity-100 transition-all"
                          >
                            Ouvrir dans Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Message d'aide */}
                    {!location.latitude && !gettingLocation && (
                      <div className="text-center py-8">
                        <FiNavigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-sm text-gray-600 mb-2">
                          Nous avons besoin de votre position pour la livraison
                        </div>
                        <div className="text-xs text-gray-500">
                          Cliquez sur "Ma position" pour autoriser la géolocalisation
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="2"
                    placeholder="Instructions spéciales pour la livraison..."
                  />
                </div>

                {/* Résumé de commande dans le formulaire */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Résumé de votre commande</h3>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.icon} {item.name} x{item.quantity} kg</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Retour au panier
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
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
