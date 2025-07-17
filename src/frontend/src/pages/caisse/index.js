import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  CheckIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import SalesService from '../../services/salesService';

// Mapping des IDs produits vers leurs UUIDs dans Supabase
const PRODUCT_UUID_MAP = {
  // PIMENTS
  1: "ac768216-034c-4193-8807-2ac57ed2b157", // Demon -> Piment Demon
  2: "ac768216-034c-4193-8807-2ac57ed2b157", // Shamsi -> Piment Demon
  3: "ac768216-034c-4193-8807-2ac57ed2b157", // Avenir -> Piment Demon
  4: "ac768216-034c-4193-8807-2ac57ed2b157", // The King -> Piment Demon
  
  // POIVRONS
  5: "5640ffb3-a382-4522-8c63-bdb354d422cd", // Yolo Wander -> Poivron De conti
  6: "5640ffb3-a382-4522-8c63-bdb354d422cd", // De Conti -> Poivron De conti
  7: "5640ffb3-a382-4522-8c63-bdb354d422cd", // Nobili -> Poivron De conti
  
  // TOMATES
  8: "f24f19f6-657a-4bde-8be4-f0d7b2ecd181", // Padma -> Tomate Padma
  9: "f24f19f6-657a-4bde-8be4-f0d7b2ecd181", // Anita -> Tomate Padma
  
  // AUBERGINES
  10: "72920ee2-ec40-4c6f-8a91-b497f2168c50", // Africaine -> Aubergine Africaine
  11: "72920ee2-ec40-4c6f-8a91-b497f2168c50", // Bonika -> Aubergine Africaine
  12: "72920ee2-ec40-4c6f-8a91-b497f2168c50", // Ping Tung -> Aubergine Africaine
  
  // AUTRES LÉGUMES
  13: "971180f1-9758-411c-ad50-eac8be35406f", // Chou Aventy -> Chou Aventy
  14: "75d41edc-3d43-4176-a84a-c06bca79cdec", // Gombo Kirikou -> Gombo Kirikou
  15: "16fa5325-d926-43dd-b238-96a111b3b204", // Concombre Murano -> Concombre Murano
  16: "704885af-517f-4a7f-948c-3c8565a9cfac", // Ciboulette -> Persil Ndolé
  
  // BANANES
  17: "77825bcf-42d9-47c8-b8c9-452088e9b1fa", // Plantain Ebanga -> Banane plantain Ebanga
  18: "77825bcf-42d9-47c8-b8c9-452088e9b1fa", // Banane Douce -> Banane plantain Ebanga
  
  // TAROS
  20: "c3dade41-91bb-4dfc-b706-5fba198d1978", // Taro Blanc -> Taro blanc
  21: "c3dade41-91bb-4dfc-b706-5fba198d1978"  // Taro Rouge -> Taro blanc
};

