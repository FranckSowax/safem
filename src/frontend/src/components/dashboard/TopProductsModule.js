import { useState, useEffect } from 'react';
import { TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Module Top Produits par Quantité
 * Affiche les produits les plus vendus avec leurs statistiques
 */
const TopProductsModule = ({ period = '30d', limit = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTopProducts();
  }, [period, limit]);

  const loadTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await SalesStatsService.getBestSellingProducts(limit, period);
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des produits');
      }
    } catch (err) {
      console.error('Erreur dans loadTopProducts:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const formatQuantity = (quantity) => {
    return parseFloat(quantity || 0).toFixed(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getProductIcon = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('tomate')) return '🍅';
    if (name.includes('poivron')) return '🫑';
    if (name.includes('piment')) return '🌶️';
    if (name.includes('chou')) return '🥬';
    if (name.includes('aubergine')) return '🍆';
    if (name.includes('banane')) return '🍌';
    if (name.includes('taro')) return '🥔';
    return '🥬';
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏆';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <TrophyIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Produits</h3>
            <p className="text-sm text-gray-500">Par quantité vendue ({period})</p>
          </div>
        </div>
        
        <button
          onClick={loadTopProducts}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <ChartBarIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Contenu */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-2">❌ {error}</p>
            <button
              onClick={loadTopProducts}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={`${product.product_id}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Rang */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getRankColor(index)}`}>
                  <span className="text-lg">{getRankIcon(index)}</span>
                </div>
                
                {/* Produit */}
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getProductIcon(product.product_name)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.product_name}</h4>
                    <p className="text-sm text-gray-500">
                      {product.total_sales} vente{product.total_sales > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">
                  {formatQuantity(product.total_quantity)} kg
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(product.total_revenue)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun produit vendu sur cette période</p>
          </div>
        )}
      </div>

      {/* Footer avec total */}
      {products.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total des {products.length} premiers :</span>
            <div className="flex space-x-4">
              <span className="font-medium">
                {formatQuantity(products.reduce((sum, p) => sum + parseFloat(p.total_quantity || 0), 0))} kg
              </span>
              <span className="font-medium text-green-600">
                {formatCurrency(products.reduce((sum, p) => sum + parseFloat(p.total_revenue || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductsModule;
