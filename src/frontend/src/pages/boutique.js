import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiStar, 
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMapPin,
  FiUsers,
  FiZap,
  FiCheck,
  FiChevronDown,
  FiLoader
} from 'react-icons/fi';

// Fonction pour formater le prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const Boutique = () => {
  const router = useRouter();
  const [produits, setProduits] = useState([]);
  const [typesAgriculture, setTypesAgriculture] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [typeAgricultureActif, setTypeAgricultureActif] = useState("Tous");
  const [categorieActive, setCategorieActive] = useState("Toutes");
  const [recherche, setRecherche] = useState("");
  const [affichage, setAffichage] = useState("grid");
  const [tri, setTri] = useState("nom");
  const [panier, setPanier] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({
    prixMin: 0,
    prixMax: 20000000
  });

  // Charger les données depuis Supabase
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        setLoading(true);
        
        // Charger les types d'agriculture
        const { data: typesData, error: typesError } = await supabase
          .from('types_agriculture')
          .select('*')
          .eq('actif', true)
          .order('ordre');
        
        if (typesError) throw typesError;
        setTypesAgriculture([{ id: 'tous', nom: 'Tous', icone: '🌱' }, ...typesData]);
        

        
        // Charger toutes les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories_produits')
          .select(`
            *,
            types_agriculture(nom, icone)
          `)
          .eq('actif', true)
          .order('ordre');
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Charger les produits avec leurs relations
        const { data: produitsData, error: produitsError } = await supabase
          .from('produits')
          .select(`
            *,
            categories_produits(nom, types_agriculture(nom, icone))
          `)
          .eq('actif', true)
          .order('created_at', { ascending: false });
        
        if (produitsError) throw produitsError;
        setProduits(produitsData || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    chargerDonnees();
  }, []);

  // Réinitialiser la catégorie quand le type d'agriculture change
  useEffect(() => {
    setCategorieActive("Toutes");
  }, [typeAgricultureActif]);

  // Filtrer les catégories selon le type d'agriculture sélectionné
  const categoriesFiltrees = useMemo(() => {
    if (typeAgricultureActif === "Tous") {
      return [{ id: 'toutes', nom: 'Toutes' }, ...categories];
    }
    const categoriesType = categories.filter(cat => 
      cat.types_agriculture?.nom === typeAgricultureActif
    );
    return [{ id: 'toutes', nom: 'Toutes' }, ...categoriesType];
  }, [categories, typeAgricultureActif]);

  // Filtrer les produits (mémorisé pour éviter les recalculs)
  const produitsFiltres = useMemo(() => {
    return produits.filter(produit => {
      const matchTypeAgriculture = typeAgricultureActif === "Tous" || 
        (produit.categories_produits?.types_agriculture?.nom === typeAgricultureActif);
      const matchCategorie = categorieActive === "Toutes" ||
        (produit.categories_produits?.nom === categorieActive);
      const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                            produit.description.toLowerCase().includes(recherche.toLowerCase());
      const matchPrix = produit.prix >= filtres.prixMin && produit.prix <= filtres.prixMax;
      
      return matchTypeAgriculture && matchCategorie && matchRecherche && matchPrix;
    });
  }, [produits, typeAgricultureActif, categorieActive, recherche, filtres]);

  // Trier les produits (mémorisé pour éviter les recalculs)
  const produitsTriés = useMemo(() => {
    return [...produitsFiltres].sort((a, b) => {
      switch(tri) {
        case "prix":
          return a.prix - b.prix;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.nom.localeCompare(b.nom);
      }
    });
  }, [produitsFiltres, tri]);

  // Ajouter au panier (mémorisé pour éviter les recréations)
  const ajouterAuPanier = useCallback((produit) => {
    setPanier(prevPanier => [...prevPanier, produit]);
    // Ici vous pourriez ajouter une notification toast
  }, []);

  // Basculer les favoris (mémorisé pour éviter les recréations)
  const basculerFavori = useCallback((produitId) => {
    setFavoris(prevFavoris => {
      if (prevFavoris.includes(produitId)) {
        return prevFavoris.filter(id => id !== produitId);
      } else {
        return [...prevFavoris, produitId];
      }
    });
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>Boutique Pro - SAFEM</title>
        <meta name="description" content="Boutique professionnelle SAFEM - Matériel agricole de qualité pour votre exploitation" />
        <meta name="keywords" content="boutique pro, matériel agricole, tracteur, motoculteur, SAFEM" />
      </Head>

      {/* Header avec notification */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex items-center">
          <FiCheck className="text-green-400 mr-3" />
          <p className="text-green-700 font-medium">Soyez notifié pour les meilleurs prix</p>
        </div>
      </div>

      {/* Layout principal avec sidebar et contenu */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Sidebar des filtres */}
        <div className="lg:w-1/4 space-y-6">
          {/* Filtre Type d'agriculture */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Type d'agriculture</h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <FiLoader className="animate-spin text-green-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {typesAgriculture.map((type) => (
                  <label key={type.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="typeAgriculture"
                      checked={typeAgricultureActif === type.nom}
                      onChange={() => setTypeAgricultureActif(type.nom)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                    <span className="ml-2 text-gray-700 flex items-center">
                      <span className="mr-2">{type.icone}</span>
                      {type.nom}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>



          {/* Filtre Catégories de matériel */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Catégories de matériel</h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <FiLoader className="animate-spin text-green-600" />
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {categoriesFiltrees.map((categorie) => (
                  <label key={categorie.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="categorie"
                      checked={categorieActive === categorie.nom}
                      onChange={() => {
                        setCategorieActive(categorie.nom);
                      }}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                    <span className="ml-2 text-gray-700">{categorie.nom}</span>
                  </label>
                ))}
              </div>
            )}
            {categoriesFiltrees.length > 8 && (
              <div className="text-sm text-gray-500 mt-2">
                {categoriesFiltrees.length - 1} catégories disponibles
              </div>
            )}
          </div>

          {/* Filtre Prix */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Gamme de prix</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded relative">
                  <div className="absolute left-0 top-0 h-2 bg-green-600 rounded" style={{width: '30%'}}></div>
                  <div className="absolute right-0 top-0 h-2 bg-green-600 rounded" style={{width: '20%'}}></div>
                </div>
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(filtres.prixMin)}</span>
                <span>{formatPrice(filtres.prixMax)}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20000000"
                  step="100000"
                  value={filtres.prixMin}
                  onChange={(e) => setFiltres(prev => ({ ...prev, prixMin: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="20000000"
                  step="100000"
                  value={filtres.prixMax}
                  onChange={(e) => setFiltres(prev => ({ ...prev, prixMax: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>


        </div>

        {/* Contenu principal */}
        <div className="lg:w-3/4">
          {/* En-tête avec compteur et tri */}
          <div className="bg-white rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                {loading ? (
                  <span className="flex items-center">
                    <FiLoader className="animate-spin mr-2" />
                    Chargement des produits...
                  </span>
                ) : (
                  <span>
                    {produitsTriés.length} produit{produitsTriés.length > 1 ? 's' : ''} trouvé{produitsTriés.length > 1 ? 's' : ''}
                    {typeAgricultureActif !== "Tous" && (
                      <span className="ml-2 text-green-600 font-medium">en {typeAgricultureActif}</span>
                    )}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={tri}
                onChange={(e) => setTri(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="nom">Trier par nom</option>
                <option value="prix">Trier par prix</option>
                <option value="rating">Trier par note</option>
              </select>
            </div>
          </div>

          {/* Cartes produits */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-green-600 text-2xl" />
              <span className="ml-3 text-gray-600">Chargement des produits...</span>
            </div>
          ) : produitsTriés.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Aucun produit trouvé pour les critères sélectionnés.</p>
              <button 
                onClick={() => {
                  setTypeAgricultureActif("Tous");
                  setCategorieActive("Toutes");
                  setRecherche("");
                  setFiltres({
                    prixMin: 0,
                    prixMax: 20000000
                  });
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {produitsTriés.map((produit) => (
                <div key={produit.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="relative">
                      <img 
                        src={produit.image_url || '/api/placeholder/300/200'} 
                        alt={produit.nom} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                        {produit.stock} en stock
                      </div>
                      {produit.promo && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                          PROMO
                        </div>
                      )}
                      {produit.nouveau && (
                        <div className="absolute top-12 right-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                          NOUVEAU
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{produit.nom}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {produit.marque_nom || 'Marque inconnue'}
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-700 font-medium">{produit.rating}</span>
                          <span className="ml-1 text-gray-500 text-sm">({produit.reviews_count} avis)</span>
                        </div>
                        <span className="ml-4 text-sm text-green-600 font-medium">
                          {produit.categories_produits?.types_agriculture?.nom}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {produit.distance_km && (
                          <div className="flex items-center text-gray-600">
                            <FiMapPin className="mr-2" />
                            <span className="text-sm">{produit.distance_km} km (de vous)</span>
                          </div>
                        )}
                        {produit.puissance && (
                          <div className="flex items-center text-gray-600">
                            <FiZap className="mr-2" />
                            <span className="text-sm">{produit.puissance} Puissance</span>
                          </div>
                        )}
                        {produit.installations && (
                          <div className="flex items-center text-gray-600">
                            <FiUsers className="mr-2" />
                            <span className="text-sm">{produit.installations} installations</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{produit.description}</p>
                      {produit.tags && produit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {produit.tags.map((tag, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{formatPrice(produit.prix)}</div>
                        <div className="text-sm text-gray-500">(PRIX NET)</div>
                        {produit.economie && (
                          <div className="text-green-600 font-medium">{formatPrice(produit.economie)} d'économies</div>
                        )}
                      </div>
                      <div className="text-right">
                        {produit.prix_original && (
                          <div className="text-gray-500 text-sm line-through">{formatPrice(produit.prix_original)}</div>
                        )}
                        <div className="text-gray-400 text-xs">(PAIEMENT MENSUEL DISPONIBLE)</div>
                        <button 
                          onClick={() => router.push(`/produit/${produit.id}`)}
                          className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section d'économies */}
          <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Demander un Devis pour votre exploitation</h2>
              <p className="text-xl mb-4">Commencez dès maintenant !</p>
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Découvrir les offres
              </button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img 
                src="/api/placeholder/400/200" 
                alt="Matériel agricole" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Boutique;
