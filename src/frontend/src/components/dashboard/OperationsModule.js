import { useState } from 'react';
import { ArchiveBoxIcon as CubeIcon, CogIcon, ExclamationTriangleIcon, TruckIcon } from '@heroicons/react/24/outline';

const STOCK_DATA = [
  { id: 1, product: 'Tomates', quantity: 45, unit: 'kg', minStock: 20, location: 'Entrepôt A', lastUpdate: '2024-01-15T10:30:00' },
  { id: 2, product: 'Poivrons', quantity: 12, unit: 'kg', minStock: 15, location: 'Entrepôt A', lastUpdate: '2024-01-15T09:15:00' },
  { id: 3, product: 'Aubergines', quantity: 28, unit: 'kg', minStock: 10, location: 'Entrepôt B', lastUpdate: '2024-01-15T11:00:00' },
  { id: 4, product: 'Bananes', quantity: 150, unit: 'kg', minStock: 50, location: 'Entrepôt C', lastUpdate: '2024-01-15T08:45:00' },
  { id: 5, product: 'Manioc', quantity: 8, unit: 'kg', minStock: 25, location: 'Entrepôt B', lastUpdate: '2024-01-15T12:00:00' }
];

const EQUIPMENT_DATA = [
  { id: 1, name: 'Tracteur John Deere', type: 'Véhicule', status: 'operational', lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10', location: 'Garage principal' },
  { id: 2, name: 'Système irrigation Secteur A', type: 'Irrigation', status: 'maintenance', lastMaintenance: '2024-01-05', nextMaintenance: '2024-01-20', location: 'Secteur A' },
  { id: 3, name: 'Serre automatisée 1', type: 'Infrastructure', status: 'operational', lastMaintenance: '2023-12-15', nextMaintenance: '2024-01-25', location: 'Serre 1' },
  { id: 4, name: 'Groupe électrogène', type: 'Énergie', status: 'warning', lastMaintenance: '2023-12-20', nextMaintenance: '2024-01-18', location: 'Local technique' },
  { id: 5, name: 'Camion de livraison', type: 'Transport', status: 'operational', lastMaintenance: '2024-01-08', nextMaintenance: '2024-02-08', location: 'Parking' }
];

const ALERTS = [
  { id: 1, type: 'stock', message: 'Stock faible: Poivrons (12 kg)', severity: 'warning', timestamp: '2024-01-15T10:30:00' },
  { id: 2, type: 'stock', message: 'Stock critique: Manioc (8 kg)', severity: 'critical', timestamp: '2024-01-15T12:00:00' },
  { id: 3, type: 'equipment', message: 'Maintenance requise: Groupe électrogène', severity: 'warning', timestamp: '2024-01-15T09:00:00' },
  { id: 4, type: 'equipment', message: 'Système irrigation en panne - Secteur A', severity: 'critical', timestamp: '2024-01-15T08:15:00' }
];

export default function OperationsModule() {
  const [activeTab, setActiveTab] = useState('stocks');
  const [showAddStock, setShowAddStock] = useState(false);
  const [newStock, setNewStock] = useState({
    product: '',
    quantity: '',
    unit: 'kg',
    minStock: '',
    location: ''
  });

  const getStockStatus = (current, min) => {
    if (current <= min * 0.5) return { status: 'critical', color: 'text-red-600 bg-red-100' };
    if (current <= min) return { status: 'warning', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'good', color: 'text-green-600 bg-green-100' };
  };

  const getEquipmentStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'broken': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    console.log('Nouveau stock:', newStock);
    setShowAddStock(false);
    setNewStock({
      product: '',
      quantity: '',
      unit: 'kg',
      minStock: '',
      location: ''
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion Opérationnelle</h1>
        <p className="text-gray-600">Suivi des stocks, équipements et alertes</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stocks'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab('equipements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'equipements'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Équipements
          </button>
          <button
            onClick={() => setActiveTab('alertes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alertes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Alertes
          </button>
          <button
            onClick={() => setActiveTab('logistique')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logistique'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Logistique
          </button>
        </nav>
      </div>

      {/* Vue Stocks */}
      {activeTab === 'stocks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Gestion des Stocks</h3>
            <button
              onClick={() => setShowAddStock(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Ajouter Stock
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emplacement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière MAJ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {STOCK_DATA.map((item) => {
                      const stockStatus = getStockStatus(item.quantity, item.minStock);
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CubeIcon className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.product}</div>
                                <div className="text-sm text-gray-500">Min: {item.minStock} {item.unit}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                              {stockStatus.status === 'critical' ? 'Critique' : 
                               stockStatus.status === 'warning' ? 'Faible' : 'Bon'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.lastUpdate).toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal Ajouter Stock */}
          {showAddStock && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter Stock</h3>
                <form onSubmit={handleAddStock} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                    <input
                      type="text"
                      value={newStock.product}
                      onChange={(e) => setNewStock(prev => ({ ...prev, product: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                      <input
                        type="number"
                        value={newStock.quantity}
                        onChange={(e) => setNewStock(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                      <select
                        value={newStock.unit}
                        onChange={(e) => setNewStock(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="kg">kg</option>
                        <option value="unité">unité</option>
                        <option value="caisse">caisse</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum</label>
                    <input
                      type="number"
                      value={newStock.minStock}
                      onChange={(e) => setNewStock(prev => ({ ...prev, minStock: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
                    <select
                      value={newStock.location}
                      onChange={(e) => setNewStock(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="Entrepôt A">Entrepôt A</option>
                      <option value="Entrepôt B">Entrepôt B</option>
                      <option value="Entrepôt C">Entrepôt C</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddStock(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vue Équipements */}
      {activeTab === 'equipements' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Maintenance des Équipements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EQUIPMENT_DATA.map((equipment) => (
              <div key={equipment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CogIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{equipment.name}</h4>
                      <p className="text-xs text-gray-500">{equipment.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getEquipmentStatusColor(equipment.status)}`}>
                    {equipment.status === 'operational' ? 'Opérationnel' :
                     equipment.status === 'maintenance' ? 'Maintenance' :
                     equipment.status === 'warning' ? 'Attention' : 'En panne'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Emplacement:</span>
                    <span className="text-gray-900">{equipment.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dernière maintenance:</span>
                    <span className="text-gray-900">
                      {new Date(equipment.lastMaintenance).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prochaine maintenance:</span>
                    <span className="text-gray-900">
                      {new Date(equipment.nextMaintenance).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Programmer maintenance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue Alertes */}
      {activeTab === 'alertes' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Centre d'Alertes</h3>
          
          <div className="space-y-4">
            {ALERTS.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${getAlertSeverityColor(alert.severity)}`}>
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.message}</p>
                      <span className="text-xs">
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs uppercase font-medium">
                        {alert.type === 'stock' ? 'Stock' : 'Équipement'}
                      </span>
                      <span className="text-xs uppercase font-medium">
                        {alert.severity === 'critical' ? 'Critique' : 'Attention'}
                      </span>
                    </div>
                  </div>
                  <button className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75">
                    Résoudre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue Logistique */}
      {activeTab === 'logistique' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Gestion Logistique</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TruckIcon className="w-8 h-8 text-blue-500" />
                <h4 className="text-lg font-medium text-gray-900">Livraisons du jour</h4>
              </div>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Marché Central - Libreville</p>
                      <p className="text-sm text-gray-500">Tomates (30kg), Poivrons (15kg)</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Livré
                    </span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Restaurant Le Palmier</p>
                      <p className="text-sm text-gray-500">Aubergines (10kg), Bananes (25kg)</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      En cours
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Planification Transport</h4>
              <div className="text-center py-8 text-gray-500">
                <TruckIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Module de planification - À implémenter</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