// Liste complète des produits SAFEM avec variétés
const products = [
  // PIMENTS 🌶️
  { id: 1, name: 'Demon', variety: 'Demon', price: 2000, unit: 'kg', icon: '🌶️', category: 'PIMENTS', color: 'yellow' },
  { id: 2, name: 'Shamsi', variety: 'Shamsi', price: 2000, unit: 'kg', icon: '🌶️', category: 'PIMENTS', color: 'yellow' },
  { id: 3, name: 'Avenir', variety: 'Avenir', price: 4000, unit: 'kg', icon: '🌶️', category: 'PIMENTS', color: 'red' },
  { id: 4, name: 'The King', variety: 'The King', price: 4000, unit: 'kg', icon: '🌶️', category: 'PIMENTS', color: 'red' },
  
  // POIVRONS 🫑
  { id: 5, name: 'Yolo Wander', variety: 'Yolo Wander', price: 2000, unit: 'kg', icon: '🫑', category: 'POIVRONS', color: 'yellow' },
  { id: 6, name: 'De Conti', variety: 'De Conti', price: 2500, unit: 'kg', icon: '🫑', category: 'POIVRONS', color: 'red' },
  { id: 7, name: 'Nobili', variety: 'Nobili', price: 2500, unit: 'kg', icon: '🫑', category: 'POIVRONS', color: 'red' },
  
  // TOMATES 🍅
  { id: 8, name: 'Padma', variety: 'Padma', price: 1500, unit: 'kg', icon: '🍅', category: 'TOMATES', color: 'yellow' },
  { id: 9, name: 'Anita', variety: 'Anita', price: 1500, unit: 'kg', icon: '🍅', category: 'TOMATES', color: 'yellow' },
  
  // AUBERGINES 🍆
  { id: 10, name: 'Africaine', variety: 'Africaine (Blanche)', price: 1000, unit: 'kg', icon: '🍆', category: 'AUBERGINES', color: 'green' },
  { id: 11, name: 'Bonika', variety: 'Bonika (Violette)', price: 1000, unit: 'kg', icon: '🍆', category: 'AUBERGINES', color: 'green' },
  { id: 12, name: 'Ping Tung', variety: 'Ping Tung (Chinoise)', price: 2000, unit: 'kg', icon: '🍆', category: 'AUBERGINES', color: 'yellow' },
  
  // BANANES 🍌
  { id: 17, name: 'Plantain Ebanga', variety: 'Ebanga', price: 1000, unit: 'kg', icon: '🍌', category: 'BANANES', color: 'green' },
  { id: 18, name: 'Banane Douce', variety: '-', price: 1500, unit: 'kg', icon: '🍌', category: 'BANANES', color: 'yellow' },
  
  // TAROS 🍠
  { id: 20, name: 'Taro Blanc', variety: '-', price: 1000, unit: 'kg', icon: '🍠', category: 'TAROS', color: 'green' },
  { id: 21, name: 'Taro Rouge', variety: '-', price: 1500, unit: 'kg', icon: '🍠', category: 'TAROS', color: 'yellow' },
  
  // AUTRES LÉGUMES 🥬
  { id: 13, name: 'Chou Aventy', variety: 'Aventy', price: 1000, unit: 'kg', icon: '🥬', category: 'AUTRES', color: 'green' },
  { id: 14, name: 'Gombo Kirikou', variety: 'Kirikou', price: 2000, unit: 'kg', icon: '🫘', category: 'AUTRES', color: 'yellow' },
  { id: 15, name: 'Concombre Murano', variety: 'Murano', price: 1000, unit: 'kg', icon: '🥒', category: 'AUTRES', color: 'green' },
  { id: 16, name: 'Ciboulette', variety: '-', price: 600, unit: 'kg', icon: '🌿', category: 'AUTRES', color: 'green' }
];

// Produits populaires pour l'accès rapide
const quickAccessProducts = [
  products.find(p => p.id === 1), // Piment Demon
  products.find(p => p.id === 8), // Tomate Padma
  products.find(p => p.id === 17) // Banane Plantain
];

