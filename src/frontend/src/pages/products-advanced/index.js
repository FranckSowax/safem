import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiPackage, FiTruck, FiCreditCard, FiShoppingCart } from 'react-icons/fi';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import { toast } from 'react-hot-toast';

/**
 * Page de liste des produits
 */
export default function ProductsPage() {
  const router = useRouter();
  const { category, search } = router.query;
  
  // Référence pour le slider
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;
  
  // États pour les filtres et le tri
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [addingToCart, setAddingToCart] = useState(false); // État pour gérer l'ajout au panier
  
  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Catégories par défaut en cas d'erreur
        setCategories([
          { id: '1', name: 'Fruits', slug: 'fruits', count: 0 },
          { id: '2', name: 'Légumes', slug: 'legumes', count: 0 },
          { id: '3', name: 'Produits transformés', slug: 'transformes', count: 0 },
          { id: '4', name: 'Paniers', slug: 'paniers', count: 0 }
        ]);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Préparer les options de filtrage pour l'API
        const options = {
          category: selectedCategory,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          isOrganic: onlyOrganic,
          search: search,
          sort: sortBy
        };
        
        // Récupérer les produits filtrés depuis l'API
        const productsData = await productService.getAllProducts(options);
        setProducts(productsData);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, search, onlyOrganic, priceRange, sortBy]);
  
  // Mettre à jour les filtres et l'URL
  const updateFilters = (filters) => {
    const newFilters = { ...filters };
    
    // Mettre à jour l'URL
    const query = {};
    if (newFilters.category) query.category = newFilters.category;
    if (search) query.search = search;
    
    router.push({
      pathname: '/products',
      query
    }, undefined, { shallow: true });
    
    // Mettre à jour l'état
    if (newFilters.category !== undefined) setSelectedCategory(newFilters.category);
    if (newFilters.onlyOrganic !== undefined) setOnlyOrganic(newFilters.onlyOrganic);
    if (newFilters.priceRange) setPriceRange(newFilters.priceRange);
  };
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedCategory('');
    setOnlyOrganic(false);
    setPriceRange([0, 10000]);
    
    router.push('/products', undefined, { shallow: true });
  };
  
  // Fonction pour changer de slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Fonction pour passer au slide suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Fonction pour passer au slide précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Effet pour faire défiler automatiquement les slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fonction pour ajouter un produit au panier
  const handleAddToCart = async (product) => {
    if (addingToCart) return; // Éviter les clics multiples
    
    setAddingToCart(true);
    try {
      await cartService.addToCart(product, 1);
      toast.success(`${product.name} ajouté au panier`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <MainLayout 
      title="Produits - SAFEM"
      description="Découvrez notre gamme de produits frais du Gabon respectant les normes sanitaires."
    >
      {/* Slider/Carrousel */}
      <div className="relative overflow-hidden" style={{ height: '500px' }}>
        <div 
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide 1 */}
          <div className="w-full flex-shrink-0 relative">
            <div 
              className="absolute inset-0 bg-center bg-cover" 
              style={{ 
                backgroundImage: "url('/images/banner_produit_frais.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-3xl">
                <h2 className="text-4xl font-bold mb-4 text-white">Des produits frais respectant les normes sanitaires</h2>
                <p className="text-xl mb-6">Découvrez la gamme complète des produits SAFEM directement livrés à votre domicile</p>
              </div>
            </div>
          </div>
          
          {/* Slide 2 */}
          <div className="w-full flex-shrink-0 relative">
            <div 
              className="absolute inset-0 bg-center bg-cover" 
              style={{ 
                backgroundImage: "url('/images/banner_produit_plaisir.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-3xl">
                <h2 className="text-4xl font-bold mb-4 text-white">Produits cultivés avec passion</h2>
                <p className="text-xl mb-6">Au cœur du Gabon, nos produits sont cultivés avec soin pour vous offrir la meilleure qualité</p>
              </div>
            </div>
          </div>
          
          {/* Slide 3 */}
          <div className="w-full flex-shrink-0 relative">
            <div 
              className="absolute inset-0 bg-center bg-cover" 
              style={{ 
                backgroundImage: "url('/images/banner_produit_livraison.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-3xl">
                <h2 className="text-4xl font-bold mb-4 text-white">Livraison directe à domicile</h2>
                <p className="text-xl mb-6">Du producteur au consommateur, sans intermédiaire pour une fraîcheur garantie</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles du slider */}
        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          aria-label="Slide précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          aria-label="Slide suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicateurs */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-primary/10 py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-heading font-bold text-center mb-2">Nos Produits</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme de produits frais, cultivés au Gabon dans le respect des normes sanitaires et environnementales.
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtrage - version desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 text-[#2E7D32] border-b border-gray-100 pb-2">Filtres</h2>
              
              {/* Catégories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Catégories</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => updateFilters({ category: '' })}
                      className={`text-left w-full transition-colors ${!selectedCategory ? 'font-medium text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'}`}
                    >
                      Toutes les catégories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button 
                        onClick={() => updateFilters({ category: category.slug })}
                        className={`text-left w-full transition-colors ${selectedCategory === category.slug ? 'font-medium text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'}`}
                      >
                        {category.name} <span className="text-gray-400 text-sm">({category.count || 0})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Filtres supplémentaires */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Prix</h3>
                <div className="flex items-center justify-between mb-2 text-gray-700">
                  <span>{priceRange[0]} XAF</span>
                  <span>{priceRange[1]} XAF</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#2E7D32]"
                />
              </div>
              

              
              {/* Bouton de réinitialisation */}
              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 border border-[#2E7D32] rounded-md text-[#2E7D32] hover:bg-[#f0f7f0] transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-grow">
            {/* Barre d'outils de filtrage */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              {/* Bouton de filtre pour mobile */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden flex items-center bg-white rounded-md shadow-sm px-4 py-3 border border-gray-200 hover:border-[#2E7D32] transition-colors"
              >
                <FiFilter className="mr-2 text-[#2E7D32]" />
                <span className="text-gray-700">Filtres</span>
              </button>
              
              {/* Affichage du nombre de résultats */}
              <div className="text-gray-700 font-medium">
                {loading ? 'Chargement...' : `${products.length} produit${products.length > 1 ? 's' : ''}`}
              </div>
              
              {/* Sélecteur de tri */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 hover:border-[#2E7D32] rounded-md pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  >
                    <option value="popularity">Popularité</option>
                    <option value="price-asc">Prix: croissant</option>
                    <option value="price-desc">Prix: décroissant</option>
                    <option value="name">Nom</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3.5 text-[#2E7D32] pointer-events-none" />
                </div>
                
                {/* Sélecteur de vue */}
                <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-[#f0f7f0]'}`}
                    aria-label="Affichage en grille"
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-[#f0f7f0]'}`}
                    aria-label="Affichage en liste"
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal de filtres pour mobile */}
            {filterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="font-heading font-semibold text-lg text-[#2E7D32]">Filtres</h2>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-2 text-gray-600 hover:text-[#2E7D32] transition-colors"
                    aria-label="Fermer"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-5 space-y-6">
                  {/* Catégories */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">Catégories</h3>
                    <ul className="space-y-3">
                      <li>
                        <button 
                          onClick={() => {
                            updateFilters({ category: '' });
                            setFilterOpen(false);
                          }}
                          className={`text-left w-full transition-colors ${!selectedCategory ? 'font-medium text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'}`}
                        >
                          Toutes les catégories
                        </button>
                      </li>
                      {categories.map(category => (
                        <li key={category.id}>
                          <button 
                            onClick={() => {
                              updateFilters({ category: category.slug });
                              setFilterOpen(false);
                            }}
                            className={`text-left w-full transition-colors ${selectedCategory === category.slug ? 'font-medium text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'}`}
                          >
                            {category.name} <span className="text-gray-400 text-sm">({category.count || 0})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Prix */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">Prix</h3>
                    <div className="flex items-center justify-between mb-2 text-gray-700">
                      <span>{priceRange[0]} XAF</span>
                      <span>{priceRange[1]} XAF</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#2E7D32]"
                    />
                  </div>
                  

                </div>
                
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 px-4 border border-[#2E7D32] text-[#2E7D32] bg-white rounded-md hover:bg-[#f0f7f0] transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 py-2 px-4 bg-[#2E7D32] hover:bg-green-800 text-white rounded-md transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
            
            {/* Affichage des produits */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#f0f7f0] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-3 text-gray-800">Aucun produit trouvé</h3>
                <p className="text-gray-700 mb-5">
                  Aucun produit ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#2E7D32] hover:bg-green-800 text-white font-bold py-2.5 px-5 rounded-md transition duration-300"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {products.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow">
                      <div className="w-1/3 p-4 flex items-center justify-center bg-gray-50">
                        <img 
                          src={product.images?.[0]?.publicUrl || '/images/vegetables.jpg'} 
                          alt={product.name}
                          className="max-h-48 object-contain"
                        />
                      </div>
                      <div className="w-2/3 p-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                        <div className="text-[#2E7D32] font-bold text-lg mb-3">{(product.price / 100).toLocaleString()} XAF</div>
                        <div className="mt-auto flex justify-end items-center">
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart}
                            className="bg-[#2E7D32] hover:bg-green-800 text-white py-2 px-4 rounded-md text-sm transition duration-300 flex items-center justify-center gap-2"
                          >
                            <FiShoppingCart className="h-4 w-4" />
                            {addingToCart ? 'Ajout...' : 'Ajouter au panier'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
            
            {/* Section Comment Commander */}
            <div className="mt-20 bg-[#f0f7f0] py-16">
              <div className="container-custom">
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-1 bg-white text-[#2E7D32] rounded-full text-sm font-medium mb-4">COMMANDES SIMPLIFIÉES</span>
                  <h2 className="text-3xl font-heading font-bold mb-4 text-[#2E7D32]">Comment Commander</h2>
                  <p className="text-gray-700 max-w-2xl mx-auto">Nous vous proposons plusieurs façons simples et pratiques de commander nos produits frais. Choisissez celle qui vous convient le mieux.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Option 1 */}
                  <div className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
                    <div className="bg-[#f0f7f0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiPackage className="text-[#2E7D32] text-2xl" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-gray-800">Commande en ligne</h3>
                    <p className="text-gray-700 mb-5">Passez votre commande directement sur notre site et recevez vos produits frais livrés chez vous.</p>
                    <ol className="text-left text-gray-700 mb-8 space-y-3">
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">1</span>
                        <span>Ajoutez vos produits au panier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">2</span>
                        <span>Validez votre commande</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">3</span>
                        <span>Recevez votre livraison</span>
                      </li>
                    </ol>
                    <button className="bg-[#2E7D32] hover:bg-green-800 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                      Commander maintenant
                    </button>
                  </div>
                  
                  {/* Option 2 */}
                  <div className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
                    <div className="bg-[#f0f7f0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiTruck className="text-[#2E7D32] text-2xl" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-gray-800">Abonnement hebdomadaire</h3>
                    <p className="text-gray-700 mb-5">Recevez automatiquement chaque semaine votre panier de produits frais sélectionnés.</p>
                    <ol className="text-left text-gray-700 mb-8 space-y-3">
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">1</span>
                        <span>Choisissez votre formule d'abonnement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">2</span>
                        <span>Personnalisez votre panier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">3</span>
                        <span>Recevez votre panier chaque semaine</span>
                      </li>
                    </ol>
                    <button className="bg-[#2E7D32] hover:bg-green-800 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                      S'abonner
                    </button>
                  </div>
                  
                  {/* Option 3 */}
                  <div className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
                    <div className="bg-[#f0f7f0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="text-[#2E7D32] w-8 h-8">
                        <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-gray-800">Commande par WhatsApp</h3>
                    <p className="text-gray-700 mb-5">Utilisez notre chatbot WhatsApp pour commander facilement et rapidement nos produits frais.</p>
                    <ol className="text-left text-gray-700 mb-8 space-y-3">
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">1</span>
                        <span>Consultez les produits disponibles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">2</span>
                        <span>Validation du total et de la localisation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#2E7D32] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-medium">3</span>
                        <span>Livraison le jour même après confirmation</span>
                      </li>
                    </ol>
                    <a href="https://wa.me/24174123456" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-md transition duration-300 inline-block">
                      Commander sur WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
