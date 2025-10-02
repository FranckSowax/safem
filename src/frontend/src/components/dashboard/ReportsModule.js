import { useState } from 'react';
import { DocumentTextIcon as DocumentReportIcon, ArrowTrendingUpIcon as TrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState('quotidien');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const mockData = {
    daily: {
      revenue: 125000,
      harvest: 85,
      sales: 12,
      productivity: 92
    },
    weekly: {
      revenue: 750000,
      harvest: 520,
      sales: 68,
      productivity: 88
    },
    monthly: {
      revenue: 3200000,
      harvest: 2100,
      sales: 285,
      productivity: 85
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
        <p className="text-gray-600">Indicateurs de performance et analyses</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['quotidien', 'hebdomadaire', 'mensuel', 'qualite', 'durabilite'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Sélecteur de période */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Du:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Au:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button className="px-4 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
            Actualiser
          </button>
        </div>
      </div>

      {/* Contenu des rapports */}
      {(activeTab === 'quotidien' || activeTab === 'hebdomadaire' || activeTab === 'mensuel') && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(mockData[activeTab === 'quotidien' ? 'daily' : activeTab === 'hebdomadaire' ? 'weekly' : 'monthly'].revenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentReportIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Récoltes (kg)</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData[activeTab === 'quotidien' ? 'daily' : activeTab === 'hebdomadaire' ? 'weekly' : 'monthly'].harvest}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="w-8 h-8 text-purple-500" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Ventes</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData[activeTab === 'quotidien' ? 'daily' : activeTab === 'hebdomadaire' ? 'weekly' : 'monthly'].sales}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Productivité</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData[activeTab === 'quotidien' ? 'daily' : activeTab === 'hebdomadaire' ? 'weekly' : 'monthly'].productivity}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques et tableaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des ventes</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                [Graphique des ventes - À implémenter avec Chart.js]
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par produit</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                [Graphique en secteurs - À implémenter avec Chart.js]
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qualite' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rapport Qualité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contrôles sanitaires</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conformité:</span>
                  <span className="text-green-600 font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux de rémanence:</span>
                  <span className="text-green-600 font-medium">&lt; 0.01%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fraîcheur</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai moyen récolte-vente:</span>
                  <span className="text-green-600 font-medium">18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objectif &lt; 24h:</span>
                  <span className="text-green-600 font-medium">✓ Atteint</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'durabilite' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rapport Durabilité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pratiques agricoles</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agriculture organique:</span>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Permaculture:</span>
                  <span className="text-green-600 font-medium">15%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Impact environnemental</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Arbres fruitiers:</span>
                  <span className="text-green-600 font-medium">500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consommation d'eau:</span>
                  <span className="text-green-600 font-medium">-12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
