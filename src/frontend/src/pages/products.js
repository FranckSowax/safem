import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../layouts/MainLayout';
import { FiShoppingCart, FiPlus, FiMinus, FiFilter, FiX, FiCheck } from 'react-icons/fi';

// Données des produits basées sur la page caisse
const PRODUCTS_DATA = {
  quickAccess: [
    { id: 'demon', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Accès Rapide', stock: 50 },
    { id: 'padma', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Accès Rapide', stock: 30 },
    { id: 'plantain', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Accès Rapide', stock: 25 }
  ],
  piments: [
    { id: 'demon2', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 50 },
    { id: 'shamsi', name: 'Shamsi', price: 2500, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 30 },
    { id: 'avenir', name: 'Avenir', price: 1800, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 40 },
    { id: 'theking', name: 'The King', price: 3000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 20 }
  ],
  poivrons: [
    { id: 'yolo', name: 'Yolo Wander', price: 2000, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 35 },
    { id: 'deconti', name: 'De Conti', price: 2500, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 28 },
    { id: 'nobili', name: 'Nobili', price: 2200, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 32 }
  ],
  tomates: [
    { id: 'padma2', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 45 },
    { id: 'anita', name: 'Anita', price: 1200, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 38 }
  ],
  aubergines: [
    { id: 'africaine', name: 'Africaine', price: 1800, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 25 },
    { id: 'bonita', name: 'Bonita', price: 1600, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 30 },
    { id: 'pingtung', name: 'Ping Tung', price: 2000, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 22 }
  ],
  bananes: [
    { id: 'plantain2', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 40 },
    { id: 'douce', name: 'Banane Douce', price: 1200, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 35 }
  ],
  taros: [
    { id: 'blanc', name: 'Taro Blanc', price: 1000, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 28 },
    { id: 'rouge', name: 'Taro Rouge', price: 1500, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 25 }
  ],
  autres: [
    { id: 'chou', name: 'Chou Averty', price: 1000, unit: 'FCFA/kg', icon: '🥬', category: 'Autres', stock: 20 },
    { id: 'gombo', name: 'Gombo Kirikou', price: 2000, unit: 'FCFA/kg', icon: '🌿', category: 'Autres', stock: 15 },
    { id: 'concombre', name: 'Concombre Mureino', price: 1000, unit: 'FCFA/kg', icon: '🥒', category: 'Autres', stock: 30 },
    { id: 'ciboulette', name: 'Ciboulette', price: 500, unit: 'FCFA/botte', icon: '🌿', category: 'Autres', stock: 25 }
  ]
};

// Fonction pour obtenir tous les produits dans un tableau plat
const getAllProducts = () => {
  return Object.values(PRODUCTS_DATA).flat();
};

// Fonction pour obtenir les catégories uniques
const getCategories = () => {
  const products = getAllProducts();
  return [...new Set(products.map(product => product.category))];
};

// Fonction pour formater le prix
const formatPrice = (price) => {
  if (price === undefined || price === null) return "0 FCFA";
  return typeof price === 'number' ? price.toLocaleString('fr-FR') + ' FCFA' : price;
};

/**
 * Page des produits SAFEM
 * Affiche tous les produits avec filtres par catégorie et prix
 */
const ProductsPage = () => {
  // États principaux
  const [products] = useState(getAllProducts());
  const [filteredProducts, setFilteredProducts] = useState(getAllProducts());
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('safem_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('safem_cart');
      }
    }
  }, []);
  
  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('safem_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('safem_cart');
    }
  }, [cart]);
  
  // États des filtres
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showFilters, setShowFilters] = useState(false);
  
  // Obtenir les prix min et max
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));
  
  // Filtrer les produits
  useEffect(() => {
    let filtered = products;
    
    // Filtre par catégorie
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filtre par prix
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    setFilteredProducts(filtered);
  }, [selectedCategories, priceRange, products]);
  
  // Gérer la sélection des catégories
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Ajouter au panier (paliers de 0,5 kg)
  const addToCart = (product) => {
    const stepQuantity = 0.5;
    const maxQuantity = product.stock;
    
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + stepQuantity;
        if (newQuantity <= maxQuantity) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        return prev; // Ne pas ajouter si dépasse le stock
      } else {
        return [...prev, { ...product, quantity: stepQuantity }];
      }
    });
  };
  
  // Retirer du panier (paliers de 0,5 kg)
  const removeFromCart = (productId) => {
    const stepQuantity = 0.5;
    
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > stepQuantity) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - stepQuantity }
            : item
        );
      } else {
        return prev.filter(item => item.id !== productId);
      }
    });
  };
  
  // Obtenir la quantité d'un produit dans le panier
  const getCartQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <MainLayout title="Produits - SAFEM" description="Découvrez notre gamme complète de produits bio SAFEM">
      <Head>
        <title>Produits - SAFEM</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🥬 Nos Produits SAFEM
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de produits bio frais, cultivés avec passion et respect de l'environnement.
          </p>
        </div>

        {/* Filtre par catégorie mobile - toujours visible */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FiFilter className="mr-2" />
              Catégories
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.length === 0
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              {getCategories().map(category => (
                <button
                  key={category}
                  onClick={() => {
                    if (selectedCategories.includes(category)) {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    } else {
                      setSelectedCategories([...selectedCategories, category]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barre latérale des filtres - desktop uniquement */}
          <div className="hidden lg:block lg:w-1/4">
            {/* Filtres desktop */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiFilter className="mr-2" />
                Filtres
              </h3>

              {/* Filtre par catégorie */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {getCategories().map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="mt-2 text-sm text-green-600 hover:text-green-700"
                  >
                    Effacer tout
                  </button>
                )}
              </div>

              {/* Filtre par prix */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Prix (FCFA)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Prix minimum</label>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <span className="text-sm text-gray-500">{formatPrice(priceRange.min)}</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Prix maximum</label>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <span className="text-sm text-gray-500">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPriceRange({ min: minPrice, max: maxPrice })}
                  className="mt-2 text-sm text-green-600 hover:text-green-700"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Résumé des filtres */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:w-3/4">
            {/* En-tête avec bouton panier */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </h2>
              </div>
              
              {/* Bouton panier */}
              <Link href="/cart">
                <button className="relative inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FiShoppingCart className="mr-2" />
                  Panier
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            {/* Panier flottant (affiché seulement s'il y a des articles) */}
            {cart.length > 0 && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-800 flex items-center">
                    <FiShoppingCart className="mr-2" />
                    Panier ({cart.length} article{cart.length > 1 ? 's' : ''})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Vider
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-700">
                    {cart.map(item => (
                      <span key={item.id} className="mr-3">
                        {item.icon} {item.name} x{item.quantity} kg
                      </span>
                    ))}
                  </div>
                  <div className="font-semibold text-green-800">
                    Total: {formatPrice(getCartTotal())}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <Link href="/checkout">
                    <button
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Passer commande
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Grille des produits */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des produits...</p>
              </div>
            ) : (
              <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-0">
                {filteredProducts.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink">
                      {/* En-tête du produit */}
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{product.icon}</div>
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>

                      {/* Prix et stock */}
                      <div className="text-center mb-4">
                        <div className="text-xl font-bold text-green-600 mb-1">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock} kg
                        </div>
                      </div>

                      {/* Indicateur paliers 0,5 kg */}
                      <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700 text-center">
                        Sélection par paliers de 0,5 kg
                      </div>

                      {/* Contrôles d'ajout au panier */}
                      <div className="flex items-center justify-center space-x-3">
                        {cartQuantity > 0 && (
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                            title="Retirer 0,5 kg"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                        )}
                        
                        {cartQuantity > 0 && (
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className="font-semibold text-lg">{cartQuantity}</span>
                            <span className="text-xs text-gray-500">kg</span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => addToCart(product)}
                          disabled={cartQuantity >= product.stock}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Ajouter 0,5 kg"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prix total pour ce produit */}
                      {cartQuantity > 0 && (
                        <div className="text-center mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm font-semibold text-green-600">
                            Sous-total: {formatPrice(product.price * cartQuantity)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Message si aucun produit trouvé */}
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos filtres pour voir plus de produits.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange({ min: minPrice, max: maxPrice });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles pour les sliders */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 2px rgba(0,0,0,.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 2px rgba(0,0,0,.2);
        }
      `}</style>
    </MainLayout>
  );
};

export default ProductsPage;
