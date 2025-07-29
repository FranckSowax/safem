import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
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
  FiChevronDown
} from 'react-icons/fi';

// Données des produits de matériel agricole
const produitsAgricoles = [
  {
    id: 1,
    nom: "Tracteur Compact 25HP",
    prix: 15500000,
    prixOriginal: 17000000,
    image: "/images/tracteur-compact.jpg",
    categorie: "Tracteurs",
    description: "Tracteur compact idéal pour les petites et moyennes exploitations. Moteur diesel 25HP, transmission hydrostatique.",
    stock: 5,
    rating: 4.8,
    reviews: 24,
    promo: true,
    nouveau: false,
    tags: ["Diesel", "Compact", "25HP"]
  },
  {
    id: 2,
    nom: "Motoculteur Professionnel",
    prix: 850000,
    prixOriginal: null,
    image: "/images/motoculteur.jpg",
    categorie: "Motoculteurs",
    description: "Motoculteur robuste avec fraise arrière, parfait pour le travail du sol. Moteur 4 temps 7HP.",
    stock: 12,
    rating: 4.6,
    reviews: 18,
    promo: false,
    nouveau: true,
    tags: ["7HP", "4 temps", "Fraise"]
  },
  {
    id: 3,
    nom: "Pulvérisateur à Dos 20L",
    prix: 45000,
    prixOriginal: 55000,
    image: "/images/pulverisateur.jpg",
    categorie: "Pulvérisateurs",
    description: "Pulvérisateur à dos professionnel 20L avec pompe à pression, idéal pour les traitements phytosanitaires.",
    stock: 25,
    rating: 4.4,
    reviews: 32,
    promo: true,
    nouveau: false,
    tags: ["20L", "Pression", "Professionnel"]
  },
  {
    id: 4,
    nom: "Semeuse de Précision",
    prix: 1200000,
    prixOriginal: null,
    image: "/images/semeuse.jpg",
    categorie: "Semoirs",
    description: "Semeuse de précision pour cultures maraîchères. Réglage facile de l'espacement et de la profondeur.",
    stock: 8,
    rating: 4.7,
    reviews: 15,
    promo: false,
    nouveau: true,
    tags: ["Précision", "Maraîchage", "Réglable"]
  },
  {
    id: 5,
    nom: "Pompe d'Irrigation Solaire",
    prix: 2500000,
    prixOriginal: 2800000,
    image: "/images/pompe-solaire.jpg",
    categorie: "Irrigation",
    description: "Système de pompage solaire complet pour irrigation. Panneau 400W, pompe submersible 1HP.",
    stock: 3,
    rating: 4.9,
    reviews: 12,
    promo: true,
    nouveau: false,
    tags: ["Solaire", "400W", "1HP"]
  },
  {
    id: 6,
    nom: "Broyeur de Végétaux",
    prix: 650000,
    prixOriginal: null,
    image: "/images/broyeur.jpg",
    categorie: "Broyeurs",
    description: "Broyeur de végétaux électrique pour compostage. Moteur 2200W, capacité de coupe 40mm.",
    stock: 7,
    rating: 4.3,
    reviews: 21,
    promo: false,
    nouveau: false,
    tags: ["2200W", "40mm", "Électrique"]
  },
  {
    id: 7,
    nom: "Serre Tunnel 6x3m",
    prix: 180000,
    prixOriginal: 220000,
    image: "/images/serre-tunnel.jpg",
    categorie: "Serres",
    description: "Serre tunnel professionnelle 6x3m. Structure galvanisée, bâche renforcée 200 microns.",
    stock: 15,
    rating: 4.5,
    reviews: 28,
    promo: true,
    nouveau: false,
    tags: ["6x3m", "Galvanisé", "200µ"]
  },
  {
    id: 8,
    nom: "Tondeuse Autoportée",
    prix: 3200000,
    prixOriginal: null,
    image: "/images/tondeuse-autoportee.jpg",
    categorie: "Tondeuses",
    description: "Tondeuse autoportée professionnelle. Moteur 18HP, largeur de coupe 107cm, bac de ramassage 300L.",
    stock: 4,
    rating: 4.8,
    reviews: 19,
    promo: false,
    nouveau: true,
    tags: ["18HP", "107cm", "300L"]
  }
];

