import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ProductsService from '../../services/productsService';

export default function ModernHarvestModule() {
  const [activeTab, setActiveTab] = useState('saisie');
  const [harvestForm, setHarvestForm] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    sector: '',
    products: []
  });

  const [harvestHistory, setHarvestHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      technician: 'Jean Mbeng',
      sector: 'Secteur A',
      products: [
        { name: 'Poivron De conti', quantity: 25, unit: 'kg', quality: 'A' },
        { name: 'Tomate Padma', quantity: 40, unit: 'kg', quality: 'A' }
      ],
      totalQuantity: 65
    },
    {
      id: 2,
      date: '2024-01-14',
      technician: 'Marie Nze',
      sector: 'Secteur B',
      products: [
        { name: 'Piment Demon', quantity: 15, unit: 'kg', quality: 'B' }
      ],
      totalQuantity: 15
    }
  ]);

  // États pour les produits depuis Supabase
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Charger les produits depuis Supabase au montage
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const result = await ProductsService.getAllProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error('Erreur chargement produits:', result.error);
        // Fallback sur liste par défaut si erreur
        setProducts([
          { id: '1', name: 'Poivron De conti' },
          { id: '2', name: 'Tomate Padma' },
          { id: '3', name: 'Piment Demon' }
        ]);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const technicians = [
    'Jean Mbeng',
    'Marie Nze',
    'Paul Obiang',
    'Sophie Ondo',
    'Pierre Essono'
  ];

  const sectors = [
    'Secteur A - Poivrons',
    'Secteur B - Tomates',
    'Secteur C - Piments',
    'Secteur D - Légumes verts'
  ];

  const addProduct = () => {
    setHarvestForm({
      ...harvestForm,
      products: [...harvestForm.products, { name: '', quantity: '', unit: 'kg', quality: 'A' }]
    });
  };

  const removeProduct = (index) => {
    const newProducts = harvestForm.products.filter((_, i) => i !== index);
    setHarvestForm({ ...harvestForm, products: newProducts });
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...harvestForm.products];
    newProducts[index][field] = value;
    setHarvestForm({ ...harvestForm, products: newProducts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (harvestForm.products.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }

    const newHarvest = {
      id: Date.now(),
      ...harvestForm,
      totalQuantity: harvestForm.products.reduce((sum, product) => sum + parseFloat(product.quantity || 0), 0)
    };

    setHarvestHistory([newHarvest, ...harvestHistory]);
    setHarvestForm({
      date: new Date().toISOString().split('T')[0],
      technician: '',
      sector: '',
      products: []
    });
    alert('Récolte enregistrée avec succès !');
  };

  const tabs = [
    { key: 'saisie', label: 'Nouvelle Récolte', icon: PlusIcon },
    { key: 'historique', label: 'Historique', icon: CalendarIcon },
    { key: 'statistiques', label: 'Statistiques', icon: ChartBarIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Gestion des Récoltes</h2>
        <p className="text-gray-600 text-sm sm:text-base">Enregistrez et suivez vos récoltes quotidiennes</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'saisie' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de récolte
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={harvestForm.date}
                      onChange={(e) => setHarvestForm({ ...harvestForm, date: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technicien
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={harvestForm.technician}
                      onChange={(e) => setHarvestForm({ ...harvestForm, technician: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un technicien</option>
                      {technicians.map((tech) => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={harvestForm.sector}
                      onChange={(e) => setHarvestForm({ ...harvestForm, sector: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un secteur</option>
                      {sectors.map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Produits récoltés</h3>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </button>
                </div>

                {harvestForm.products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {harvestForm.products.map((product, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Produit
                            </label>
                            <select
                              value={product.name}
                              onChange={(e) => updateProduct(index, 'name', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                              disabled={loadingProducts}
                            >
                              <option value="">{loadingProducts ? 'Chargement...' : 'Sélectionner un produit'}</option>
                              {products.map((prod) => (
                                <option key={prod.id} value={prod.name}>{prod.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantité
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
                              step="0.1"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unité
                            </label>
                            <select
                              value={product.unit}
                              onChange={(e) => updateProduct(index, 'unit', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="kg">kg</option>
                              <option value="g">g</option>
                              <option value="pièces">pièces</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Qualité
                            </label>
                            <select
                              value={product.quality}
                              onChange={(e) => updateProduct(index, 'quality', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="A">A - Excellente</option>
                              <option value="B">B - Bonne</option>
                              <option value="C">C - Moyenne</option>
                            </select>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => removeProduct(index)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium"
                >
                  Enregistrer la récolte
                </button>
              </div>
            </form>
          )}

          {activeTab === 'historique' && (
            <div className="space-y-4">
              {harvestHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune récolte enregistrée</p>
                </div>
              ) : (
                harvestHistory.map((harvest) => (
                  <div key={harvest.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Récolte du {new Date(harvest.date).toLocaleDateString('fr-FR')}
                        </h3>
                        <p className="text-gray-600">
                          {harvest.technician} - {harvest.sector}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{harvest.totalQuantity} kg</p>
                        <p className="text-sm text-gray-500">Total récolté</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {harvest.products.map((product, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-gray-600">{product.quantity} {product.unit}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            product.quality === 'A' ? 'bg-green-100 text-green-800' :
                            product.quality === 'B' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Qualité {product.quality}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Total cette semaine</h3>
                <p className="text-3xl font-bold">245 kg</p>
                <p className="text-green-100 text-sm mt-2">+15% vs semaine dernière</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Produit le plus récolté</h3>
                <p className="text-2xl font-bold text-gray-900">Tomate Padma</p>
                <p className="text-gray-600 text-sm mt-2">120 kg cette semaine</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité moyenne</h3>
                <p className="text-2xl font-bold text-green-600">A</p>
                <p className="text-gray-600 text-sm mt-2">85% qualité A ou B</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
