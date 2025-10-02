import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  DocumentTextIcon as DocumentReportIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ArrowRightOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Vue d\'ensemble', href: '#', key: 'overview', icon: HomeIcon },
  { name: 'Collecte Récoltes', href: '#', key: 'harvest', icon: ChartBarIcon },
  { name: 'Gestion Ventes', href: '#', key: 'sales', icon: ShoppingCartIcon },
  { name: 'Rapports', href: '#', key: 'reports', icon: DocumentReportIcon },
  { name: 'Équipe', href: '#', key: 'team', icon: UserGroupIcon },
  { name: 'Opérations', href: '#', key: 'operations', icon: CogIcon },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleModuleChange = (moduleKey) => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard SAFEM</title>
        <meta name="description" content="Système de gestion agricole SAFEM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent 
            navigation={navigation} 
            activeModule={activeModule} 
            onModuleChange={handleModuleChange}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            navigation={navigation} 
            activeModule={activeModule} 
            onModuleChange={handleModuleChange}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard SAFEM - Ferme MIDJEMBOU
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <div className="relative">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <BellIcon className="h-6 w-6" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {alerts.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">AD</span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">Administrateur</div>
                    <div className="text-xs text-gray-500">Direction SAFEM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, activeModule, onModuleChange, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-indigo-700">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-900">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">S</span>
          </div>
          <span className="text-white font-semibold text-lg">SAFEM</span>
        </div>
      </div>

      {/* Valeurs SAFEM */}
      <div className="px-4 py-3 bg-indigo-800">
        <div className="text-indigo-200 text-xs font-medium mb-2">Nos Valeurs</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-indigo-100">🔨 Travail</div>
          <div className="text-indigo-100">💪 Engagement</div>
          <div className="text-indigo-100">🌱 Durabilité</div>
          <div className="text-indigo-100">📈 Progrès</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = activeModule === item.key;
          return (
            <button
              key={item.name}
              onClick={() => onModuleChange(item.key)}
              className={`${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-150`}
            >
              <item.icon
                className={`${
                  isActive ? 'text-white' : 'text-indigo-300'
                } mr-3 flex-shrink-0 h-6 w-6`}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4">
        <button
          onClick={onLogout}
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-600 w-full text-left transition-colors duration-150"
        >
          <LogoutIcon className="text-indigo-300 mr-3 flex-shrink-0 h-6 w-6" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
