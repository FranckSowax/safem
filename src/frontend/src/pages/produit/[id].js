import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import { supabase } from '../../lib/supabaseClient';
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart,
  FiMapPin,
  FiUsers,
  FiTruck,
  FiShield,
  FiCheck,
  FiInfo,
  FiPackage,
  FiThermometer,
  FiSun,
  FiMoon,
  FiLoader
} from 'react-icons/fi';

// Fonction pour formater le prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

const DetailProduit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avis, setAvis] = useState([]);
  const [images, setImages] = useState([]);
  const [imageActive, setImageActive] = useState(0);

  useEffect(() => {
    if (id) {
      chargerProduit();
    }
  }, [id]);

  const chargerProduit = async () => {
    try {
      setLoading(true);
      
      // Charger le produit avec ses relations
      const { data: produitData, error: produitError } = await supabase
        .from('produits')
        .select(`
          *,
          categories_produits(nom, types_agriculture(nom, icone))
        `)
        .eq('id', id)
        .eq('actif', true)
        .single();
      
      if (produitError) throw produitError;
      setProduit(produitData);
      
      // Charger les avis
      const { data: avisData, error: avisError } = await supabase
        .from('reviews_produits')
        .select('*')
        .eq('produit_id', id)
        .order('created_at', { ascending: false });
      
      if (avisError) throw avisError;
      setAvis(avisData || []);
      
      // Charger les images
      const { data: imagesData, error: imagesError } = await supabase
        .from('produits_images')
        .select('*')
        .eq('produit_id', id)
        .order('ordre');
      
      if (imagesError) throw imagesError;
      setImages(imagesData || []);
      
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <FiLoader className="animate-spin text-green-600 text-3xl" />
          <span className="ml-3 text-gray-600 text-lg">Chargement du produit...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !produit) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || 'Ce produit n\'existe pas ou n\'est plus disponible.'}</p>
          <button 
            onClick={() => router.push('/boutique')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retour à la boutique
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{produit.nom} - SAFEM</title>
        <meta name="description" content={produit.description} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => router.push('/boutique')} className="hover:text-green-600">
              Boutique
            </button>
            <span>/</span>
            <span className="text-green-600">{produit.categories_produits?.types_agriculture?.nom}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{produit.nom}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images du produit */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={images[imageActive]?.image_url || produit.image_url || '/api/placeholder/500/500'} 
                alt={produit.nom}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setImageActive(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      imageActive === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            {/* Header produit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  🌱 {produit.categories_produits?.types_agriculture?.nom}
                </span>
                {produit.nouveau && (
                  <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                    NOUVEAU
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{produit.nom}</h1>
              <p className="text-gray-600">
                Référence : POLYANE 5TL | Fournisseur : {produit.marque_nom}
              </p>
            </div>

            {/* Évaluation et stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(produit.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-medium">{produit.rating}</span>
                <span className="ml-1 text-gray-500">({produit.reviews_count} avis)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{produit.distance_km} km</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="w-4 h-4 mr-1" />
                <span className="text-sm">{produit.installations} installations</span>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatPrice(produit.prix)}</div>
                  {produit.prix_original && (
                    <div className="text-lg text-gray-500 line-through">{formatPrice(produit.prix_original)}</div>
                  )}
                  <div className="text-sm text-gray-600">Prix NET - Paiement mensuel disponible</div>
                  {produit.economie && (
                    <div className="text-green-600 font-medium mt-1">
                      {formatPrice(produit.economie)} d'économies potentielles
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-medium mb-2">
                    {produit.stock} en stock
                  </div>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <FiShoppingCart className="mr-2" />
                      Ajouter au panier
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <FiHeart className="mr-2" />
                      Favoris
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FiTruck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-900">Livraison rapide</div>
                <div className="text-xs text-blue-700">2-3 jours ouvrés</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FiShield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-900">Garantie 57 mois</div>
                <div className="text-xs text-green-700">5 saisons agricoles</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FiCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-900">Qualité certifiée</div>
                <div className="text-xs text-purple-700">Norme agricole</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description générale */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FiInfo className="mr-3 text-green-600" />
                🏷️ Description Générale
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {produit.description}
              </p>
            </div>

            {/* Bénéfices clés */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🌟 Bénéfices Clés
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiCheck className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Effet thermique renforcé :</strong> retient les infrarouges longs pour maintenir la chaleur de nuit.</span>
                </div>
                <div className="flex items-start">
                  <FiCheck className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Rendement accru & précocité améliorée</strong> grâce à une forte transmission lumineuse.</span>
                </div>
                <div className="flex items-start">
                  <FiCheck className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Anti-poussière :</strong> la couche extérieure à tension de surface modifiée favorise le glissement des particules.</span>
                </div>
                <div className="flex items-start">
                  <FiCheck className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Protection contre le gel :</strong> réduit les risques liés aux températures nocturnes.</span>
                </div>
              </div>
            </div>

            {/* Principe thermique */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🧪 Principe Thermique (Effet de serre optimisé)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FiSun className="text-yellow-500 text-2xl mr-3" />
                    <h3 className="font-bold text-blue-900">Jour</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Les rayons du soleil (infrarouges courts) pénètrent la serre et réchauffent l'air et le sol.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-3">
                    <FiMoon className="text-blue-500 text-2xl mr-3" />
                    <h3 className="font-bold text-orange-900">Nuit</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    La bâche conserve la chaleur émise par le sol (infrarouges longs), évitant les pertes thermiques.
                  </p>
                </div>
              </div>
            </div>

            {/* Avis clients */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
              <div className="space-y-4">
                {avis.map((avis) => (
                  <div key={avis.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{avis.nom_utilisateur}</span>
                        {avis.verifie && (
                          <FiCheck className="text-green-600 ml-2 w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`w-4 h-4 ${i < avis.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{avis.commentaire}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar caractéristiques */}
          <div className="space-y-6">
            {/* Caractéristiques techniques */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ⚙️ Caractéristiques Techniques
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type de film :</span>
                  <span className="font-medium">Film thermique tricouche</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission solaire :</span>
                  <span className="font-medium">110 Kly/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durabilité :</span>
                  <span className="font-medium">57 mois (5 saisons)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Structure :</span>
                  <span className="font-medium">Multicouche</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longueur min :</span>
                  <span className="font-medium">10 mètres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Largeurs :</span>
                  <span className="font-medium">16 dimensions</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {produit.tags && produit.tags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {produit.tags.map((tag, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Utilisation recommandée */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📦 Utilisation Recommandée
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <FiCheck className="text-green-600 mr-2 w-4 h-4" />
                  Serres maraîchères
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-green-600 mr-2 w-4 h-4" />
                  Cultures précoces
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-green-600 mr-2 w-4 h-4" />
                  Production sous abri
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-green-600 mr-2 w-4 h-4" />
                  Exploitations à haut rendement
                </li>
              </ul>
            </div>

            {/* Disponibilité */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">
                📞 Disponibilité & Commande
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Produit disponible immédiatement</strong> via SAFEM.</p>
                <p>Condition de vente : à partir de 10 ml</p>
                <p>Tarifs dégressifs selon la quantité.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailProduit;