const categories = [
  { name: 'PIMENTS', icon: '🌶️', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { name: 'POIVRONS', icon: '🫑', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { name: 'TOMATES', icon: '🍅', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { name: 'AUBERGINES', icon: '🍆', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { name: 'BANANES', icon: '🍌', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { name: 'TAROS', icon: '🍠', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { name: 'AUTRES', icon: '🥬', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
];

export default function CaisseFusion() {
  const [cart, setCart] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weight, setWeight] = useState('1');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Calculer le total
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const weight = parseFloat(item.weight) || 0;
    return sum + (price * weight);
  }, 0);
  const totalItems = cart.length;

  // Ajouter un produit au panier
  const addToCart = (product, productWeight) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, weight: item.weight + parseFloat(productWeight) }
          : item
      ));
    } else {
      setCart([...cart, { ...product, weight: parseFloat(productWeight) }]);
    }
  };

  // Ouvrir la modal de poids
  const openWeightModal = (product) => {
    setSelectedProduct(product);
    setWeight('1');
    setShowWeightModal(true);
  };

  // Confirmer l'ajout
  const confirmAdd = () => {
    if (selectedProduct && weight && parseFloat(weight) > 0) {
      addToCart(selectedProduct, weight);
      setShowWeightModal(false);
      setSelectedProduct(null);
      setWeight('1');
    }
  };

  // Modifier la quantité dans le panier
  const updateCartItem = (productId, newWeight) => {
    if (newWeight <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, weight: newWeight }
          : item
      ));
    }
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Ouvrir le modal d'encaissement
  const openCheckout = () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }
    setShowCheckoutModal(true);
    setSaleCompleted(false);
  };

  // Confirmer la vente
  const confirmSale = async () => {
    console.log('🔄 [confirmSale] Début de la confirmation de vente');
    console.log('📋 [confirmSale] Client:', clientName, 'Téléphone:', clientPhone);
    console.log('🛒 [confirmSale] Panier:', cart);
    console.log('💰 [confirmSale] Total:', total);
    
    if (!clientName.trim()) {
      console.log('❌ [confirmSale] Nom client manquant');
      alert('Veuillez saisir le nom du client');
      return;
    }
    
    // Données de vente complètes pour l'API
    const saleData = {
      client_name: clientName.trim(),
      client_phone: clientPhone.trim() || null,
      items: cart.map(item => {
        const productUuid = PRODUCT_UUID_MAP[item.id] || item.id;
        console.log(`🔄 [confirmSale] Mapping produit: ${item.name} (ID: ${item.id}) -> UUID: ${productUuid}`);
        return {
          product_id: productUuid,
          product_name: item.name,
          quantity: item.weight,
          unit_price: item.price,
          total_price: item.weight * item.price
        };
      }),
      total_amount: total,
      payment_method: 'cash', // Par défaut
      status: 'paid' // Statut payé pour les ventes de la caisse
    };
    
    console.log('📤 [confirmSale] Données à envoyer:', saleData);
    
    try {
      console.log('🔄 [confirmSale] Appel SalesService.createSale...');
      // Envoyer la vente à Supabase
      const result = await SalesService.createSale(saleData);
      
      console.log('📥 [confirmSale] Résultat reçu:', result);
      
      if (result.success) {
        console.log('✅ [confirmSale] Vente confirmée avec succès');
        setSaleCompleted(true);
        console.log('✅ Vente enregistrée:', result.data);
      } else {
        console.error('❌ [confirmSale] Erreur dans le résultat:', result.error);
        console.error('❌ Erreur vente:', result.error);
        alert(`Erreur lors de l'enregistrement: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ [confirmSale] Exception capturée:', error);
      console.error('❌ Erreur inattendue:', error);
      alert('Erreur inattendue lors de l\'enregistrement de la vente');
    }
  };

  // Imprimer le ticket
  const printTicket = () => {
    const ticketContent = generateTicketContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Générer le contenu du ticket
  const generateTicketContent = () => {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const time = now.toLocaleTimeString('fr-FR');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket de Vente SAFEM</title>
        <style>
          body { font-family: 'Courier New', monospace; width: 300px; margin: 0; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 15px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🌱 FERME SAFEM</h2>
          <p>${date} - ${time}</p>
          <div style="border-top: 1px solid #ccc; margin: 10px 0; padding-top: 10px;">
            <p><strong>Client:</strong> ${clientName}</p>
            ${clientPhone ? `<p><strong>Tél:</strong> ${clientPhone}</p>` : ''}
          </div>
        </div>
        
        <div class="items">
          ${cart.map(item => `
            <div class="item">
              <span>${item.name}</span>
              <span>${item.weight}kg</span>
            </div>
            <div class="item">
              <span>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA/kg</span>
              <span>${(item.weight * item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA</span>
            </div>
          `).join('')}
        </div>
        
        <div class="total">
          <div class="item">
            <span>TOTAL:</span>
            <span>${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Merci de votre confiance !</p>
          <p>🌱 Travail • Engagement • Durabilité • Progrès</p>
        </div>
      </body>
      </html>
    `;
  };

  // Nouvelle vente
  const newSale = () => {
    clearCart();
    setShowCheckoutModal(false);
    setSaleCompleted(false);
    setClientName('');
    setClientPhone('');
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowWeightModal(false);
      } else if (e.key === 'Enter' && showWeightModal) {
        confirmAdd();
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        clearCart();
      } else if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        openCheckout();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showWeightModal, selectedProduct, weight, cart]);

  // Obtenir les classes de couleur selon le prix
  const getProductClasses = (color) => {
    switch (color) {
      case 'green': return 'border-2 border-green-400 bg-white hover:bg-green-50';
      case 'yellow': return 'border-2 border-yellow-400 bg-white hover:bg-yellow-50';
      case 'red': return 'border-2 border-red-400 bg-white hover:bg-red-50';
      default: return 'border-2 border-gray-300 bg-white hover:bg-gray-50';
    }
  };

  return (
    <>
      <Head>
        <title>🛒 Caisse Fruits & Légumes - SAFEM</title>
        <meta name="description" content="Caisse moderne pour fruits et légumes SAFEM" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                🛒 Caisse Fruits & Légumes
              </h1>
              <div className="flex items-center space-x-6">
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-green-800">
                    Total: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {totalItems} articles
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Panier */}
          <div className="w-72 md:w-80 bg-white shadow-lg h-screen sticky top-0">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800 flex items-center">
                  📋 Panier
                </h3>
                <button
                  onClick={clearCart}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Vider
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">Panier vide</p>
                  <p className="text-xs mt-1">Sélectionnez des produits</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA/kg</p>
                          </div>
                        </div>
                        <button
                          onClick={() => updateCartItem(item.id, 0)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartItem(item.id, Math.max(0.1, item.weight - 0.5))}
                            className="bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="font-medium text-sm w-12 text-center">
                            {item.weight}kg
                          </span>
                          <button
                            onClick={() => updateCartItem(item.id, item.weight + 0.5)}
                            className="bg-green-100 text-green-600 hover:bg-green-200 p-1 rounded"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-green-600">
                            {(item.price * item.weight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">
                    Total: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                  </p>
                </div>
              </div>
              <button
                onClick={openCheckout}
                disabled={cart.length === 0}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-bold transition-colors"
              >
                💳 Encaisser
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-4 md:p-6">
            {/* Accès Rapide */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🔥 Accès Rapide
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {quickAccessProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => openWeightModal(product)}
                    className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 rounded-xl p-4 hover:from-purple-200 hover:to-pink-200 transition-all duration-200 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{product.icon}</div>
                      <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                      <p className="text-purple-600 font-bold">
                        {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA/kg
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections par catégories */}
            {categories.map((category) => {
              const categoryProducts = products.filter(p => p.category === category.name);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category.name} className="mb-8">
                  <div className={`${category.bgColor} ${category.borderColor} border rounded-lg p-4`}>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      {category.icon} {category.name}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {categoryProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => openWeightModal(product)}
                          className={`${getProductClasses(product.color)} rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{product.icon}</div>
                            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                            <p className="font-bold text-sm text-gray-700">
                              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de poids */}
        {showWeightModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{selectedProduct.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-gray-600">{selectedProduct.variety}</p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  {selectedProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA/kg
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  step="0.1"
                  min="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  autoFocus
                />
                <p className="text-center mt-2 text-lg font-bold text-blue-600">
                  Total: {(() => {
                    const w = parseFloat(weight) || 0;
                    const p = parseFloat(selectedProduct?.price) || 0;
                    const total = w * p;
                    return isNaN(total) ? 0 : total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                  })()} FCFA
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAdd}
                  disabled={!weight || parseFloat(weight) <= 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-bold transition-colors"
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
            <div className="bg-white rounded-2xl w-full max-w-xl md:max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
              {!saleCompleted ? (
                // Étape 1: Confirmation de la vente
                <>
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold flex items-center">
                        💳 Encaissement
                      </h2>
                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {parseFloat(item.weight) || 0}kg × {(parseFloat(item.price) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA/kg
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-600">
                              {(() => {
                                const w = parseFloat(item.weight) || 0;
                                const p = parseFloat(item.price) || 0;
                                const total = w * p;
                                return isNaN(total) ? '0' : total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                              })()} FCFA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t bg-gray-50 p-6">
                    {/* Informations Client */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">👤 Informations Client</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du client *
                          </label>
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Nom complet du client"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro de téléphone
                          </label>
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+241 XX XX XX XX"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-left">
                        <p className="text-sm text-gray-600">Articles: {totalItems}</p>
                        <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">TOTAL</p>
                        <p className="text-3xl font-bold text-green-600">
                          {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={confirmSale}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
                      >
                        ✓ Confirmer la Vente
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Étape 2: Vente confirmée
                <>
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 text-center">
                    <div className="text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold mb-2">Vente Confirmée !</h2>
                    <p className="text-green-100">Transaction réalisée avec succès</p>
                  </div>

                  <div className="p-6 text-center">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">🌱 FERME SAFEM</h3>
                      
                      <div className="text-left space-y-2 mb-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} ({item.weight}kg)</span>
                            <span>{(item.weight * item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>TOTAL:</span>
                          <span>{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-4">
                        {new Date().toLocaleDateString('fr-FR')} - {new Date().toLocaleTimeString('fr-FR')}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={printTicket}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>🖨️</span>
                        <span>Imprimer Ticket</span>
                      </button>
                      <button
                        onClick={newSale}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
                      >
                        Nouvelle Vente
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
