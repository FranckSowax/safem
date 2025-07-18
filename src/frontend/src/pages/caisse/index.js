import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  ShoppingCartIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { SalesService } from '../../services/salesService';
import { ProductSyncService } from '../../services/productSyncService';

// Mapping des UUIDs des produits (sera chargé dynamiquement depuis Supabase)
let PRODUCT_UUID_MAP = {};

// Données des produits basées sur les captures d'écran
const PRODUCTS_DATA = {
  quickAccess: [
    { id: 'demon', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Accès Rapide', stock: 50 },
    { id: 'padma', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Accès Rapide', stock: 30 },
    { id: 'plantain', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Accès Rapide', stock: 25 }
  ],
  piments: [
    { id: 'demon2', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 50 },
    { id: 'shamsi', name: 'Shamsi', price: 2500, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 30 },
    { id: 'avenir', name: 'Avenir', price: 1800, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 40 },
    { id: 'theking', name: 'The King', price: 3000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 20 }
  ],
  poivrons: [
    { id: 'yolo', name: 'Yolo Wander', price: 2000, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 35 },
    { id: 'deconti', name: 'De Conti', price: 2500, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 28 },
    { id: 'nobili', name: 'Nobili', price: 2200, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 32 }
  ],
  tomates: [
    { id: 'padma2', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 45 },
    { id: 'anita', name: 'Anita', price: 1200, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 38 }
  ],
  aubergines: [
    { id: 'africaine', name: 'Africaine', price: 1800, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 25 },
    { id: 'bonita', name: 'Bonita', price: 1600, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 30 },
    { id: 'pingtung', name: 'Ping Tung', price: 2000, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 22 }
  ],
  bananes: [
    { id: 'plantain2', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 40 },
    { id: 'douce', name: 'Banane Douce', price: 1200, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 35 }
  ],
  taros: [
    { id: 'blanc', name: 'Taro Blanc', price: 1000, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 28 },
    { id: 'rouge', name: 'Taro Rouge', price: 1500, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 25 }
  ],
  autres: [
    { id: 'chou', name: 'Chou Averty', price: 1000, unit: 'FCFA/kg', icon: '🥬', category: 'Autres', stock: 20 },
    { id: 'gombo', name: 'Gombo Kirikou', price: 2000, unit: 'FCFA/kg', icon: '🌿', category: 'Autres', stock: 15 },
    { id: 'concombre', name: 'Concombre Mureino', price: 1000, unit: 'FCFA/kg', icon: '🥒', category: 'Autres', stock: 30 },
    { id: 'ciboulette', name: 'Ciboulette', price: 500, unit: 'FCFA/botte', icon: '🌿', category: 'Autres', stock: 25 }
  ]
};

// Fonction pour obtenir l'icône d'un produit (synchronisée avec SalesModule)
const getProductIcon = (productName) => {
  if (!productName) return '📦';
  
  const PRODUCT_ICONS = {
    // Piments
    'Demon': '🌶️',
    'Piment Demon': '🌶️',
    'Shamsi': '🌶️',
    'Avenir': '🌶️',
    'The King': '🌶️',
    
    // Poivrons
    'Yolo Wander': '🫑',
    'De Conti': '🫑',
    'Poivron De conti': '🫑',
    'Nobili': '🫑',
    
    // Tomates
    'Padma': '🍅',
    'Tomate Padma': '🍅',
    'Anita': '🍅',
    
    // Aubergines
    'Africaine': '🍆',
    'Aubergine Africaine': '🍆',
    'Bonita': '🍆',
    'Ping Tung': '🍆',
    
    // Bananes
    'Plantain Ebanga': '🍌',
    'Banane plantain Ebanga': '🍌',
    'Banane Douce': '🍌',
    
    // Taros
    'Taro Blanc': '🥔',
    'Taro blanc': '🥔',
    'Taro Rouge': '🥔',
    
    // Autres
    'Chou Averty': '🥬',
    'Chou Aventy': '🥬',
    'Gombo Kirikou': '🌿',
    'Concombre Mureino': '🥒',
    'Concombre Murano': '🥒',
    'Ciboulette': '🌿'
  };
  
  // Recherche exacte
  if (PRODUCT_ICONS[productName]) {
    return PRODUCT_ICONS[productName];
  }
  
  // Recherche partielle (insensible à la casse)
  const lowerName = productName.toLowerCase();
  for (const [key, icon] of Object.entries(PRODUCT_ICONS)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }
  
  // Fallback par catégorie basé sur des mots-clés
  if (lowerName.includes('piment') || lowerName.includes('demon')) return '🌶️';
  if (lowerName.includes('poivron')) return '🫑';
  if (lowerName.includes('tomate')) return '🍅';
  if (lowerName.includes('aubergine')) return '🍆';
  if (lowerName.includes('banane') || lowerName.includes('plantain')) return '🍌';
  if (lowerName.includes('taro')) return '🥔';
  if (lowerName.includes('chou')) return '🥬';
  if (lowerName.includes('gombo') || lowerName.includes('ciboulette')) return '🌿';
  if (lowerName.includes('concombre')) return '🥒';
  
  // Icône par défaut
  return '📦';
};

// Couleurs par catégorie
const CATEGORY_COLORS = {
  'Accès Rapide': 'bg-purple-100 border-purple-300',
  'Piments': 'bg-red-100 border-red-300',
  'Poivrons': 'bg-green-100 border-green-300',
  'Tomates': 'bg-red-100 border-red-300',
  'Aubergines': 'bg-purple-100 border-purple-300',
  'Bananes': 'bg-yellow-100 border-yellow-300',
  'Taros': 'bg-red-100 border-red-300',
  'Autres': 'bg-green-100 border-green-300'
};

export default function VintageVirtualCashier() {
  // États pour le panier et les modals
  const [cart, setCart] = useState([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [currentSale, setCurrentSale] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Charger le mapping des produits au démarrage
  useEffect(() => {
    const loadProductMapping = async () => {
      console.log('🔄 Chargement du mapping des produits depuis Supabase...');
      try {
        const mapping = await ProductSyncService.createProductMapping();
        PRODUCT_UUID_MAP = mapping;
        console.log('✅ Mapping des produits chargé:', Object.keys(PRODUCT_UUID_MAP).length, 'entrées');
      } catch (error) {
        console.error('❌ Erreur lors du chargement du mapping:', error);
        console.warn('⚠️ Utilisation du mode dégradé sans mapping UUID');
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    loadProductMapping();
  }, []);

  // Calculer le total du panier
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  // Confirmer l'ajout au panier
  const confirmAddToCart = () => {
    const existingItem = cart.find(item => item.id === selectedProduct.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === selectedProduct.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }
    setShowQuantityModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Traiter la vente avec synchronisation Supabase
  const processSale = async () => {
    if (!clientName.trim()) {
      alert('Veuillez saisir le nom du client');
      return;
    }

    try {
      console.log('🛒 Traitement de la vente...');
      
      // Préparer les données de vente pour Supabase
      const saleData = {
        client_name: clientName.trim(),
        client_phone: clientPhone.trim() || null,
        total_amount: cartTotal,
        sale_date: new Date().toISOString(),
        status: 'paid',
        items: cart.map(item => {
          // Utiliser le nom du produit en minuscules pour le mapping
          const productKey = item.name.toLowerCase();
          const productUuid = PRODUCT_UUID_MAP[productKey];
          
          console.log(`📦 Mapping produit: "${item.name}" (clé: "${productKey}") -> ${productUuid}`);
          console.log(`📋 Produit complet:`, item);
          
          // Validation UUID : vérifier que c'est un UUID valide (format hexadécimal)
          const isValidUuid = productUuid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productUuid);
          
          if (!isValidUuid) {
            console.error(`🚨 ERREUR CRITIQUE: UUID invalide pour "${item.name}" (clé: "${productKey}")`);
            console.error(`🚨 UUID reçu: "${productUuid}" (type: ${typeof productUuid})`);
            console.error(`🚨 Mapping disponible:`, Object.keys(PRODUCT_UUID_MAP));
            throw new Error(`UUID invalide pour le produit "${item.name}". Mapping requis.`);
          }
          
          console.log(`✅ UUID valide pour "${item.name}": ${productUuid}`);
          
          return {
            product_id: productUuid,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          };
        })
      };

      console.log('💾 Enregistrement de la vente dans Supabase...');
      console.log('📊 Données de vente:', JSON.stringify(saleData, null, 2));
      console.log('🛒 Panier original:', JSON.stringify(cart, null, 2));
      console.log('🗂️ Mapping UUID disponible:', Object.keys(PRODUCT_UUID_MAP));
      
      // Enregistrer la vente dans Supabase
      const savedSale = await SalesService.createSale(saleData);
      
      console.log('✅ Vente enregistrée avec succès:', savedSale);
      
      // Diagnostic détaillé pour comprendre pourquoi les articles ne s'affichent plus
      if (savedSale.success) {
        console.log('🎯 Vente créée avec ID:', savedSale.data?.id);
        console.log('📦 Articles envoyés à Supabase:', saleData.items.length);
        console.log('🔍 Détail des articles:', saleData.items);
      } else {
        console.error('❌ Échec de la création de vente:', savedSale.error);
        console.error('🚨 Message d\'erreur:', savedSale.message);
      }
      
      // Préparer les données pour l'affichage du reçu
      const receiptData = {
        id: savedSale.success ? savedSale.data?.id : `LOCAL_${Date.now()}`,
        timestamp: savedSale.success ? savedSale.data?.sale_date || new Date().toISOString() : new Date().toISOString(),
        client: savedSale.success ? savedSale.data?.client_name : clientName, // Utiliser les données locales comme fallback
        clientPhone: savedSale.success ? savedSale.data?.client_phone : clientPhone, // Utiliser les données locales comme fallback
        items: cart, // Utiliser les données du panier pour l'affichage
        total: savedSale.success ? savedSale.data?.total_amount || cartTotal : cartTotal // Utiliser cartTotal comme fallback
      };
      
      console.log('🎫 Données du reçu:', receiptData);
      console.log('💰 Total calculé:', cartTotal);
      console.log('💾 Total Supabase:', savedSale.total_amount);

      setCurrentSale(receiptData);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      
      // Réinitialiser
      clearCart();
      setClientName('');
      setClientPhone('');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de la vente:', error);
      
      // Créer un reçu avec les données locales en cas d'erreur
      const fallbackReceiptData = {
        id: 'local-' + Date.now(),
        timestamp: new Date().toISOString(),
        client: clientName.trim(),
        clientPhone: clientPhone.trim(),
        items: cart,
        total: cartTotal
      };
      
      console.log('🎫 Reçu de fallback créé:', fallbackReceiptData);
      
      setCurrentSale(fallbackReceiptData);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      
      // Réinitialiser
      clearCart();
      setClientName('');
      setClientPhone('');
      
      alert('Vente enregistrée localement (erreur de synchronisation avec la base de données).');
    }
  };

  // Formater le prix
  const formatPrice = (price) => {
    // Vérifier si le prix est défini et est un nombre
    if (price === undefined || price === null || isNaN(price)) {
      return '0 FCFA';
    }
    // Convertir en nombre si c'est une chaîne
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    // Vérifier à nouveau après conversion
    if (isNaN(numPrice)) {
      return '0 FCFA';
    }
    return `${numPrice.toLocaleString()} FCFA`;
  };

  // Obtenir tous les produits
  const getAllProducts = () => {
    return Object.values(PRODUCTS_DATA).flat();
  };

  return (
    <>
      <Head>
        <title>Caisse Fruits & Légumes - SAFEM</title>
        <meta name="description" content="Caisse virtuelle SAFEM pour fruits et légumes" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar Panier */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Panier
            </h2>
            <button 
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-800 mt-1"
            >
              Vider
            </button>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Panier vide</p>
                <p className="text-sm text-gray-400">Découvrez nos produits</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity}kg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">{formatPrice(cartTotal)}</span>
            </div>
            <button
              onClick={() => setShowCheckoutModal(true)}
              disabled={cart.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              Encaisser
            </button>
          </div>
        </div>

        {/* Zone principale */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Caisse Fruits & Légumes</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Total: {formatPrice(cartTotal)}
                </span>
                <span className="text-gray-600">{cart.length} articles</span>
              </div>
            </div>

            {/* Accès Rapide */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-orange-500 text-lg mr-2">🔥</span>
                <h2 className="text-lg font-semibold text-gray-800">Accès Rapide</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {PRODUCTS_DATA.quickAccess.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${CATEGORY_COLORS[product.category]}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{product.icon}</div>
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.price} {product.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catégories de produits */}
            {Object.entries(PRODUCTS_DATA).map(([categoryKey, products]) => {
              if (categoryKey === 'quickAccess') return null;
              
              const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
              const categoryIcon = {
                piments: '🌶️',
                poivrons: '🫑',
                tomates: '🍅',
                aubergines: '🍆',
                bananes: '🍌',
                taros: '🥔',
                autres: '🌿'
              }[categoryKey];

              return (
                <div key={categoryKey} className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="text-lg mr-2">{categoryIcon}</span>
                    <h2 className="text-lg font-semibold text-gray-800 uppercase">{categoryName}</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${CATEGORY_COLORS[product.category]}`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{product.icon}</div>
                          <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
                          <p className="text-xs text-gray-600">{product.price} {product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de quantité */}
      {showQuantityModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{selectedProduct.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600">{selectedProduct.name}</p>
              <p className="text-lg font-bold text-green-600 mt-2">{selectedProduct.price} FCFA/kg</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                  min="0.5"
                  step="0.5"
                />
                <button
                  onClick={() => setQuantity(quantity + 0.5)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">
                Total: {formatPrice(selectedProduct.price * quantity)}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQuantityModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'encaissement */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">💰 Encaissement</h3>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Récapitulatif des articles */}
              <div className="mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <span className="text-sm">{item.name} ({item.quantity}kg)</span>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              {/* Informations client */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <span className="text-blue-600 mr-2">👤</span>
                  <h4 className="font-medium">Informations Client</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom du client *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nom complet du client"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+241 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>
              
              {/* Informations de vente */}
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Articles :</span>
                  <span className="text-sm">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Date :</span>
                  <span className="text-sm">{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Heure :</span>
                  <span className="text-sm">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>TOTAL</span>
                  <span className="text-green-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={processSale}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✓ Confirmer la Vente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de succès */}
      {showSuccessModal && currentSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl">
            <div className="bg-green-600 text-white p-4 rounded-t-lg text-center">
              <div className="text-4xl mb-2">✓</div>
              <h3 className="text-lg font-semibold">Vente Confirmée !</h3>
              <p className="text-sm opacity-90">Transaction réalisée avec succès</p>
            </div>
            
            {/* Ticket de caisse modernisé */}
            <div className="p-6 bg-white" style={{ fontFamily: 'monospace' }}>
              {/* Header du ticket */}
              <div className="text-center mb-4 pb-3 border-b-2 border-green-600">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-green-600 text-2xl mr-2">🌱</span>
                  <h4 className="font-bold text-xl text-gray-800">FERME SAFEM</h4>
                </div>
                <p className="text-xs text-gray-500 mb-1">Agriculture Moderne • Gabon</p>
                <p className="text-sm text-gray-600 font-medium">
                  {new Date(currentSale.timestamp).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(currentSale.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ticket N° {currentSale.id || Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>
              
              {/* Informations client */}
              <div className="mb-4 pb-3 border-b border-dashed border-gray-400">
                <div className="flex items-center mb-1">
                  <span className="text-blue-600 mr-2">👤</span>
                  <span className="font-semibold text-sm">INFORMATIONS CLIENT</span>
                </div>
                <p className="text-sm ml-6">
                  <span className="font-medium">Nom:</span> {currentSale.client}
                </p>
                {currentSale.clientPhone && (
                  <p className="text-sm ml-6">
                    <span className="font-medium">Téléphone:</span> {currentSale.clientPhone}
                  </p>
                )}
              </div>
              
              {/* Articles */}
              <div className="mb-4 pb-3 border-b border-dashed border-gray-400">
                <div className="flex items-center mb-3">
                  <span className="text-green-600 mr-2">🛒</span>
                  <span className="font-semibold text-sm">ARTICLES ACHETÉS</span>
                </div>
                {currentSale.items.map((item, index) => {
                  const productIcon = getProductIcon ? getProductIcon(item.name) : '📦';
                  return (
                    <div key={index} className="mb-3 ml-6">
                      <div className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-base">{productIcon}</span>
                            <p className="font-medium text-gray-800">{item.name}</p>
                          </div>
                          <p className="text-gray-600 text-xs ml-5">
                            Prix unitaire: {formatPrice(item.price)}/kg
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium">{item.quantity} kg</p>
                          <p className="font-bold text-green-700">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                      {index < currentSale.items.length - 1 && (
                        <div className="border-b border-dotted border-gray-300 mt-2"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Total */}
              <div className="mb-4 pb-3 border-b-2 border-green-600">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-green-600 text-lg mr-2">💰</span>
                      <span className="font-bold text-lg text-gray-800">TOTAL À PAYER:</span>
                    </div>
                    <span className="font-bold text-2xl text-green-700">{formatPrice(currentSale.total)}</span>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-600">Montant en Francs CFA</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="text-center text-sm text-gray-600 space-y-1">
                <p className="font-medium">Merci de votre confiance !</p>
                <div className="flex items-center justify-center text-xs space-x-1">
                  <span className="text-green-600">🌱</span>
                  <span>Travail • Engagement • Durabilité • Progrès</span>
                </div>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="p-4 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimer Ticket
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Nouvelle Vente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
