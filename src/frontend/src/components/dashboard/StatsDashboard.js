import { useState, useEffect } from 'react';
import { ArrowPathIcon, CalendarIcon } from '@heroicons/react/24/outline';
import TopProductsModule from './TopProductsModule';
import CategoryStatsModule from './CategoryStatsModule';
import PerformanceStatsModule from './PerformanceStatsModule';
import TopCustomersModule from './TopCustomersModule';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Dashboard Statistiques Intégré
 * Combine tous les modules de statistiques synchronisés avec Supabase
 */
const StatsDashboard = () => {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Périodes disponibles
  const periods = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: 'all', label: 'Tout' }
  ];

  useEffect(() => {
    // Tester la connexion Supabase au chargement
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      const result = await SalesStatsService.getSalesStats('7d');
      setIsConnected(result.success);
      if (result.success) {
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await testConnection();
    // Force le rechargement de tous les modules en changeant la clé
    setLastUpdate(new Date());
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header du dashboard */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">📊 Statistiques de Ventes</h1>
            <p className="text-gray-600 mt-1">
              Analyse des performances synchronisée avec Supabase
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Sélecteur de période */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Statut et rafraîchissement */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isConnected ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>

              {lastUpdate && (
                <div className="text-sm text-gray-500">
                  MAJ: {formatDate(lastUpdate)}
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerte de connexion */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div>
              <p className="text-red-800 font-medium">Connexion Supabase indisponible</p>
              <p className="text-red-600 text-sm">
                Les statistiques peuvent ne pas être à jour. Vérifiez votre configuration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grille des modules statistiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance générale - Prend toute la largeur sur mobile */}
        <div className="xl:col-span-2">
          <PerformanceStatsModule 
            period={period} 
            key={`performance-${period}-${lastUpdate?.getTime()}`}
          />
        </div>

        {/* Top produits */}
        <TopProductsModule 
          period={period} 
          limit={5}
          key={`products-${period}-${lastUpdate?.getTime()}`}
        />

        {/* Répartition par catégorie */}
        <CategoryStatsModule 
          period={period}
          key={`categories-${period}-${lastUpdate?.getTime()}`}
        />

        {/* Meilleurs clients - Prend toute la largeur */}
        <div className="xl:col-span-2">
          <TopCustomersModule 
            period={period} 
            limit={5}
            key={`customers-${period}-${lastUpdate?.getTime()}`}
          />
        </div>
      </div>

      {/* Footer avec informations */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-gray-600">
              📈 Données synchronisées en temps réel avec Supabase
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Période: {periods.find(p => p.value === period)?.label}</span>
            <span>•</span>
            <span>Modules: 4 actifs</span>
            <span>•</span>
            <span>Statut: {isConnected ? '✅ Opérationnel' : '❌ Hors ligne'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
