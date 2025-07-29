import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/MainLayout';
import { FiArrowLeft, FiMapPin, FiNavigation, FiUser, FiPhone, FiHome, FiMessageSquare, FiCheck, FiX, FiShoppingCart } from 'react-icons/fi';
import productOrdersService from '../services/productOrdersService';

// Fonction pour formater le prix
const formatPrice = (price) => {
  if (price === undefined || price === null) return "0 FCFA";
  return typeof price === 'number' ? price.toLocaleString('fr-FR') + ' FCFA' : price;
};

/**
 * Page de checkout SAFEM - Optimisée pour mobile
 * Formulaire d'informations client et géolocalisation avec carte
 */
const CheckoutPage = () => {
  const router = useRouter();
  
  // États du panier
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // États du formulaire
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
  
  // États de l'interface
  const [currentStep, setCurrentStep] = useState(1); // 1: Infos, 2: Localisation, 3: Confirmation

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

  // Rediriger si le panier est vide après un délai pour permettre le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cart.length === 0 && !loading) {
        router.push('/products');
      }
    }, 1000); // Délai de 1 seconde pour permettre le chargement du panier
    
    return () => clearTimeout(timer);
  }, [cart, router, loading]);

  // Calculer le total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fonction pour obtenir la géolocalisation avec précision améliorée
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur.');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    // Options de géolocalisation améliorées
    const options = {
      enableHighAccuracy: true, // Haute précision
      timeout: 10000, // 10 secondes
      maximumAge: 300000 // Cache de 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Formater les coordonnées pour l'affichage
        const formatCoordinate = (coord, isLatitude) => {
          const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'O');
          return `${Math.abs(coord).toFixed(6)}°${direction}`;
        };

        // Essayer d'obtenir l'adresse via géocodage inverse
        let addressInfo = `Position: ${formatCoordinate(latitude, true)}, ${formatCoordinate(longitude, false)}`;
        
        try {
          // Géocodage inverse avec Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.display_name) {
              addressInfo = data.display_name;
            }
          }
        } catch (err) {
          console.log('Géocodage inverse non disponible, utilisation des coordonnées');
        }

        setLocation({
          latitude,
          longitude,
          address: addressInfo,
          accuracy: Math.round(accuracy)
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
            errorMessage = 'Position indisponible. Vérifiez votre connexion et que la géolocalisation est activée.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé. Vérifiez votre connexion et réessayez.';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!customerInfo.name || !customerInfo.phone) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setError(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmitOrder = async () => {
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
        localStorage.removeItem('safem_cart');
        
        setTimeout(() => {
          router.push('/products');
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
        <title>Finaliser ma commande - SAFEM</title>
        <meta name="description" content="Finalisez votre commande SAFEM - Informations de livraison et géolocalisation" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header mobile */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentStep === 1 ? router.push('/products') : handlePrevStep()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">
              Finaliser ma commande
            </h1>
            
            <div className="text-sm text-gray-500">
              {currentStep}/3
            </div>
          </div>
        </div>

        {/* Indicateur de progression */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {currentStep === 1 && 'Vos informations'}
              {currentStep === 2 && 'Localisation'}
              {currentStep === 3 && 'Confirmation'}
            </span>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Étape 1: Informations client */}
          {currentStep === 1 && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FiUser className="text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Vos informations</h2>
                </div>

                <div className="space-y-4">
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Votre nom complet"
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="+225 XX XX XX XX"
                    />
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Votre quartier"
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Instructions de livraison, préférences..."
                    />
                  </div>
                </div>
              </div>

              {/* Résumé du panier */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de votre commande</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.icon || '📦'}</span>
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <div className="text-sm text-gray-500">{item.quantity} kg</div>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Géolocalisation */}
          {currentStep === 2 && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FiMapPin className="text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Localisation de livraison</h2>
                </div>

                <p className="text-gray-600 mb-4">
                  Partagez votre position pour faciliter la livraison (optionnel)
                </p>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                >
                  <FiNavigation className={`w-5 h-5 ${gettingLocation ? 'animate-spin' : ''}`} />
                  <span>{gettingLocation ? 'Localisation en cours...' : 'Obtenir ma position'}</span>
                </button>

                {/* Affichage de l'erreur */}
                {locationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FiX className="text-red-600 mr-2 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{locationError}</span>
                    </div>
                  </div>
                )}

                {/* Carte interactive améliorée avec informations détaillées */}
                {location.latitude && location.longitude && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <FiMapPin className="text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-green-900">Position détectée</p>
                          {location.accuracy && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Précision: ±{location.accuracy}m
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-green-700 mb-3 break-words">{location.address}</p>
                        
                        {/* Carte intégrée améliorée */}
                        <div className="bg-white rounded-lg border border-green-200 overflow-hidden shadow-sm">
                          <div className="relative">
                            <iframe
                              width="100%"
                              height="250"
                              frameBorder="0"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.005}%2C${location.latitude-0.005}%2C${location.longitude+0.005}%2C${location.latitude+0.005}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
                              style={{ border: 0 }}
                              title="Carte de votre position"
                            />
                            {/* Overlay avec lien vers la carte complète */}
                            <div className="absolute bottom-2 right-2">
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=16`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-xs text-blue-600 px-2 py-1 rounded shadow-sm transition-all"
                              >
                                Voir sur la carte ↗️
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        {/* Informations techniques (coordonnées) */}
                        <details className="mt-3">
                          <summary className="text-xs text-green-600 cursor-pointer hover:text-green-800 transition-colors">
                            Coordonnées techniques
                          </summary>
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                            Latitude: {location.latitude.toFixed(6)}°<br/>
                            Longitude: {location.longitude.toFixed(6)}°
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    💡 La géolocalisation nous aide à vous livrer plus rapidement et précisément.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {currentStep === 3 && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FiCheck className="text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Confirmation de commande</h2>
                </div>

                {/* Récapitulatif des informations */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informations de livraison</h3>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p><strong>Nom:</strong> {customerInfo.name}</p>
                      <p><strong>Téléphone:</strong> {customerInfo.phone}</p>
                      {customerInfo.quartier && <p><strong>Quartier:</strong> {customerInfo.quartier}</p>}
                      {location.latitude && (
                        <p><strong>Position:</strong> Géolocalisation partagée</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Votre commande</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-1">
                          <span className="text-sm">{item.name} ({item.quantity} kg)</span>
                          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-green-600">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <FiX className="text-red-600 mr-2 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
                </button>
              </div>
            </div>
          )}

          {/* Erreur générale */}
          {error && currentStep !== 3 && (
            <div className="max-w-md mx-auto mb-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <FiX className="text-red-600 mr-2 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bouton suivant */}
          {currentStep < 3 && (
            <div className="max-w-md mx-auto">
              <button
                onClick={handleNextStep}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {currentStep === 1 ? 'Continuer vers la localisation' : 'Finaliser ma commande'}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
