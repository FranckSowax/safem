import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardService from '../services/dashboardService';

/**
 * Hook personnalisé pour gérer les données du dashboard avec synchronisation temps réel
 * @param {Object} options - Options de configuration
 * @param {number} options.refreshInterval - Intervalle de rafraîchissement en ms (défaut: 30000)
 * @param {boolean} options.realtime - Activer la synchronisation temps réel (défaut: true)
 * @returns {Object} État et fonctions du dashboard
 */
export function useDashboard(options = {}) {
  const {
    refreshInterval = 30000, // 30 secondes en mode Realtime (polling de secours)
    realtime = true // Activé - Supabase Realtime maintenant configuré
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const refreshIntervalRef = useRef(null);
  const realtimeUnsubscribeRef = useRef(null);

  /**
   * Charger les données du dashboard
   */
  const loadData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 [useDashboard] Chargement des données...', { showLoading, timestamp: new Date().toISOString() });
      const dashboardData = await DashboardService.getDashboardData();
      console.log('✅ [useDashboard] Données chargées:', {
        todaySales: dashboardData.todaySales?.length || 0,
        dailyRevenue: dashboardData.kpis?.dailyRevenue || 0,
        timestamp: new Date().toISOString()
      });
      
      setData(dashboardData);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('❌ [useDashboard] Erreur lors du chargement des données dashboard:', err);
      
      // Gestion spéciale pour les erreurs de connexion
      if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_CLOSED')) {
        console.warn('⚠️ [useDashboard] Connexion fermée - utilisation des données en cache');
        // Ne pas afficher l'erreur à l'utilisateur pour les erreurs de connexion
        return;
      }
      
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Forcer le rechargement des données
   */
  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  /**
   * Gérer les changements temps réel
   */
  const handleRealtimeChange = useCallback(async (table, payload) => {
    console.log(`🔄 Mise à jour temps réel détectée sur ${table}:`, payload);
    
    // Attendre un peu pour que les données soient cohérentes
    setTimeout(async () => {
      await loadData(false); // Rechargement silencieux
    }, 1000);
  }, [loadData]);

  /**
   * Configurer la synchronisation temps réel
   */
  const setupRealtime = useCallback(() => {
    if (realtime && !realtimeUnsubscribeRef.current) {
      realtimeUnsubscribeRef.current = DashboardService.subscribeToChanges(handleRealtimeChange);
      console.log('✅ Synchronisation temps réel activée');
    }
  }, [realtime, handleRealtimeChange]);

  /**
   * Configurer le rafraîchissement automatique
   */
  const setupAutoRefresh = useCallback(() => {
    if (refreshInterval > 0 && !refreshIntervalRef.current) {
      refreshIntervalRef.current = setInterval(() => {
        console.log('⏰ [useDashboard] Rafraîchissement automatique déclenché', { timestamp: new Date().toISOString() });
        loadData(false); // Rechargement silencieux
      }, refreshInterval);
      console.log(`⏰ [useDashboard] Rafraîchissement automatique configuré: ${refreshInterval}ms`);
    }
  }, [refreshInterval, loadData]);

  /**
   * Nettoyer les abonnements
   */
  const cleanup = useCallback(() => {
    // Nettoyer l'intervalle de rafraîchissement
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Nettoyer l'abonnement temps réel
    if (realtimeUnsubscribeRef.current) {
      realtimeUnsubscribeRef.current();
      realtimeUnsubscribeRef.current = null;
    }
  }, []);

  // Effet principal - chargement initial et configuration
  useEffect(() => {
    loadData(true);
    setupRealtime();
    setupAutoRefresh();

    // Nettoyage lors du démontage
    return cleanup;
  }, [loadData, setupRealtime, setupAutoRefresh, cleanup]);

  // Nettoyage lors du changement d'options
  useEffect(() => {
    cleanup();
    setupRealtime();
    setupAutoRefresh();
  }, [realtime, refreshInterval, cleanup, setupRealtime, setupAutoRefresh]);

  /**
   * Obtenir un résumé des KPIs formatés
   */
  const getFormattedKPIs = useCallback(() => {
    if (!data?.kpis) return null;

    const { kpis } = data;
    
    return {
      dailyRevenue: {
        value: kpis.dailyRevenue,
        formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0,
        }).format(kpis.dailyRevenue),
        trend: kpis.dailyRevenue > 0 ? 'up' : 'neutral'
      },
      dailySales: {
        value: kpis.dailySales,
        formatted: `${kpis.dailySales} vente${kpis.dailySales > 1 ? 's' : ''}`,
        trend: kpis.dailySales > 0 ? 'up' : 'neutral'
      },
      weeklyRevenue: {
        value: kpis.weeklyRevenue,
        formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0,
        }).format(kpis.weeklyRevenue),
        trend: kpis.monthlyGrowth > 0 ? 'up' : kpis.monthlyGrowth < 0 ? 'down' : 'neutral'
      },
      averageSale: {
        value: kpis.averageSale,
        formatted: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0,
        }).format(kpis.averageSale),
        trend: 'neutral'
      }
    };
  }, [data]);

  /**
   * Obtenir les alertes par priorité
   */
  const getAlertsByPriority = useCallback(() => {
    if (!data?.alerts) return { high: [], medium: [], low: [] };

    return data.alerts.reduce((acc, alert) => {
      const priority = alert.priority || 'low';
      if (!acc[priority]) acc[priority] = [];
      acc[priority].push(alert);
      return acc;
    }, { high: [], medium: [], low: [] });
  }, [data]);

  /**
   * Vérifier si les données sont récentes
   */
  const isDataFresh = useCallback(() => {
    if (!lastUpdate) return false;
    const now = new Date();
    const diffMinutes = (now - lastUpdate) / (1000 * 60);
    return diffMinutes < 5; // Données considérées comme fraîches si < 5 minutes
  }, [lastUpdate]);

  return {
    // Données
    data,
    loading,
    error,
    lastUpdate,
    
    // Actions
    refresh,
    
    // Utilitaires
    getFormattedKPIs,
    getAlertsByPriority,
    isDataFresh,
    
    // État
    isConnected: !error && data !== null,
    isEmpty: data && Object.keys(data).length === 0
  };
}

export default useDashboard;