const categories = ["Tous", "Tracteurs", "Motoculteurs", "Pulvérisateurs", "Semoirs", "Irrigation", "Broyeurs", "Serres", "Tondeuses"];

// Fonction pour formater le prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const Boutique = () => {
  const [produits, setProduits] = useState(produitsAgricoles);
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [affichage, setAffichage] = useState("grid");
  const [tri, setTri] = useState("nom");
  const [panier, setPanier] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [filtres, setFiltres] = useState({
    prixMin: 0,
    prixMax: 20000000,
    categories: [],
    puissance: 'all',
    marques: []
  });

  // Filtrer les produits (mémorisé pour éviter les recalculs)
  const produitsFiltres = useMemo(() => {
    return produits.filter(produit => {
      const matchCategorie = categorieActive === "Tous" || produit.categorie === categorieActive;
      const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                            produit.description.toLowerCase().includes(recherche.toLowerCase());
      return matchCategorie && matchRecherche;
    });
  }, [produits, categorieActive, recherche]);

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

  // Formater le prix (mémorisé pour éviter les recréations)
  const formatPrix = useCallback((prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  }, []);

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
          <p className="text-green-700 font-medium">Notify for the best price</p>
        </div>
      </div>

      {/* Layout principal avec sidebar et contenu */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Sidebar des filtres */}
        <div className="lg:w-1/4 space-y-6">
          {/* Filtre Producteur */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Producer</h3>
            <div className="space-y-3">
              {['Trina Solar', 'Longi Solar', 'Canadian Solar', 'JA Solar', 'LG', 'Jinko Solar'].map((producer) => (
                <label key={producer} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span className="ml-2 text-gray-700">{producer}</span>
                </label>
              ))}
            </div>
            <button className="text-green-600 text-sm mt-3 hover:text-green-700">
              Show all..
            </button>
          </div>

          {/* Filtre Prix */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Price range</h3>
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
                <span>€4 200</span>
                <span>€20 200</span>
              </div>
            </div>
          </div>

          {/* Filtre Puissance */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Power</h3>
            <div className="space-y-3">
              {['3.5 kWp', '4.0 kWp', '5.0 kWp', '6.0 kWp'].map((power) => (
                <label key={power} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span className="ml-2 text-gray-700">{power}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:w-3/4">
          {/* Cartes produits */}
          <div className="space-y-6">
            {/* Carte produit 1 - Nusa Solar */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="relative">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Nusa Solar" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                    12 panels
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nusa Solar</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">4.6</span>
                      <span className="ml-1 text-gray-500 text-sm">(83 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span className="text-sm">18 km (from you)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiZap className="mr-2" />
                      <span className="text-sm">6.5 kWp Power</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2" />
                      <span className="text-sm">312 installations</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">€7 845</div>
                    <div className="text-sm text-gray-500">(NET PRICE)</div>
                    <div className="text-green-600 font-medium">€3.500 Savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">€145</div>
                    <div className="text-gray-400 text-xs">(MONTHLY)</div>
                    <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Check details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte produit 2 - Incosolar GmbH */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="relative">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Incosolar GmbH" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                    10 panels
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Incosolar GmbH</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">4.7</span>
                      <span className="ml-1 text-gray-500 text-sm">(90 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span className="text-sm">10 km (from you)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiZap className="mr-2" />
                      <span className="text-sm">6.0 kWp Power</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2" />
                      <span className="text-sm">244 installations</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">€7 200</div>
                    <div className="text-sm text-gray-500">(NET PRICE)</div>
                    <div className="text-green-600 font-medium">€3.300 Savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">€135</div>
                    <div className="text-gray-400 text-xs">(MONTHLY)</div>
                    <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Check details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte produit 3 - BTI Energy */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="relative">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="BTI Energy" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                    8 panels
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">BTI Energy</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">5.0</span>
                      <span className="ml-1 text-gray-500 text-sm">(14 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span className="text-sm">12 km (from you)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiZap className="mr-2" />
                      <span className="text-sm">5.8 kWp Power</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2" />
                      <span className="text-sm">32 installations</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">€7 010</div>
                    <div className="text-sm text-gray-500">(NET PRICE)</div>
                    <div className="text-green-600 font-medium">€3.000 Savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">€126</div>
                    <div className="text-gray-400 text-xs">(MONTHLY)</div>
                    <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Check details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section d'économies */}
          <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Save €4000 over 10 years.</h2>
              <p className="text-xl mb-4">Start right now!</p>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img 
                src="/api/placeholder/400/200" 
                alt="Solar panels" 
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
                {/* Catégories */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map(categorie => (
                    <button
                      key={categorie}
                      onClick={() => setCategorieActive(categorie)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        categorieActive === categorie
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {categorie}
                    </button>
                  ))}
                </div>

                {/* Tri */}
                <select
                  value={tri}
                  onChange={(e) => setTri(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                >
                  <option value="nom">Trier par nom</option>
                  <option value="prix">Trier par prix</option>
                  <option value="rating">Trier par note</option>
                </select>

                {/* Mode d'affichage */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAffichage("grid")}
                    className={`p-2 ${affichage === "grid" ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setAffichage("list")}
                    className={`p-2 ${affichage === "list" ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produits */}
        <section className="py-12">
          <div className="container-custom">
            <div className="mb-6">
              <p className="text-gray-600">
                {produitsTriés.length} produit{produitsTriés.length > 1 ? 's' : ''} trouvé{produitsTriés.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className={`grid gap-6 ${
              affichage === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {produitsTriés.map(produit => (
                <div key={produit.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                  affichage === "list" ? "flex gap-6" : ""
                }`}>
                  {/* Image */}
                  <div className={`relative ${affichage === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"}`}>
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {produit.promo && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          PROMO
                        </span>
                      )}
                      {produit.nouveau && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          NOUVEAU
                        </span>
                      )}
                    </div>

                    {/* Bouton favori */}
                    <button
                      onClick={() => basculerFavori(produit.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <FiHeart className={`${favoris.includes(produit.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  {/* Contenu */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {produit.nom}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {produit.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {produit.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating et reviews */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(produit.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {produit.rating} ({produit.reviews} avis)
                      </span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-[#2E7D32]">
                        {formatPrix(produit.prix)}
                      </span>
                      {produit.prixOriginal && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrix(produit.prixOriginal)}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-4">
                      <span className={`text-sm ${
                        produit.stock > 5 ? 'text-green-600' : 
                        produit.stock > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {produit.stock > 0 ? `${produit.stock} en stock` : 'Rupture de stock'}
                      </span>
                    </div>

                    {/* Bouton d'achat */}
                    <button
                      onClick={() => ajouterAuPanier(produit)}
                      disabled={produit.stock === 0}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        produit.stock > 0
                          ? 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart />
                      {produit.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucun produit */}
            {produitsTriés.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucun produit trouvé pour votre recherche.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section avantages */}
        <section className="bg-white py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir SAFEM ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#2E7D32] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTruck size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
                <p className="text-gray-600">
                  Livraison gratuite dès 500 000 FCFA partout au Cameroun
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#2E7D32] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShield size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Garantie Qualité</h3>
                <p className="text-gray-600">
                  Tous nos produits sont garantis et certifiés
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#2E7D32] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiRefreshCw size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">SAV Professionnel</h3>
                <p className="text-gray-600">
                  Service après-vente et maintenance assurés
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Boutique;
