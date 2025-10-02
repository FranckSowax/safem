import { useState, useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import SubscriptionsService from '../services/subscriptionsService';
import { FiPlus, FiMinus, FiShoppingCart, FiCalendar, FiMapPin, FiUser, FiCheck, FiX } from 'react-icons/fi';

/**
 * Page d'abonnements SAFEM
 * Permet aux clients de créer des paniers récurrents avec livraisons automatiques
 */
const AbonnementsPage = () => {
  // États principaux
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États du formulaire client
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'particulier',
    address: '',
    deliveryNotes: '',
    preferredTime: ''
  });

  // États de l'abonnement
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    frequency: 'weekly'
  });

  // État de l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);

  // Charger les produits disponibles au montage
  useEffect(() => {
    loadAvailableProducts();
  }, []);

  const loadAvailableProducts = async () => {
    try {
      setLoading(true);
      const result = await SubscriptionsService.getAvailableProducts();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un produit au panier (paliers de 0,5 kg)
  const addToCart = (product) => {
    const existingItem = selectedProducts.find(item => item.product_id === product.id);
    const stepQuantity = product.stepQuantity || 0.5;
    const maxQuantity = product.maxQuantity || 10;
    
    if (existingItem) {
      // Vérifier si on peut encore ajouter
      const newQuantity = existingItem.quantity + stepQuantity;
      if (newQuantity <= maxQuantity) {
        setSelectedProducts(prev => 
          prev.map(item => 
            item.product_id === product.id 
              ? { 
                  ...item, 
                  quantity: newQuantity, 
                  total_price: newQuantity * item.unit_price 
                }
              : item
          )
        );
      }
    } else {
      // Ajouter nouveau produit avec quantité minimale
      const minQuantity = product.minQuantity || 0.5;
      setSelectedProducts(prev => [...prev, {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category || 'Non catégorisé',
        quantity: minQuantity,
        unit_price: product.price,
        total_price: minQuantity * product.price,
        unit: product.unit,
        displayUnit: product.displayUnit || 'kg',
        stock_available: product.stock,
        stepQuantity: stepQuantity,
        maxQuantity: maxQuantity,
        minQuantity: minQuantity
      }]);
    }
  };

  // Retirer un produit du panier (paliers de 0,5 kg)
  const removeFromCart = (productId) => {
    const existingItem = selectedProducts.find(item => item.product_id === productId);
    
    if (existingItem) {
      const stepQuantity = existingItem.stepQuantity || 0.5;
      const minQuantity = existingItem.minQuantity || 0.5;
      const newQuantity = existingItem.quantity - stepQuantity;
      
      if (newQuantity >= minQuantity) {
        // Réduire la quantité
        setSelectedProducts(prev => 
          prev.map(item => 
            item.product_id === productId 
              ? { 
                  ...item, 
                  quantity: newQuantity, 
                  total_price: newQuantity * item.unit_price 
                }
              : item
          )
        );
      } else {
        // Supprimer complètement si en dessous du minimum
        setSelectedProducts(prev => prev.filter(item => item.product_id !== productId));
      }
    }
  };

  // Calculer le total du panier
  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.total_price, 0);
  };

  // Calculer la remise selon le type de client
  const calculateDiscount = () => {
    const total = calculateTotal();
    const discountRate = clientData.type === 'pro' ? 0.10 : 0; // 10% pour les pros
    return total * discountRate;
  };

  // Obtenir l'icône de catégorie
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Légumes Fruits': '🍅',
      'Légumes Feuilles': '🥬',
      'Légumes Racines': '🥕',
      'Épices': '🌶️',
      'Fruits': '🍎',
      'Céréales': '🌾',
      'Tubercules': '🥔',
      'Légumineuses': '🫘',
      'Herbes': '🌿'
    };
    return icons[categoryName] || '📦';
  };

  // Obtenir le label de fréquence
  const getFrequencyLabel = (frequency) => {
    const labels = {
      'weekly': 'Chaque semaine',
      'biweekly': 'Toutes les 2 semaines',
      'monthly': 'Chaque mois'
    };
    return labels[frequency] || frequency;
  };

  // Valider l'étape actuelle
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return selectedProducts.length > 0;
      case 2:
        return clientData.name && clientData.phone && clientData.address;
      case 3:
        return subscriptionData.name && subscriptionData.frequency;
      default:
        return true;
    }
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError(null);
    } else {
      setError('Veuillez remplir tous les champs requis');
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  // Créer l'abonnement
  const createSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const total = calculateTotal();
      const discount = calculateDiscount();
      const finalAmount = total - discount;

      const subscriptionPayload = {
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email,
        clientType: clientData.type,
        subscriptionName: subscriptionData.name,
        frequency: subscriptionData.frequency,
        deliveryAddress: clientData.address,
        deliveryNotes: clientData.deliveryNotes,
        preferredDeliveryTime: clientData.preferredTime,
        items: selectedProducts,
        totalAmount: total,
        discountRate: clientData.type === 'pro' ? 10 : 0,
        finalAmount: finalAmount
      };

      const result = await SubscriptionsService.createSubscription(subscriptionPayload);

      if (result.success) {
        setSuccess('Abonnement créé avec succès ! Vous recevrez votre première livraison selon la fréquence choisie.');
        setCurrentStep(4);
        
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setSelectedProducts([]);
    setClientData({
      name: '',
      phone: '',
      email: '',
      type: 'particulier',
      address: '',
      deliveryNotes: '',
      preferredTime: ''
    });
    setSubscriptionData({
      name: '',
      frequency: 'weekly'
    });
    setCurrentStep(1);
    setError(null);
    setSuccess(null);
  };

  return (
    <MainLayout title="Abonnements - SAFEM" description="Créez votre abonnement de produits bio avec livraisons récurrentes">
      <Head>
        <title>Abonnements - SAFEM</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🥬 Abonnements SAFEM
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recevez vos produits bio préférés directement chez vous selon la fréquence de votre choix.
            Idéal pour les particuliers et les professionnels.
          </p>
        </div>

        {/* Section explicative du processus */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment ça marche ?</h2>
            <p className="text-gray-600">Créez votre abonnement en 4 étapes simples</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Étape 1 */}
            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiShoppingCart className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choisissez vos produits</h3>
              <p className="text-sm text-gray-600">Sélectionnez vos produits bio préférés par paliers de 0,5 kg selon vos besoins.</p>
              <div className="mt-3 inline-flex items-center text-green-600 text-sm font-medium">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</span>
                Étape 1
              </div>
            </div>

            {/* Étape 2 */}
            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiUser className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vos informations</h3>
              <p className="text-sm text-gray-600">Renseignez vos coordonnées et choisissez entre client particulier ou professionnel.</p>
              <div className="mt-3 inline-flex items-center text-blue-600 text-sm font-medium">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</span>
                Étape 2
              </div>
            </div>

            {/* Étape 3 */}
            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiCalendar className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurez l'abonnement</h3>
              <p className="text-sm text-gray-600">Choisissez la fréquence de livraison et personnalisez votre abonnement.</p>
              <div className="mt-3 inline-flex items-center text-purple-600 text-sm font-medium">
                <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</span>
                Étape 3
              </div>
            </div>

            {/* Étape 4 */}
            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiCheck className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-sm text-gray-600">Validez votre abonnement et recevez vos produits selon la fréquence choisie.</p>
              <div className="mt-3 inline-flex items-center text-orange-600 text-sm font-medium">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2 text-xs font-bold">4</span>
                Étape 4
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <FiCheck /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4 md:space-x-8 text-xs md:text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-green-600 font-semibold' : ''}>Panier</span>
            <span className={currentStep >= 2 ? 'text-green-600 font-semibold' : ''}>Informations</span>
            <span className={currentStep >= 3 ? 'text-green-600 font-semibold' : ''}>Abonnement</span>
            <span className={currentStep >= 4 ? 'text-green-600 font-semibold' : ''}>Confirmation</span>
          </div>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FiX className="text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FiCheck className="text-green-600 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Contenu selon l'étape */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* ÉTAPE 1: Sélection des produits */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                🛒 Composez votre panier
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des produits...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Liste des produits */}
                  <div className="lg:col-span-2">
                    {/* Défilement horizontal sur mobile, grille sur desktop */}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-4 pb-4 md:pb-0" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                       {products.map((product) => {
                         const selectedItem = selectedProducts.find(item => item.product_id === product.id);
                         const quantity = selectedItem ? selectedItem.quantity : 0;
                         const maxQuantity = product.maxQuantity || 10;
                         const stepQuantity = product.stepQuantity || 0.5;
                         
                         return (
                           <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow min-w-[320px] md:min-w-0 flex-shrink-0 md:flex-shrink">
                             <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                               <div className="flex items-center space-x-3">
                                 <span className="text-2xl">
                                   {product.icon}
                                 </span>
                                 <div>
                                   <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                   <p className="text-sm text-gray-500">{product.category}</p>
                                 </div>
                               </div>
                               <div className="text-left sm:text-right">
                                 <p className="font-semibold text-green-600">
                                   {product.price.toLocaleString('fr-FR')} {product.unit}
                                 </p>
                                 <p className="text-xs text-gray-500">
                                   Stock: {product.stock} {product.displayUnit}
                                 </p>
                               </div>
                             </div>
                             
                             {/* Indicateur paliers 0,5 kg */}
                             <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                               Sélection par paliers de {stepQuantity} {product.displayUnit} (min: {product.minQuantity || 0.5} {product.displayUnit})
                             </div>
                             
                             <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => removeFromCart(product.id)}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={`Retirer ${stepQuantity} ${product.displayUnit}`}
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                  
                                  <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="font-semibold text-lg">{quantity}</span>
                                    <span className="text-xs text-gray-500">{product.displayUnit}</span>
                                  </div>
                                  
                                  <button
                                    onClick={() => addToCart(product)}
                                    disabled={quantity >= maxQuantity}
                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={`Ajouter ${stepQuantity} ${product.displayUnit}`}
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="text-center sm:text-right">
                                  {quantity > 0 && (
                                    <>
                                      <div className="text-sm font-semibold text-green-600">
                                        {(quantity * product.price).toLocaleString('fr-FR')} FCFA
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {product.price.toLocaleString('fr-FR')} FCFA/{product.displayUnit}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                           </div>
                         );
                      })}
                    </div>
                  </div>

                  {/* Résumé du panier */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FiShoppingCart className="mr-2" />
                        Votre panier ({selectedProducts.length})
                      </h3>
                      
                      {selectedProducts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          Aucun produit sélectionné
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {selectedProducts.map((item) => (
                            <div key={item.product_id} className="flex justify-between items-center text-sm">
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-gray-500">
                                  {item.quantity} {item.displayUnit || 'kg'} × {item.unit_price.toLocaleString('fr-FR')} FCFA/{item.displayUnit || 'kg'}
                                </p>
                              </div>
                              <p className="font-semibold">
                                {item.total_price.toLocaleString('fr-FR')} FCFA
                              </p>
                            </div>
                          ))}
                          
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center font-semibold text-lg">
                              <span>Total</span>
                              <span className="text-green-600">
                                {calculateTotal().toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 2: Informations client */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                <FiUser className="inline mr-2" />
                Vos informations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+241 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de client
                  </label>
                  <select
                    value={clientData.type}
                    onChange={(e) => setClientData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="particulier">Particulier</option>
                    <option value="pro">Professionnel (-10%)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-1" />
                    Adresse de livraison *
                  </label>
                  <textarea
                    value={clientData.address}
                    onChange={(e) => setClientData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Adresse complète de livraison"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure préférée
                  </label>
                  <select
                    value={clientData.preferredTime}
                    onChange={(e) => setClientData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pas de préférence</option>
                    <option value="morning">Matin (8h-12h)</option>
                    <option value="afternoon">Après-midi (12h-17h)</option>
                    <option value="evening">Soir (17h-20h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes de livraison
                  </label>
                  <input
                    type="text"
                    value={clientData.deliveryNotes}
                    onChange={(e) => setClientData(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Instructions spéciales"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3: Configuration de l'abonnement */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                <FiCalendar className="inline mr-2" />
                Configuration de l'abonnement
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'abonnement *
                  </label>
                  <input
                    type="text"
                    value={subscriptionData.name}
                    onChange={(e) => setSubscriptionData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Panier Familial, Panier Restaurant..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Fréquence de livraison *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'weekly', label: 'Chaque semaine', desc: 'Livraison tous les 7 jours' },
                      { value: 'biweekly', label: 'Toutes les 2 semaines', desc: 'Livraison tous les 14 jours' },
                      { value: 'monthly', label: 'Chaque mois', desc: 'Livraison tous les 30 jours' }
                    ].map((freq) => (
                      <div
                        key={freq.value}
                        onClick={() => setSubscriptionData(prev => ({ ...prev, frequency: freq.value }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          subscriptionData.frequency === freq.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">{freq.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{freq.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Résumé de l'abonnement */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Résumé de votre abonnement</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Client</span>
                      <span className="font-medium">{clientData.name} ({clientData.type})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fréquence</span>
                      <span className="font-medium">{getFrequencyLabel(subscriptionData.frequency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Produits</span>
                      <span className="font-medium">{selectedProducts.length} articles</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span className="font-medium">{calculateTotal().toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    {clientData.type === 'pro' && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise Pro (-10%)</span>
                        <span className="font-medium">-{calculateDiscount().toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Total par livraison</span>
                      <span className="text-green-600">
                        {(calculateTotal() - calculateDiscount()).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Abonnement créé avec succès !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre abonnement "{subscriptionData.name}" a été configuré.
                Vous recevrez votre première livraison selon la fréquence choisie.
              </p>
              <button
                onClick={resetForm}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Créer un nouvel abonnement
              </button>
            </div>
          )}

          {/* Boutons de navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              {currentStep === 3 ? (
                <button
                  onClick={createSubscription}
                  disabled={loading || !validateStep(currentStep)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    'Créer l\'abonnement'
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AbonnementsPage;
