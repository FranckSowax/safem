import { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon, UserIcon, MapPinIcon as LocationMarkerIcon } from '@heroicons/react/24/outline';

const PRODUCTS = {
  maraicher: [
    { name: 'Poivron De conti', varieties: ['De conti', 'Nobili', 'Yolo wander'], price: [2000, 2500] },
    { name: 'Tomate', varieties: ['Padma', 'Anita'], price: [1500, 1500] },
    { name: 'Piment', varieties: ['Demon', 'Avenir', 'Shamsi', 'The king'], price: [2000, 4000] },
    { name: 'Chou', varieties: ['Aventy'], price: [1000, 1000] },
    { name: 'Gombo', varieties: ['Kirikou'], price: [2000, 2000] },
    { name: 'Concombre', varieties: ['Murano'], price: [1000, 1000] },
    { name: 'Aubergine', varieties: ['Africaine (blanche)', 'Bonika (violette)', 'Ping Tung (chinoise)'], price: [1000, 2000] },
    { name: 'Cyboulette', varieties: ['-'], price: [600, 600] }
  ],
  vivrier: [
    { name: 'Banane plantain', varieties: ['Ebanga'], price: [1000, 1000] },
    { name: 'Banane douce', varieties: ['-'], price: [1500, 1500] },
    { name: 'Taro blanc', varieties: ['-'], price: [1000, 1000] },
    { name: 'Taro rouge', varieties: ['-'], price: [1500, 1500] }
  ]
};

const TECHNICIANS = [
  'Jean Mbeng',
  'Marie Nze', 
  'Paul Obiang',
  'Sophie Ndong',
  'Pierre Essono',
  'Spécialiste Banane - Thomas Mba'
];

const SECTORS = [
  'Secteur A - Maraîchage',
  'Secteur B - Maraîchage', 
  'Secteur C - Vivriers',
  'Secteur D - Bananeraie',
  'Serre 1',
  'Serre 2'
];

