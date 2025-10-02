import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  DocumentTextIcon as DocumentReportIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '#', key: 'overview', icon: HomeIcon },
  { name: 'Récoltes', href: '#', key: 'harvest', icon: ChartBarIcon },
  { name: 'Ventes', href: '#', key: 'sales', icon: ShoppingCartIcon },
  { name: 'Caisse', href: '#', key: 'caisse', icon: CurrencyDollarIcon },
  { name: 'Clients', href: '#', key: 'clients', icon: UserGroupIcon },
  { name: 'Boutique Pro', href: '#', key: 'boutique', icon: ShoppingCartIcon },
  { name: 'Rapports', href: '#', key: 'reports', icon: DocumentReportIcon },
  { name: 'Équipe', href: '#', key: 'team', icon: UserGroupIcon },
  { name: 'Opérations', href: '#', key: 'operations', icon: CogIcon },
];



export default function ModernDashboardLayout({ children, activeModule, setActiveModule }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleModuleChange = (item) => {
    setActiveModule(item.key);
    setSidebarOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleModuleChangeWithClose = (item) => {
    if (item.isExternal) {
      router.push(item.href);
    } else {
      setActiveModule(item.key);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard SAFEM</title>
        <meta name="description" content="Système de gestion agricole SAFEM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-64 md:bg-white md:shadow-lg md:flex">
        <div className="flex h-full flex-col w-full">
          {/* Logo */}
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">SAFEM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = activeModule === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleModuleChange(item)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin SAFEM</p>
                <p className="text-xs text-gray-500">admin@safem.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Mobile Header with Close Button */}
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">SAFEM</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = activeModule === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleModuleChangeWithClose(item)}
                  className={`w-full flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Mobile User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium text-base">A</span>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-900">Admin SAFEM</p>
                <p className="text-sm text-gray-500">admin@safem.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-3"
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
                
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {navigation.find(item => item.key === activeModule)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                    Gérez et suivez vos activités agricoles avec facilité
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search - Hidden on mobile */}
                <div className="relative hidden md:block">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-48 lg:w-64"
                  />
                </div>

                {/* Mobile Search Button */}
                <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>


              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
