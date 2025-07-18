import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
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
  FiRefreshCw
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

const Boutique = () => {
  const [produits, setProduits] = useState(produitsAgricoles);
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [affichage, setAffichage] = useState("grid"); // grid ou list
  const [tri, setTri] = useState("nom"); // nom, prix, rating
  const [panier, setPanier] = useState([]);
  const [favoris, setFavoris] = useState([]);

  // Filtrer les produits
  const produitsFiltres = produits.filter(produit => {
    const matchCategorie = categorieActive === "Tous" || produit.categorie === categorieActive;
    const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                          produit.description.toLowerCase().includes(recherche.toLowerCase());
    return matchCategorie && matchRecherche;
  });

  // Trier les produits
  const produitsTriés = [...produitsFiltres].sort((a, b) => {
    switch(tri) {
      case "prix":
        return a.prix - b.prix;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.nom.localeCompare(b.nom);
    }
  });

  // Formater le prix
  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  };

  // Ajouter au panier
  const ajouterAuPanier = (produit) => {
    setPanier([...panier, produit]);
    // Ici vous pourriez ajouter une notification toast
  };

  // Basculer les favoris
  const basculerFavori = (produitId) => {
    if (favoris.includes(produitId)) {
      setFavoris(favoris.filter(id => id !== produitId));
    } else {
      setFavoris([...favoris, produitId]);
    }
  };

  return (
    <>
      <Head>
        <title>Boutique Matériel Agricole - SAFEM</title>
        <meta name="description" content="Découvrez notre gamme complète de matériel agricole professionnel. Tracteurs, motoculteurs, pulvérisateurs et plus encore." />
        <meta name="keywords" content="matériel agricole, tracteur, motoculteur, pulvérisateur, irrigation, SAFEM" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Boutique Matériel Agricole
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Équipez votre exploitation avec du matériel professionnel de qualité
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FiTruck className="text-yellow-300" />
                <span>Livraison gratuite dès 500 000 FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-yellow-300" />
                <span>Garantie constructeur</span>
              </div>
              <div className="flex items-center gap-2">
                <FiRefreshCw className="text-yellow-300" />
                <span>SAV professionnel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filtres et Recherche */}
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap gap-4 items-center">
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
