import { useState } from 'react';
import Head from 'next/head';
import ModernDashboardLayout from '../../layouts/ModernDashboardLayout';
import ModernDashboardOverview from '../../components/dashboard/ModernDashboardOverview';
import ModernHarvestModule from '../../components/dashboard/ModernHarvestModule';
import SalesModule from '../../components/dashboard/SalesModule';
import CaisseModule from '../../components/dashboard/CaisseModule';
import BoutiqueModule from '../../components/dashboard/BoutiqueModule';
import ReportsModule from '../../components/dashboard/ReportsModule';
import TeamModule from '../../components/dashboard/TeamModule';
import OperationsModule from '../../components/dashboard/OperationsModule';
import ClientsModule from '../../components/dashboard/ClientsModule';
import useDashboard from '../../hooks/useDashboard';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  
  // Utiliser le hook personnalisé pour les données dashboard
  const {
    data: dashboardData,
    loading,
    error,
    refresh,
    lastUpdate,
    isConnected,
    getFormattedKPIs,
    getAlertsByPriority
  } = useDashboard({
    refreshInterval: 30000, // 30 secondes
    realtime: true
  });



  const renderActiveModule = () => {
    // Afficher un loader pendant le chargement initial
    if (loading && !dashboardData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Chargement des données...</span>
        </div>
      );
    }

    // Afficher une erreur si les données n'ont pas pu être chargées
    if (error && !dashboardData) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }

    switch (activeModule) {
      case 'overview':
        return (
          <ModernDashboardOverview 
            data={dashboardData || {}} 
            loading={loading}
            lastUpdate={lastUpdate}
            onRefresh={refresh}
            isConnected={isConnected}
          />
        );
      case 'harvest':
        return <ModernHarvestModule />;
      case 'sales':
        return (
          <SalesModule 
            data={dashboardData}
            recentSales={dashboardData?.recentSales || []}
            todaySales={dashboardData?.todaySales || []}
            currentStock={dashboardData?.currentStock || []}
          />
        );
      case 'caisse':
        return <CaisseModule />;
      case 'boutique':
        return <BoutiqueModule />;
      case 'reports':
        return <ReportsModule data={dashboardData} />;
      case 'team':
        return <TeamModule />;
      case 'operations':
        return <OperationsModule />;
      case 'clients':
        return <ClientsModule />;
      default:
        return (
          <ModernDashboardOverview 
            data={dashboardData || {}} 
            loading={loading}
            lastUpdate={lastUpdate}
            onRefresh={refresh}
            isConnected={isConnected}
          />
        );
    }
  };

  return (
    <ModernDashboardLayout 
      activeModule={activeModule} 
      setActiveModule={setActiveModule}
    >
      {renderActiveModule()}
    </ModernDashboardLayout>
  );
}
