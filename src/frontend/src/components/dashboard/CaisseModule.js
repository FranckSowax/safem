import { useState, useEffect } from 'react';
import { 
  CogIcon,
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TagIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import SalesService from '../../services/salesService';
import caisseProductsService from '../../services/caisseProductsService';

// Configuration des statuts de stock
const STOCK_STATUS = {
  IN_STOCK: { label: 'En stock', color: 'green', icon: CheckCircleIcon },
  LOW_STOCK: { label: 'Stock faible', color: 'yellow', icon: ExclamationTriangleIcon },
  OUT_OF_STOCK: { label: 'Rupture', color: 'red', icon: XCircleIcon }
};

// Seuils de stock
const STOCK_THRESHOLDS = {
  LOW_STOCK: 10, // kg
  OUT_OF_STOCK: 0 // kg
};

// Les données seront chargées depuis Supabase
// Catégories par défaut (seront remplacées par les données Supabase)
const defaultCategories = [
  { value: 'ALL', label: 'Toutes les catégories', emoji: '📦' },
  { value: 'PIMENTS', label: 'Piments', emoji: '🌶️' },
  { value: 'POIVRONS', label: 'Poivrons', emoji: '🫑' },
  { value: 'TOMATES', label: 'Tomates', emoji: '🍅' },
  { value: 'AUBERGINES', label: 'Aubergines', emoji: '🍆' },
  { value: 'AUTRES', label: 'Autres', emoji: '🥒' },
  { value: 'BANANES', label: 'Bananes', emoji: '🍌' },
  { value: 'TAROS', label: 'Taros', emoji: '🍠' }
];

export default function CaisseModule() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [error, setError] = useState(null);

  // Nouveau produit pour l'ajout
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'PIMENTS'
  });

  // Charger les données au montage du composant
  useEffect(() => {
    loadInitialData();
  }, []);

  // Charger les données initiales depuis Supabase
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger les produits et catégories en parallèle
      const [productsData, categoriesData] = await Promise.all([
        caisseProductsService.getAllProducts(),
        caisseProductsService.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories([{ value: 'ALL', label: 'Toutes les catégories', emoji: '📦' }, ...categoriesData]);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiser les données
  const refreshData = async () => {
    await loadInitialData();
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Obtenir le statut du stock
  const getStockStatus = (stock) => {
    if (stock <= STOCK_THRESHOLDS.OUT_OF_STOCK) return STOCK_STATUS.OUT_OF_STOCK;
    if (stock <= STOCK_THRESHOLDS.LOW_STOCK) return STOCK_STATUS.LOW_STOCK;
    return STOCK_STATUS.IN_STOCK;
  };

  // Obtenir l'emoji de la catégorie
  const getCategoryEmoji = (category) => {
    if (!category) return '📦';
    
    // Normaliser le nom de la catégorie (majuscules, sans accents)
    const normalizedCategory = category.toString()
      .toUpperCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Supprimer les accents
    
    // Mapping des catégories françaises Supabase vers leurs emojis
    const frenchCategoryMap = {
      'EPICES': '🌶️',
      'LEGUMES FRUITS': '🍅',
      'LEGUMES FEUILLES': '🥬', 
      'LEGUMES RACINES': '🥕',
      'FRUITS': '🍎',
      'CEREALES': '🌾',
      'TUBERCULES': '🥔',
      'LEGUMINEUSES': '🫘',
      'HERBES': '🌿'
    };
    
    // Chercher dans le mapping français
    if (frenchCategoryMap[normalizedCategory]) {
      return frenchCategoryMap[normalizedCategory];
    }
    
    // Mapping anglais (pour compatibilité)
    const englishCategoryMap = {
      'PIMENTS': '🌶️',
      'POIVRONS': '🫑',
      'TOMATES': '🍅',
      'AUBERGINES': '🍆',
      'AUTRES': '🥒',
      'BANANES': '🍌',
      'TAROS': '🍠',
      'LEGUMES': '🥬',
      'SPICES': '🌶️',
      'VEGETABLES': '🥬'
    };
    
    if (englishCategoryMap[normalizedCategory]) {
      return englishCategoryMap[normalizedCategory];
    }
    
    // Emoji par défaut
    return '📦';
  };

  // Ajouter un nouveau produit
  const addProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      try {
        setIsLoading(true);
        const product = await caisseProductsService.addProduct({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseFloat(newProduct.stock),
          category: newProduct.category,
          description: newProduct.description || ''
        });
        
        setProducts([...products, product]);
        setNewProduct({ name: '', price: '', stock: '', category: 'PIMENTS' });
        setShowAddProductModal(false);
        
      } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        setError('Erreur lors de l\'ajout du produit');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Éditer un produit
  const editProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Sauvegarder les modifications d'un produit
  const saveProductChanges = async () => {
    if (editingProduct) {
      try {
        setIsLoading(true);
        const updatedProduct = await caisseProductsService.updateProduct(editingProduct.id, editingProduct);
        
        setProducts(products.map(product => 
          product.id === editingProduct.id ? updatedProduct : product
        ));
        setShowEditModal(false);
        setEditingProduct(null);
        
      } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        setError('Erreur lors de la modification du produit');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Supprimer un produit
  const deleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        setIsLoading(true);
        await caisseProductsService.deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        setError('Erreur lors de la suppression du produit');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Loader global */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <ArrowPathIcon className="h-6 w-6 text-green-600 animate-spin" />
            <span className="text-gray-700">Chargement...</span>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CogIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres Caisse</h1>
            <p className="text-gray-600">Configuration et gestion des produits</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Synchroniser</span>
        </button>
      </div>

      {/* Gestion des Produits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CubeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Produits</h2>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter Produit</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.emoji} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const StatusIcon = stockStatus.icon;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getCategoryEmoji(product.category)}</span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un nouveau produit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Piment Habanero"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(cat => cat.value !== 'ALL').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition de produit */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le produit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(cat => cat.value !== 'ALL').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={editingProduct.status || 'active'}
                  onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">En vente</option>
                  <option value="inactive">Hors vente</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveProductChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
