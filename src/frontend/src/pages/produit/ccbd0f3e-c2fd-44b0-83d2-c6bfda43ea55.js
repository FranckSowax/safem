import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import { supabase } from '../../lib/supabaseClient';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Award,
  CheckCircle,
  MapPin,
  Users,
  Calendar,
  Zap,
  Feather,
  Settings,
  Info
} from 'react-feather';

const FiletAntiInsectes = () => {
  const router = useRouter();
  const [produit, setProduit] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [imageActive, setImageActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productId = 'ccbd0f3e-c2fd-44b0-83d2-c6bfda43ea55';

  useEffect(() => {
    const chargerProduit = async () => {
      try {
        setLoading(true);
        
        // Charger les données du produit
        const { data: produitData, error: produitError } = await supabase
          .from('produits')
          .select(`
            *,
            categories_produits (
              nom,
              types_agriculture (nom)
            )
          `)
          .eq('id', productId)
          .single();

        if (produitError) throw produitError;

        // Charger les images
        const { data: imagesData, error: imagesError } = await supabase
          .from('produits_images')
          .select('*')
          .eq('produit_id', productId)
          .order('ordre');

        if (imagesError) throw imagesError;

        // Charger les avis
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews_produits')
          .select('*')
          .eq('produit_id', productId)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        setProduit(produitData);
        setImages(imagesData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    chargerProduit();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !produit) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
            <button 
              onClick={() => router.push('/boutique')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Retour à la boutique
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <MainLayout>
      <Head>
        <title>Filet Anti-Insectes SAFEM - Protection des Cultures | SAFEM</title>
        <meta name="description" content="Filet anti-insectes SAFEM en polyéthylène haute densité. Protection efficace contre les insectes ravageurs pour cultures légumières et horticoles." />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={() => router.push('/')} className="hover:text-green-600">
                Accueil
              </button>
              <span>/</span>
              <button onClick={() => router.push('/boutique')} className="hover:text-green-600">
                Boutique Pro
              </button>
              <span>/</span>
              <span className="text-gray-900">Filet Anti-Insectes</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Galerie d'images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={images[imageActive]?.image_url || '/api/placeholder/600/600'}
                  alt={images[imageActive]?.alt_text || 'Filet Anti-Insectes SAFEM'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setImageActive(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === imageActive ? 'border-green-600' : 'border-gray-200 hover:border-gray-300'
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

            {/* Informations produit */}
            <div className="space-y-6">
              {/* En-tête */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {produit.categories_produits?.nom}
                  </span>
                  {produit.nouveau && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Nouveau
                    </span>
                  )}
                  {produit.promo && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Promotion
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {produit.nom}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(produit.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({produit.reviews_count} avis)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>Livraison {produit.distance_km}km</span>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(produit.prix)}
                  </div>
                  {produit.prix_original && produit.prix_original > produit.prix && (
                    <div className="text-lg text-gray-500 line-through">
                      {formatPrice(produit.prix_original)}
                    </div>
                  )}
                </div>
                
                {produit.economie && (
                  <div className="flex items-center gap-2 text-green-700">
                    <Award size={16} />
                    <span className="font-medium">
                      Économisez {formatPrice(produit.economie)} par rapport aux solutions concurrentes
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Avantages */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="mx-auto mb-2 text-green-600" size={24} />
                  <div className="text-sm font-medium text-gray-900">Livraison</div>
                  <div className="text-xs text-gray-600">Gratuite</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="mx-auto mb-2 text-green-600" size={24} />
                  <div className="text-sm font-medium text-gray-900">Garantie</div>
                  <div className="text-xs text-gray-600">3-4 saisons</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <Users className="mx-auto mb-2 text-green-600" size={24} />
                  <div className="text-sm font-medium text-gray-900">Installations</div>
                  <div className="text-xs text-gray-600">{produit.installations}+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description et bénéfices */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description générale */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Description Générale</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Le filet anti-insectes SAFEM est une solution durable, performante et économique destinée à la protection des cultures légumières, horticoles et pépinières. Conçu en polyéthylène haute densité (PEHD) avec un maillage ultra-fin, il constitue une barrière physique efficace contre une large gamme d'insectes ravageurs tout en préservant l'aération et la perméabilité des cultures.
                  </p>
                </div>
              </div>

              {/* Bénéfices clés */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Bénéfices Clés</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Durabilité exceptionnelle : 3 à 4 saisons d\'utilisation',
                    'Faible grammage : pose directe sur culture possible (45-48 g/m²)',
                    'Haute résistance mécanique : résiste aux déchirures et manipulations',
                    'Perméable à la pluie et au vent : évite les maladies cryptogamiques',
                    'Réduction des traitements phytosanitaires',
                    'Imputrescible & hydrophobe : ne se gorge pas d\'eau',
                    'Barrière ciblée contre altises, pucerons, etc.',
                    'Traitement UV 320 kly pour longévité accrue'
                  ].map((benefice, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-gray-700 text-sm">{benefice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caractéristiques techniques */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Caractéristiques Techniques</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Matière</span>
                      <span className="text-gray-700">100% PEHD</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Poids</span>
                      <span className="text-gray-700">45-48 g/m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Mailles</span>
                      <span className="text-gray-700">435 µm x 670 µm</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Couleur</span>
                      <span className="text-gray-700">Cristal</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Traitement UV</span>
                      <span className="text-gray-700">320 kly</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Perméabilité (plat)</span>
                      <span className="text-gray-700">96%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Perméabilité (arceaux)</span>
                      <span className="text-gray-700">86%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Taux d'ombrage</span>
                      <span className="text-gray-700">9%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilisations recommandées */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Feather className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Utilisations Recommandées</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'Cultures maraîchères',
                    'Horticulture',
                    'Pépinières',
                    'Cultures sensibles'
                  ].map((usage, index) => (
                    <div key={index} className="text-center p-4 bg-green-50 rounded-xl">
                      <Feather className="mx-auto mb-2 text-green-600" size={20} />
                      <div className="text-sm font-medium text-gray-900">{usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Disponibilité */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Disponibilité</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-gray-700">En stock ({produit.stock} unités)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="text-green-600" size={16} />
                    <span className="text-sm text-gray-700">Livraison rapide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="text-green-600" size={16} />
                    <span className="text-sm text-gray-700">Dimensions sur mesure</span>
                  </div>
                </div>
              </div>

              {/* Conditionnement */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Conditionnement</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    • Rouleaux standards
                  </div>
                  <div className="text-sm text-gray-700">
                    • Coupes au détail
                  </div>
                  <div className="text-sm text-gray-700">
                    • Dimensions spécifiques sur demande
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {produit.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avis clients */}
          {reviews.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Avis Clients</h2>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {reviews.length} avis
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">{review.nom_utilisateur}</div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.commentaire}</p>
                      {review.verifie && (
                        <div className="flex items-center gap-1 mt-3">
                          <CheckCircle className="text-green-600" size={14} />
                          <span className="text-xs text-green-600">Achat vérifié</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FiletAntiInsectes;
