import { useState, useEffect } from 'react';
import { ChartPieIcon, TagIcon } from '@heroicons/react/24/outline';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Module Répartition par Catégorie
 * Affiche les ventes réparties par catégorie de produits
 */
const CategoryStatsModule = ({ period = '30d' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadCategoryStats();
  }, [period]);

  const loadCategoryStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await SalesStatsService.getSalesByCategory(period);
      
      if (result.success) {
        setCategories(result.data);
        const total = result.data.reduce((sum, cat) => sum + parseFloat(cat.total_revenue || 0), 0);
        setTotalRevenue(total);
      } else {
        setError(result.error || 'Erreur lors du chargement des catégories');
      }
    } catch (err) {
      console.error('Erreur dans loadCategoryStats:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatQuantity = (quantity) => {
    return parseFloat(quantity || 0).toFixed(1);
  };

  const getPercentage = (revenue) => {
    if (totalRevenue === 0) return 0;
    return ((parseFloat(revenue) / totalRevenue) * 100).toFixed(1);
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('légumes fruits')) return '🍅';
    if (name.includes('légumes feuilles')) return '🥬';
    if (name.includes('épices')) return '🌶️';
    if (name.includes('tubercules')) return '🥔';
    if (name.includes('fruits')) return '🍌';
    return '🥬';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ChartPieIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Répartition par Catégorie</h3>
            <p className="text-sm text-gray-500">Ventes par type de produit ({period})</p>
          </div>
        </div>
        
        <button
          onClick={loadCategoryStats}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <TagIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Contenu */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-2">❌ {error}</p>
            <button
              onClick={loadCategoryStats}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* Graphique en barres simple */}
            <div className="space-y-3">
              {categories.map((category, index) => {
                const percentage = getPercentage(category.total_revenue);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(category.category_name)}</span>
                        <span className="font-medium text-gray-900 text-sm">
                          {category.category_name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(category.total_revenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.category_color || '#3B82F6'
                        }}
                      ></div>
                    </div>
                    
                    {/* Détails */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatQuantity(category.total_quantity)} kg vendus</span>
                      <span>{category.total_sales} vente{category.total_sales > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Résumé total */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {categories.length}
                  </div>
                  <div className="text-xs text-gray-500">Catégories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatQuantity(categories.reduce((sum, cat) => sum + parseFloat(cat.total_quantity || 0), 0))}
                  </div>
                  <div className="text-xs text-gray-500">kg Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <div className="text-xs text-gray-500">Revenus</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <ChartPieIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune vente par catégorie sur cette période</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryStatsModule;
