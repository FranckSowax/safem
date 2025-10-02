import { useState, useEffect } from 'react';
import { PlusIcon, ShoppingCartIcon, UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { SalesService } from '../../services/salesService';

// Mapping des icônes de produits (synchronisé avec la caisse virtuelle)
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

// Fonction pour obtenir l'icône d'un produit
const getProductIcon = (productName) => {
  if (!productName) return '📦';
  
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

const CLIENT_TYPES = {
  particulier: { name: 'Particulier', discount: 0, color: 'blue' },
  restaurant: { name: 'Restaurant/Hôtel', discount: 5, color: 'green' },
  distributeur: { name: 'Distributeur', discount: 10, color: 'purple' }
};

const PAYMENT_METHODS = ['Espèces', 'Mobile Money', 'Virement', 'Chèque'];

export default function SalesModule({ 
  data = {}, 
  recentSales = [], 
  todaySales = [], 
  currentStock = [] 
}) {
  const [activeTab, setActiveTab] = useState('historique');
  const [availableStock, setAvailableStock] = useState([]);
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    clientType: 'particulier',
    clientName: '',
    clientPhone: '',
    deliveryAddress: '',
    paymentMethod: 'Espèces',
    items: [],
    notes: ''
  });
  const [salesHistory, setSalesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fallback pour compatibilité avec l'ancienne API
  const finalRecentSales = recentSales.length > 0 ? recentSales : (data.recentSales || []);
  const finalTodaySales = todaySales.length > 0 ? todaySales : (data.todaySales || []);
  const finalCurrentStock = currentStock.length > 0 ? currentStock : (data.currentStock || []);

  useEffect(() => {
    loadAvailableStock();
    loadSalesHistory();
  }, []);
  
  // Recharger les données quand les props changent
  useEffect(() => {
    loadAvailableStock();
    loadSalesHistory();
  }, [finalRecentSales, finalTodaySales, finalCurrentStock]);

  const loadAvailableStock = () => {
    // Utiliser les données de stock du dashboard si disponibles
    if (finalCurrentStock && Array.isArray(finalCurrentStock) && finalCurrentStock.length > 0) {
      try {
        setAvailableStock(finalCurrentStock.map(item => ({
          name: item?.name || item?.product || 'Produit inconnu',
          quantity: item?.quantity || 0,
          unit: item?.unit || 'unité',
          price: item?.price || 0,
          quality: 'A' // Par défaut
        })));
        return;
      } catch (error) {
        console.error('Erreur lors du chargement du stock:', error);
        // Continuer avec le fallback
      }
    }
    
    // Fallback: simulation du stock disponible
    const mockStock = [
      { name: 'Poivron De conti', quantity: 45, unit: 'kg', price: 2250, quality: 'A' },
      { name: 'Tomate Padma', quantity: 60, unit: 'kg', price: 1500, quality: 'A' },
      { name: 'Piment Demon', quantity: 8, unit: 'kg', price: 3000, quality: 'B' },
      { name: 'Chou Aventy', quantity: 25, unit: 'kg', price: 1000, quality: 'A' },
      { name: 'Gombo Kirikou', quantity: 15, unit: 'kg', price: 2000, quality: 'A' },
      { name: 'Concombre Murano', quantity: 30, unit: 'kg', price: 1000, quality: 'A' },
      { name: 'Aubergine Africaine', quantity: 20, unit: 'kg', price: 1500, quality: 'A' },
      { name: 'Banane plantain Ebanga', quantity: 100, unit: 'kg', price: 1000, quality: 'A' },
      { name: 'Taro blanc', quantity: 35, unit: 'kg', price: 1000, quality: 'A' }
    ];
    setAvailableStock(mockStock);
  };

  const loadSalesHistory = async () => {
    setIsLoading(true);
    
    try {
      console.log('📊 Chargement de l\'historique des ventes depuis Supabase...');
      
      // Récupérer les ventes depuis Supabase
      const salesResult = await SalesService.getAllSales();
      
      if (salesResult.success && salesResult.data && Array.isArray(salesResult.data)) {
        console.log('✅ Ventes récupérées depuis Supabase:', salesResult.data.length, 'ventes');
        
        // Transformer les données Supabase pour l'affichage
        const transformedSales = salesResult.data.map(sale => {
          // Gestion sécurisée des dates
          let saleDate;
          try {
            if (sale?.sale_date) {
              const dateObj = new Date(sale.sale_date);
              saleDate = isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];
            } else if (sale?.created_at) {
              const dateObj = new Date(sale.created_at);
              saleDate = isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];
            } else {
              saleDate = new Date().toISOString().split('T')[0];
            }
          } catch (error) {
            console.warn('Erreur de formatage de date:', error);
            saleDate = new Date().toISOString().split('T')[0];
          }
          
          return {
            id: sale?.id || Math.random().toString(36),
            date: saleDate,
            clientName: sale?.client_name || 'Client inconnu',
            clientType: 'particulier', // Par défaut
            phone: sale?.client_phone || '',
            total: sale?.total_amount || 0,
            items: Array.isArray(sale?.sale_items) ? sale.sale_items.map(item => ({
              name: item.product_name || 'Produit inconnu',
              quantity: item.quantity || 0,
              price: item.unit_price || 0,
              total: item.total_price || (item.quantity * item.unit_price) || 0
            })) : [],
            status: sale?.status === 'completed' ? 'Payée' : (sale?.status === 'pending' ? 'En attente' : 'Payée'),
            paymentMethod: sale?.payment_method || 'Espèces'
          };
        });
        
        setSalesHistory(transformedSales);
        setIsLoading(false);
        return;
      } else {
        console.warn('⚠️ Aucune vente trouvée dans Supabase ou erreur:', salesResult.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement depuis Supabase:', error);
    }
    
    // Fallback: utiliser les données du dashboard si disponibles
    if (finalRecentSales && Array.isArray(finalRecentSales) && finalRecentSales.length > 0) {
      try {
        console.log('📋 Utilisation des données du dashboard comme fallback');
        setSalesHistory(finalRecentSales.map(sale => {
          // Gestion sécurisée des dates
          let saleDate;
          try {
            if (sale?.time) {
              const dateObj = new Date(sale.time);
              saleDate = isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];
            } else if (sale?.date) {
              const dateObj = new Date(sale.date);
              saleDate = isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];
            } else {
              saleDate = new Date().toISOString().split('T')[0];
            }
          } catch (error) {
            console.warn('Erreur de formatage de date:', error);
            saleDate = new Date().toISOString().split('T')[0];
          }
          
          return {
            id: sale?.id || Math.random().toString(36),
            date: saleDate,
            clientName: sale?.client || sale?.clientName || 'Client inconnu',
            clientType: sale?.clientType || 'particulier',
            phone: sale?.phone || '',
            total: sale?.amount || sale?.total || 0,
            items: Array.isArray(sale?.products) ? sale.products : [],
            status: sale?.status === 'paid' ? 'Payée' : (sale?.status === 'pending' ? 'En attente' : 'Payée'),
            paymentMethod: 'Espèces' // Par défaut
          };
        }));
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique des ventes:', error);
        // Continuer avec le fallback
      }
    }
    
    // Fallback: simulation de l'historique des ventes
    const mockHistory = [
      {
        id: 1,
        date: '2024-01-15',
        clientType: 'restaurant',
        clientName: 'Restaurant Le Palmier',
        items: [
          { name: 'Poivron De conti', quantity: 10, price: 2250, total: 22500 },
          { name: 'Tomate Padma', quantity: 15, price: 1500, total: 22500 }
        ],
        subtotal: 45000,
        discount: 2250,
        total: 42750,
        paymentMethod: 'Virement',
        status: 'Payée'
      },
      {
        id: 2,
        date: '2024-01-14',
        clientType: 'particulier',
        clientName: 'Marie Dupont',
        items: [
          { name: 'Piment Demon', quantity: 2, price: 3000, total: 6000 }
        ],
        subtotal: 6000,
        discount: 0,
        total: 6000,
        paymentMethod: 'Espèces',
        status: 'Payée'
      }
    ];
    setSalesHistory(mockHistory);
    setIsLoading(false);
  };

  const addItemToSale = () => {
    const newItem = {
      id: Date.now(),
      productName: '',
      quantity: '',
      unitPrice: 0,
      total: 0
    };
    setSaleForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateSaleItem = (itemId, field, value) => {
    setSaleForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Mise à jour automatique du prix unitaire si le produit change
          if (field === 'productName') {
            const product = availableStock.find(p => p.name === value);
            if (product) {
              updatedItem.unitPrice = product.price;
            }
          }
          
          // Calcul automatique du total
          if (field === 'quantity' || field === 'productName') {
            const quantity = parseFloat(updatedItem.quantity) || 0;
            const price = updatedItem.unitPrice || 0;
            updatedItem.total = quantity * price;
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeSaleItem = (itemId) => {
    setSaleForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateSaleTotal = () => {
    const subtotal = saleForm.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountPercent = CLIENT_TYPES[saleForm.clientType]?.discount || 0;
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;
    
    return { subtotal, discount, total, discountPercent };
  };

  const submitSale = (e) => {
    e.preventDefault();
    
    if (!saleForm.clientName || saleForm.items.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation des articles
    const invalidItems = saleForm.items.filter(item => !item.productName || !item.quantity);
    if (invalidItems.length > 0) {
      alert('Veuillez compléter tous les articles ajoutés');
      return;
    }

    // Vérification du stock disponible
    for (const item of saleForm.items) {
      const stockItem = availableStock.find(s => s.name === item.productName);
      if (!stockItem || stockItem.quantity < parseFloat(item.quantity)) {
        alert(`Stock insuffisant pour ${item.productName}`);
        return;
      }
    }

    const { subtotal, discount, total } = calculateSaleTotal();
    
    const newSale = {
      id: Date.now(),
      ...saleForm,
      subtotal,
      discount,
      total,
      status: 'Payée'
    };

    setSalesHistory(prev => [newSale, ...prev]);
    
    // Mise à jour du stock
    setAvailableStock(prev => prev.map(stockItem => {
      const saleItem = saleForm.items.find(item => item.productName === stockItem.name);
      if (saleItem) {
        return {
          ...stockItem,
          quantity: stockItem.quantity - parseFloat(saleItem.quantity)
        };
      }
      return stockItem;
    }));

    // Reset du formulaire
    setSaleForm({
      date: new Date().toISOString().split('T')[0],
      clientType: 'particulier',
      clientName: '',
      clientPhone: '',
      deliveryAddress: '',
      paymentMethod: 'Espèces',
      items: [],
      notes: ''
    });

    alert('Vente enregistrée avec succès !');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const { subtotal, discount, total, discountPercent } = calculateSaleTotal();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Ventes</h1>
        <p className="text-gray-600">Ventes sur place et livraisons</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('historique')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'historique'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historique
          </button>
          <button
            onClick={() => setActiveTab('nouvelle-vente')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'nouvelle-vente'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Nouvelle Vente
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stock'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stock Disponible
          </button>
        </nav>
      </div>

      {/* Nouvelle Vente */}
      {activeTab === 'nouvelle-vente' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de vente */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Nouvelle Vente</h3>
              </div>
              
              <form onSubmit={submitSale} className="p-6 space-y-6">
                {/* Informations client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de vente
                    </label>
                    <input
                      type="date"
                      value={saleForm.date}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de client
                    </label>
                    <select
                      value={saleForm.clientType}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, clientType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {Object.entries(CLIENT_TYPES).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.name} {type.discount > 0 && `(-${type.discount}%)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du client *
                    </label>
                    <input
                      type="text"
                      value={saleForm.clientName}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, clientName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={saleForm.clientPhone}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de livraison (optionnel)
                  </label>
                  <input
                    type="text"
                    value={saleForm.deliveryAddress}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Laisser vide pour vente sur place"
                  />
                </div>

                {/* Articles */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Articles</h4>
                    <button
                      type="button"
                      onClick={addItemToSale}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Ajouter un article
                    </button>
                  </div>

                  {saleForm.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {saleForm.items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Produit
                              </label>
                              <select
                                value={item.productName}
                                onChange={(e) => updateSaleItem(item.id, 'productName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                              >
                                <option value="">Sélectionner un produit</option>
                                {availableStock.filter(p => p.quantity > 0).map(product => (
                                  <option key={product.name} value={product.name}>
                                    {product.name} (Stock: {product.quantity} {product.unit})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantité
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => updateSaleItem(item.id, 'quantity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix unitaire
                              </label>
                              <div className="text-sm text-gray-900 px-3 py-2 bg-gray-50 rounded-md">
                                {formatCurrency(item.unitPrice)}
                              </div>
                            </div>

                            <div>
                              <button
                                type="button"
                                onClick={() => removeSaleItem(item.id)}
                                className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-right">
                            <span className="text-lg font-medium text-gray-900">
                              Total: {formatCurrency(item.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mode de paiement et notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode de paiement
                    </label>
                    <select
                      value={saleForm.paymentMethod}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {PAYMENT_METHODS.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Notes particulières..."
                    />
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSaleForm({
                        date: new Date().toISOString().split('T')[0],
                        clientType: 'particulier',
                        clientName: '',
                        clientPhone: '',
                        deliveryAddress: '',
                        paymentMethod: 'Espèces',
                        items: [],
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Enregistrer la vente
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise ({discountPercent}%):</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {saleForm.items.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Articles ({saleForm.items.length})</h4>
                  <div className="space-y-2">
                    {saleForm.items.map((item) => (
                      <div key={item.id} className="text-sm text-gray-600">
                        {item.productName && (
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <span className="text-sm">{getProductIcon(item.productName)}</span>
                              {item.productName}
                            </span>
                            <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historique des ventes */}
      {activeTab === 'historique' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historique des Ventes</h3>
          </div>
          
          {/* Statistiques du jour et du mois */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total du jour */}
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-600">Total du Jour</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const todayTotal = salesHistory
                          .filter(sale => sale.date === today)
                          .reduce((sum, sale) => sum + (sale.total || 0), 0);
                        return formatCurrency(todayTotal);
                      })()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {salesHistory.filter(sale => sale.date === new Date().toISOString().split('T')[0]).length} vente(s)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Total du mois */}
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-600">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-600">Total du Mois</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {(() => {
                        const currentMonth = new Date().getMonth();
                        const currentYear = new Date().getFullYear();
                        const monthTotal = salesHistory
                          .filter(sale => {
                            const saleDate = new Date(sale.date);
                            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
                          })
                          .reduce((sum, sale) => sum + (sale.total || 0), 0);
                        return formatCurrency(monthTotal);
                      })()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const currentMonth = new Date().getMonth();
                        const currentYear = new Date().getFullYear();
                        return salesHistory.filter(sale => {
                          const saleDate = new Date(sale.date);
                          return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
                        }).length;
                      })()} vente(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <p className="mt-2 text-gray-500">Chargement des ventes...</p>
              </div>
            ) : salesHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune vente enregistrée
              </div>
            ) : (
              <div className="space-y-4">
                {salesHistory.map((sale, index) => (
                  <div key={sale.id} className="border-2 border-gray-200 bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 border-2 border-green-300">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">
                            {sale.clientName}
                          </h4>
                          <p className="text-sm font-medium text-gray-600">
                            📅 {new Date(sale.date).toLocaleDateString('fr-FR')} • 
                            🕐 {new Date(sale.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • 
                            👤 {CLIENT_TYPES[sale.clientType]?.name || 'Particulier'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          index % 3 === 0 ? 'text-blue-600' :
                          index % 3 === 1 ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {formatCurrency(sale.total)}
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                          sale.status === 'Payée' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {sale.status === 'Payée' ? '✅ Payée' : '⏳ En attente'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        🛒 Articles commandés
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sale.items.map((item, itemIndex) => (
                          <div key={itemIndex} className={`rounded-lg p-3 border-l-4 ${
                            itemIndex % 4 === 0 ? 'bg-red-50 border-red-400' :
                            itemIndex % 4 === 1 ? 'bg-yellow-50 border-yellow-400' :
                            itemIndex % 4 === 2 ? 'bg-green-50 border-green-400' :
                            'bg-blue-50 border-blue-400'
                          }`}>
                            <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                              <span className="text-lg">{getProductIcon(item.name)}</span>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {getProductIcon(item.name)} {item.quantity} kg × {formatCurrency(item.price)} = <span className="font-bold">{formatCurrency(item.total)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock disponible */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stock Disponible</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableStock.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="text-lg">{getProductIcon(product.name)}</span>
                      {product.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.quality === 'A' ? 'bg-green-100 text-green-800' :
                      product.quality === 'B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Qualité {product.quality}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className={`text-sm font-medium ${
                        product.quantity < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prix:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}/{product.unit}
                      </span>
                    </div>
                  </div>
                  
                  {product.quantity < 10 && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ Stock faible
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
