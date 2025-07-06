import { useState, useEffect } from 'react';
import Head from 'next/head';
import ModernDashboardLayout from '../../layouts/ModernDashboardLayout';
import ModernDashboardOverview from '../../components/dashboard/ModernDashboardOverview';
import ModernHarvestModule from '../../components/dashboard/ModernHarvestModule';
import SalesModule from '../../components/dashboard/SalesModule';
import ReportsModule from '../../components/dashboard/ReportsModule';
import TeamModule from '../../components/dashboard/TeamModule';
import OperationsModule from '../../components/dashboard/OperationsModule';
import CaisseModule from '../../components/dashboard/CaisseModule';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    todayHarvest: [],
    todaySales: [],
    currentStock: [],
    alerts: [],
    teamActivity: [],
    kpis: {
      dailyRevenue: 0,
      weeklyProductivity: 0,
      monthlyGrowth: 0,
      stockLevel: 0
    }
  });

  useEffect(() => {
    // Charger les données du dashboard
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulation des données - à remplacer par des appels API réels
      const mockData = {
        todayHarvest: [
          { product: 'Poivron De conti', quantity: 25, quality: 'A', technician: 'Jean Mbeng' },
          { product: 'Tomate Padma', quantity: 40, quality: 'A', technician: 'Marie Nze' },
          { product: 'Piment Demon', quantity: 15, quality: 'B', technician: 'Paul Obiang' }
        ],
        todaySales: [
          { product: 'Poivron', quantity: 20, amount: 50000, client: 'Restaurant Le Palmier' },
          { product: 'Tomate', quantity: 30, amount: 45000, client: 'Particulier' }
        ],
        currentStock: [
          { product: 'Poivron', quantity: 45, unit: 'kg', status: 'normal' },
          { product: 'Tomate', quantity: 60, unit: 'kg', status: 'normal' },
          { product: 'Piment', quantity: 8, unit: 'kg', status: 'low' }
        ],
        alerts: [
          { type: 'stock', message: 'Stock de piment faible (8kg)', priority: 'high' },
          { type: 'quality', message: 'Contrôle qualité prévu demain', priority: 'medium' }
        ],
        teamActivity: [
          { name: 'Jean Mbeng', status: 'active', task: 'Récolte poivrons - Secteur A' },
          { name: 'Marie Nze', status: 'active', task: 'Récolte tomates - Secteur B' },
          { name: 'Paul Obiang', status: 'break', task: 'Pause déjeuner' }
        ],
        kpis: {
          dailyRevenue: 95000,
          weeklyProductivity: 85,
          monthlyGrowth: 12,
          stockLevel: 78
        }
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <ModernDashboardOverview data={dashboardData} />;
      case 'harvest':
        return <ModernHarvestModule />;
      case 'sales':
        return <SalesModule />;
      case 'caisse':
        return <CaisseModule />;
      case 'reports':
        return <ReportsModule />;
      case 'team':
        return <TeamModule />;
      case 'operations':
        return <OperationsModule />;
      default:
        return <ModernDashboardOverview data={dashboardData} />;
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