export default function HarvestModule() {
  const [activeTab, setActiveTab] = useState('saisie');
  const [harvestForm, setHarvestForm] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    sector: '',
    products: []
  });
  const [selectedCategory, setSelectedCategory] = useState('maraicher');
  const [harvestHistory, setHarvestHistory] = useState([]);

  useEffect(() => {
    loadHarvestHistory();
  }, []);

  const loadHarvestHistory = () => {
    // Simulation des données historiques
    const mockHistory = [
      {
        id: 1,
        date: '2024-01-15',
        technician: 'Jean Mbeng',
        sector: 'Secteur A',
        products: [
          { name: 'Poivron De conti', variety: 'De conti', quantity: 25, quality: 'A', losses: 2 },
          { name: 'Tomate', variety: 'Padma', quantity: 30, quality: 'A', losses: 0 }
        ],
        totalQuantity: 55,
        observations: 'Bonne récolte, qualité excellente'
      },
      {
        id: 2,
        date: '2024-01-14',
        technician: 'Marie Nze',
        sector: 'Secteur B',
        products: [
          { name: 'Piment', variety: 'Demon', quantity: 15, quality: 'B', losses: 1 }
        ],
        totalQuantity: 15,
        observations: 'Quelques fruits abîmés par la pluie'
      }
    ];
    setHarvestHistory(mockHistory);
  };

  const addProductToHarvest = () => {
    const newProduct = {
      id: Date.now(),
      category: selectedCategory,
      name: '',
      variety: '',
      quantity: '',
      quality: 'A',
      losses: '',
      method: 'organique',
      observations: ''
    };
    setHarvestForm(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const updateProduct = (productId, field, value) => {
    setHarvestForm(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === productId ? { ...product, [field]: value } : product
      )
    }));
  };

  const removeProduct = (productId) => {
    setHarvestForm(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== productId)
    }));
  };

  const submitHarvest = (e) => {
    e.preventDefault();
    
    if (!harvestForm.technician || !harvestForm.sector || harvestForm.products.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation des produits
    const invalidProducts = harvestForm.products.filter(p => !p.name || !p.quantity);
    if (invalidProducts.length > 0) {
      alert('Veuillez compléter tous les produits ajoutés');
      return;
    }

    // Simulation de l'enregistrement
    const newHarvest = {
      id: Date.now(),
      ...harvestForm,
      totalQuantity: harvestForm.products.reduce((sum, p) => sum + parseFloat(p.quantity || 0), 0)
    };

    setHarvestHistory(prev => [newHarvest, ...prev]);
    
    // Reset du formulaire
    setHarvestForm({
      date: new Date().toISOString().split('T')[0],
      technician: '',
      sector: '',
      products: []
    });

    alert('Récolte enregistrée avec succès !');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Collecte des Récoltes</h1>
        <p className="text-gray-600">Gestion quotidienne des récoltes de la ferme MIDJEMBOU</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('saisie')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'saisie'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Saisie Récolte
          </button>
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
            onClick={() => setActiveTab('statistiques')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'statistiques'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Statistiques
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'saisie' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Nouvelle Récolte</h3>
          </div>
          
          <form onSubmit={submitHarvest} className="p-6 space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Date de récolte
                </label>
                <input
                  type="date"
                  value={harvestForm.date}
                  onChange={(e) => setHarvestForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-1" />
                  Technicien responsable
                </label>
                <select
                  value={harvestForm.technician}
                  onChange={(e) => setHarvestForm(prev => ({ ...prev, technician: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Sélectionner un technicien</option>
                  {TECHNICIANS.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LocationMarkerIcon className="w-4 h-4 inline mr-1" />
                  Secteur/Parcelle
                </label>
                <select
                  value={harvestForm.sector}
                  onChange={(e) => setHarvestForm(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Sélectionner un secteur</option>
                  {SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sélection catégorie de produits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie de produits
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('maraicher')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === 'maraicher'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Maraîcher
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('vivrier')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === 'vivrier'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Vivrier
                </button>
              </div>
            </div>

            {/* Produits récoltés */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Produits récoltés</h4>
                <button
                  type="button"
                  onClick={addProductToHarvest}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter un produit
                </button>
              </div>

              {harvestForm.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
                </div>
              ) : (
                <div className="space-y-4">
                  {harvestForm.products.map((product, index) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Produit
                          </label>
                          <select
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          >
                            <option value="">Sélectionner</option>
                            {PRODUCTS[selectedCategory].map(p => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Variété
                          </label>
                          <select
                            value={product.variety}
                            onChange={(e) => updateProduct(product.id, 'variety', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={!product.name}
                          >
                            <option value="">Sélectionner</option>
                            {product.name && PRODUCTS[selectedCategory]
                              .find(p => p.name === product.name)?.varieties.map(variety => (
                                <option key={variety} value={variety}>{variety}</option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantité (kg)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Qualité
                          </label>
                          <select
                            value={product.quality}
                            onChange={(e) => updateProduct(product.id, 'quality', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="A">A - Excellente</option>
                            <option value="B">B - Bonne</option>
                            <option value="C">C - Correcte</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pertes (kg)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={product.losses}
                            onChange={(e) => updateProduct(product.id, 'losses', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Méthode
                          </label>
                          <select
                            value={product.method}
                            onChange={(e) => updateProduct(product.id, 'method', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="organique">Organique</option>
                            <option value="permaculture">Permaculture</option>
                            <option value="conventionnel">Conventionnel</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observations
                          </label>
                          <input
                            type="text"
                            value={product.observations}
                            onChange={(e) => updateProduct(product.id, 'observations', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Observations particulières..."
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setHarvestForm({
                    date: new Date().toISOString().split('T')[0],
                    technician: '',
                    sector: '',
                    products: []
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Enregistrer la récolte
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'historique' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historique des Récoltes</h3>
          </div>
          
          <div className="p-6">
            {harvestHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune récolte enregistrée
              </div>
            ) : (
              <div className="space-y-4">
                {harvestHistory.map((harvest) => (
                  <div key={harvest.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Récolte du {new Date(harvest.date).toLocaleDateString('fr-FR')}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Par {harvest.technician} - {harvest.sector}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {harvest.totalQuantity} kg
                        </div>
                        <div className="text-sm text-gray-500">
                          {harvest.products.length} produit{harvest.products.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                      {harvest.products.map((product, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-900">
                            {product.name} - {product.variety}
                          </div>
                          <div className="text-sm text-gray-600">
                            {product.quantity} kg - Qualité {product.quality}
                            {product.losses > 0 && (
                              <span className="text-red-600"> (Pertes: {product.losses} kg)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {harvest.observations && (
                      <div className="text-sm text-gray-600 italic">
                        Observations: {harvest.observations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'statistiques' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Productivité par Technicien</h3>
            <div className="space-y-3">
              {TECHNICIANS.slice(0, 5).map((tech, index) => (
                <div key={tech} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{tech}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor(Math.random() * 100)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Récoltes par Produit (7 derniers jours)</h3>
            <div className="space-y-3">
              {['Poivron', 'Tomate', 'Piment', 'Chou', 'Gombo'].map((product, index) => (
                <div key={product} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{product}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor(Math.random() * 200)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
