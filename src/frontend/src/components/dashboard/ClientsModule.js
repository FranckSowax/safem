import { useState, useEffect } from 'react';
import { 
  FiUsers, FiUserPlus, FiSearch, FiFilter, FiTrendingUp, 
  FiShoppingBag, FiCalendar, FiPhone, FiMail, FiMapPin,
  FiEdit2, FiTrash2, FiX, FiCheck, FiRefreshCw, FiDollarSign,
  FiPackage, FiClock, FiStar, FiBarChart2
} from 'react-icons/fi';
import ClientsService from '../../services/clientsService';

const ClientsModule = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalStats, setGlobalStats] = useState({ total: 0, particuliers: 0, professionnels: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: '', phone: '', email: '', address: '', client_type: 'particulier', notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadClients();
    loadGlobalStats();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [clients, searchTerm, filterType, sortBy]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClientsService.getAllClients();
      if (result.success) setClients(result.data);
      else setError(result.error);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalStats = async () => {
    const result = await ClientsService.getGlobalStats();
    if (result.success) setGlobalStats(result.data);
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...clients];
    if (filterType !== 'all') filtered = filtered.filter(c => c.client_type === filterType);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term))
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'purchases': return (b.stats?.totalSales || 0) - (a.stats?.totalSales || 0);
        default: return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setFilteredClients(filtered);
  };

  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    setLoadingDetails(true);
    const result = await ClientsService.getClientById(client.id);
    if (result.success) setClientDetails(result.data);
    setLoadingDetails(false);
  };

  const openForm = (client = null) => {
    setFormData(client ? {
      id: client.id, name: client.name, phone: client.phone || '', email: client.email || '',
      address: client.address || '', client_type: client.client_type, notes: client.notes || ''
    } : {
      id: null, name: '', phone: '', email: '', address: '', client_type: 'particulier', notes: ''
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Le nom est requis';
    if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const result = await ClientsService.upsertClient(formData);
    if (result.success) {
      setShowForm(false);
      loadClients();
      loadGlobalStats();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Supprimer ce client ?')) return;
    setLoading(true);
    const result = await ClientsService.deleteClient(clientId);
    if (result.success) {
      setSelectedClient(null);
      setClientDetails(null);
      loadClients();
      loadGlobalStats();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSyncClients = async () => {
    setLoading(true);
    const result = await ClientsService.syncClientsFromSales();
    if (result.success) {
      alert(`${result.synced} ventes synchronisées`);
      loadClients();
      loadGlobalStats();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'XAF', minimumFractionDigits: 0
  }).format(price || 0);

  const formatDate = (date) => !date ? 'N/A' : new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiUsers className="mr-3 text-green-600" />
            Gestion des Clients
          </h2>
          <p className="text-gray-600 mt-1">Suivi et historique complet</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleSyncClients} disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Synchroniser
          </button>
          <button onClick={() => openForm()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FiUserPlus className="mr-2" />
            Nouveau Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total', value: globalStats.total, color: 'blue' },
          { label: 'Particuliers', value: globalStats.particuliers, color: 'green' },
          { label: 'Professionnels', value: globalStats.professionnels, color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                <FiUsers className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="all">Tous</option>
              <option value="particulier">Particuliers</option>
              <option value="pro">Professionnels</option>
            </select>
          </div>
          <div className="relative">
            <FiBarChart2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="recent">Plus récents</option>
              <option value="name">Par nom</option>
              <option value="purchases">Par achats</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <FiX className="text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Clients ({filteredClients.length})</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center p-8 text-gray-500">Aucun client</div>
            ) : (
              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div key={client.id} onClick={() => handleSelectClient(client)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedClient?.id === client.id ? 'bg-green-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{client.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            client.client_type === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {client.client_type === 'pro' ? 'Pro' : 'Particulier'}
                          </span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-600 mt-2">
                            <FiPhone className="mr-2" size={14} />
                            {client.phone}
                          </div>
                        )}
                        {client.stats && (
                          <div className="mt-3 flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FiShoppingBag className="mr-1 text-green-600" size={14} />
                              {client.stats.totalSales} ventes
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiDollarSign className="mr-1 text-green-600" size={14} />
                              {formatPrice(client.stats.totalAmount)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); openForm(client); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {!selectedClient ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <FiUsers className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500">Sélectionnez un client</p>
            </div>
          ) : loadingDetails ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : clientDetails ? (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold">Détails</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{clientDetails.name}</h4>
                  <div className="space-y-2 text-sm">
                    {clientDetails.phone && (
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-2" size={14} />
                        {clientDetails.phone}
                      </div>
                    )}
                    {clientDetails.email && (
                      <div className="flex items-center text-gray-600">
                        <FiMail className="mr-2" size={14} />
                        {clientDetails.email}
                      </div>
                    )}
                  </div>
                </div>
                {clientDetails.stats && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Statistiques</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Ventes</span>
                        <span className="font-semibold">{clientDetails.stats.totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Montant</span>
                        <span className="font-semibold text-green-600">{formatPrice(clientDetails.stats.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Panier Moyen</span>
                        <span className="font-semibold">{formatPrice(clientDetails.stats.averageAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}
                {clientDetails.favoriteProducts?.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <FiStar className="mr-2 text-yellow-500" />
                      Produits Préférés
                    </h4>
                    <div className="space-y-2">
                      {clientDetails.favoriteProducts.slice(0, 5).map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{p.name}</span>
                          <span className="text-gray-500">{p.totalQuantity.toFixed(1)} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">{formData.id ? 'Modifier' : 'Nouveau'} Client</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone *</label>
                  <input type="tel" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select value={formData.client_type}
                    onChange={(e) => setFormData({...formData, client_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="particulier">Particulier</option>
                    <option value="pro">Professionnel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <textarea value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  <FiCheck className="inline mr-2" />
                  {formData.id ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
