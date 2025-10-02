import { useState, useEffect } from 'react';
import { UserGroupIcon, StarIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Module Meilleurs Clients
 * Affiche les clients avec le plus d'achats et leur valeur
 */
const TopCustomersModule = ({ period = '30d', limit = 5 }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTopCustomers();
  }, [period, limit]);

  const loadTopCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser directement la méthode du service
      const result = await getTopCustomersDirect();
      if (result.success) {
        setCustomers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur dans loadTopCustomers:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getTopCustomersDirect = async () => {
    try {
      // Import dynamique pour éviter les erreurs de build
      const { default: supabase } = await import('../../services/supabaseClient');
      
      let query = supabase
        .from('sales')
        .select('client_name, client_phone, total_amount, sale_date, status');

      // Filtrer par période
      if (period !== 'all') {
        const days = parseInt(period.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('sale_date', startDate.toISOString());
      }

      query = query.eq('status', 'completed');

      const { data: sales, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Calculer les statistiques par client
      const customerStats = {};
      
      sales.forEach(sale => {
        const clientName = sale.client_name || 'Client inconnu';
        const clientPhone = sale.client_phone || '';
        const amount = parseFloat(sale.total_amount) || 0;

        if (!customerStats[clientName]) {
          customerStats[clientName] = {
            client_name: clientName,
            client_phone: clientPhone,
            total_orders: 0,
            total_spent: 0,
            avg_order_value: 0,
            last_order_date: sale.sale_date
          };
        }

        customerStats[clientName].total_orders += 1;
        customerStats[clientName].total_spent += amount;
        
        // Garder la date la plus récente
        if (new Date(sale.sale_date) > new Date(customerStats[clientName].last_order_date)) {
          customerStats[clientName].last_order_date = sale.sale_date;
        }
      });

      // Calculer la valeur moyenne et trier
      const sortedCustomers = Object.values(customerStats)
        .map(customer => ({
          ...customer,
          avg_order_value: customer.total_spent / customer.total_orders
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, limit);

      return { success: true, data: sortedCustomers };

    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getCustomerLevel = (totalSpent) => {
    if (totalSpent >= 100000) return { level: 'VIP', color: 'text-purple-600 bg-purple-100', icon: '👑' };
    if (totalSpent >= 50000) return { level: 'Gold', color: 'text-yellow-600 bg-yellow-100', icon: '🥇' };
    if (totalSpent >= 20000) return { level: 'Silver', color: 'text-gray-600 bg-gray-100', icon: '🥈' };
    return { level: 'Bronze', color: 'text-orange-600 bg-orange-100', icon: '🥉' };
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Meilleurs Clients</h3>
            <p className="text-sm text-gray-500">Top {limit} par valeur ({period})</p>
          </div>
        </div>
        
        <button
          onClick={loadTopCustomers}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <StarIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Contenu */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-2">❌ {error}</p>
            <button
              onClick={loadTopCustomers}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : customers.length > 0 ? (
          customers.map((customer, index) => {
            const level = getCustomerLevel(customer.total_spent);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(customer.client_name)}
                  </div>
                  
                  {/* Infos client */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{customer.client_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                        {level.icon} {level.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      {customer.client_phone && (
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="h-3 w-3" />
                          <span>{customer.client_phone}</span>
                        </div>
                      )}
                      <span>•</span>
                      <span>{customer.total_orders} commande{customer.total_orders > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>Dernière: {formatDate(customer.last_order_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(customer.total_spent)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Moy: {formatCurrency(customer.avg_order_value)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun client sur cette période</p>
          </div>
        )}
      </div>

      {/* Footer avec statistiques globales */}
      {customers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-purple-600">
                {customers.length}
              </div>
              <div className="text-xs text-gray-500">Top Clients</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(customers.reduce((sum, c) => sum + c.total_spent, 0))}
              </div>
              <div className="text-xs text-gray-500">CA Total</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {customers.reduce((sum, c) => sum + c.total_orders, 0)}
              </div>
              <div className="text-xs text-gray-500">Commandes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCustomersModule;
