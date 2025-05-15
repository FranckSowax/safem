import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import { FiShoppingCart, FiMinus, FiPlus, FiChevronRight, FiStar, FiArrowLeft } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';
import productService from '../../services/productService';
import cartService from '../../services/cartService';

/**
 * Page de détail d'un produit
 * Affiche les informations complètes d'un produit et permet de l'ajouter au panier
 */
export default function ProductDetailPage({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { slug } = router.query;
  
  // État pour la quantité sélectionnée
  const [quantity, setQuantity] = useState(1);
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('description');
  // État pour l'image principale
  const [mainImage, setMainImage] = useState(0);
  
  // Normaliser le format des données du produit pour s'assurer qu'il est compatible avec le composant
  const normalizeProductData = (rawProduct) => {
    if (!rawProduct) return null;
    
    // S'assurer que tous les champs nécessaires sont présents
    return {
      id: rawProduct.id || '',
      slug: rawProduct.slug || slug || '',
      name: rawProduct.name || '',
      price: rawProduct.price || 0,
      is_organic: rawProduct.is_organic || false,
      is_featured: rawProduct.is_featured || false,
      description: rawProduct.description || '',
      short_description: rawProduct.short_description || '',
      nutritional_info: rawProduct.nutritional_info || {
        calories: '',
        proteins: '',
        carbs: '',
        fats: '',
        vitamins: ''
      },
      storage_tips: rawProduct.storage_tips || '',
      producer: rawProduct.producer || {
        name: '',
        description: ''
      },
      category: rawProduct.category || {
        name: '',
        slug: ''
      },
      unit: rawProduct.unit || 'unité',
      weight: rawProduct.weight || 0,
      stock_quantity: rawProduct.stock_quantity || 0,
      images: Array.isArray(rawProduct.images) && rawProduct.images.length > 0 
        ? rawProduct.images.map(img => ({
            id: img.id || '',
            url: img.url || img.publicUrl || '',
            alt_text: img.alt_text || rawProduct.name || ''
          })) 
        : [{ 
            id: '1',
            url: 'https://via.placeholder.com/600?text=Image+non+disponible',
            alt_text: rawProduct.name || 'Image non disponible'
          }]
    };
  };
  
  // Si la page est en cours de chargement
  if (router.isFallback) {
    return (
      <MainLayout title="Chargement..." description="Chargement du produit...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="loading-spinner"></div>
        </div>
      </MainLayout>
    );
  }
  
  // Normaliser les données du produit
  const productData = normalizeProductData(product) || {
    id: '1',
    slug: slug || 'produit',
    name: 'Tomates Bio',
    price: 1500,
    is_organic: true,
    is_featured: true,
    description: `
      <p>Nos tomates biologiques sont cultivées avec soin, sans pesticides ni produits chimiques, pour vous offrir le meilleur de la nature.</p>
      <p>Récoltées à maturité, elles sont gorgées de saveurs et de nutriments. Parfaites pour vos salades, sauces et plats cuisinés.</p>
      <p>Variété: Roma</p>
    `,
    short_description: 'Tomates fraîches cultivées sans pesticides.',
    nutritional_info: {
      calories: '18 kcal',
      proteins: '0.9g',
      carbs: '3.9g',
      fats: '0.2g',
      vitamins: 'A, C, K'
    },
    storage_tips: 'Conservez à température ambiante, loin de la lumière directe du soleil. Pour prolonger leur fraîcheur, vous pouvez les garder au réfrigérateur jusqu\'\u00e0 une semaine.',
    producer: {
      name: 'Ferme du Soleil',
      description: 'Producteur local certifié bio depuis 2015.'
    },
    category: {
      name: 'Légumes',
      slug: 'legumes'
    },
    unit: 'kg',
    weight: 1,
    stock_quantity: 25,
    images: [
      { 
        id: '1',
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        alt_text: 'Tomates bio fraîches'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        alt_text: 'Tomates coupées en tranches'
      }
    ]
  };
  
  // Normaliser les produits liés
  const normalizedRelatedProducts = Array.isArray(relatedProducts) && relatedProducts.length > 0
    ? relatedProducts.map(normalizeProductData).filter(Boolean)
    : [
        {
          id: '2',
          slug: 'poivrons-bio',
          name: 'Poivrons Bio',
          price: 2000,
          is_organic: true,
          images: [{ url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }]
        },
        {
          id: '3',
          slug: 'concombres-bio',
          name: 'Concombres Bio',
          price: 1200,
          is_organic: true,
          images: [{ url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }]
        },
        {
          id: '4',
          slug: 'aubergines-bio',
          name: 'Aubergines Bio',
          price: 1800,
          is_organic: true,
          images: [{ url: 'https://images.unsplash.com/photo-1613825787113-d371c9dda3ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }]
        }
      ];
  
  // Fonctions pour gérer la quantité
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < productData.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };
  
  // Fonction pour ajouter au panier
  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(productData, quantity);
      // On pourrait ajouter ici une notification de succès
      console.log(`Ajouté au panier: ${productData.name}, quantité: ${quantity}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      // On pourrait ajouter ici une notification d'erreur
    }
  };
  
  return (
    <MainLayout 
      title={`${productData.name} - Safem`}
      description={productData.short_description}
    >
      {/* Fil d'Ariane */}
      <div className="container-custom py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <FiChevronRight className="mx-2" />
          <Link href="/products" className="hover:text-primary">Produits</Link>
          <FiChevronRight className="mx-2" />
          <Link href={`/products?category=${productData.category?.slug}`} className="hover:text-primary">
            {productData.category?.name || 'Catégorie'}
          </Link>
          <FiChevronRight className="mx-2" />
          <span className="text-text font-medium">{productData.name}</span>
        </div>
      </div>
      
      {/* Section principale du produit */}
      <section className="container-custom pb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Galerie d'images */}
            <div className="p-6">
              {/* Image principale */}
              <div className="relative h-80 md:h-96 mb-4 rounded-md overflow-hidden">
                <Image
                  src={productData.images[mainImage]?.url || 'https://via.placeholder.com/600'}
                  alt={productData.images[mainImage]?.alt_text || productData.name}
                  fill
                  className="object-cover"
                />
                {productData.is_organic && (
                  <span className="absolute top-2 left-2 text-xs font-semibold bg-green-100 text-primary px-2 py-1 rounded-full">
                    Bio
                  </span>
                )}
              </div>
              
              {/* Images miniatures */}
              {productData.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productData.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setMainImage(index)}
                      className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden ${
                        index === mainImage ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt_text || `${productData.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Informations produit */}
            <div className="p-6 flex flex-col">
              <h1 className="text-2xl font-heading font-bold mb-2">{productData.name}</h1>
              
              {/* Prix */}
              <div className="text-2xl font-bold text-primary mb-4">
                {formatPrice(productData.price)}
                <span className="text-sm font-normal text-gray-500 ml-2">/ {productData.unit}</span>
              </div>
              
              {/* Description courte */}
              <p className="text-gray-600 mb-6">{productData.short_description}</p>
              
              {/* Producteur */}
              {productData.producer && (
                <div className="mb-6">
                  <h3 className="text-sm text-gray-500 mb-1">Producteur:</h3>
                  <p className="font-medium">{productData.producer.name}</p>
                  <p className="text-sm text-gray-600">{productData.producer.description}</p>
                </div>
              )}
              
              {/* Sélecteur de quantité et bouton d'ajout */}
              <div className="mt-auto">
                <div className="mb-6">
                  <h3 className="text-sm text-gray-500 mb-2">Quantité:</h3>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-l-button"
                      disabled={quantity <= 1}
                      aria-label="Diminuer la quantité"
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={productData.stock_quantity}
                      className="w-16 text-center py-2 border-y border-gray-100"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-r-button"
                      disabled={quantity >= productData.stock_quantity}
                      aria-label="Augmenter la quantité"
                    >
                      <FiPlus />
                    </button>
                    
                    <span className="ml-3 text-sm text-gray-500">
                      {productData.stock_quantity > 0 
                        ? `${productData.stock_quantity} disponibles` 
                        : 'Rupture de stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary py-3 px-6 flex-1"
                    disabled={productData.stock_quantity <= 0}
                  >
                    <FiShoppingCart className="mr-2" />
                    Ajouter au panier
                  </button>
                  <Link 
                    href="/cart" 
                    className="btn-secondary py-3 px-6 hidden sm:inline-flex"
                  >
                    Voir le panier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Onglets d'information détaillée */}
      <section className="container-custom pb-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Navigation des onglets */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'description' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'nutrition' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('nutrition')}
            >
              Informations nutritionnelles
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'storage' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('storage')}
            >
              Conservation
            </button>
          </div>
          
          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Description */}
            {activeTab === 'description' && (
              <div dangerouslySetInnerHTML={{ __html: productData.description }} />
            )}
            
            {/* Informations nutritionnelles */}
            {activeTab === 'nutrition' && (
              <div>
                <h3 className="font-medium mb-4">Valeurs nutritionnelles (pour 100g)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between pb-2 border-b">
                    <span>Calories</span>
                    <span>{productData.nutritional_info?.calories || '-'}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Protéines</span>
                    <span>{productData.nutritional_info?.proteins || '-'}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Glucides</span>
                    <span>{productData.nutritional_info?.carbs || '-'}</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Lipides</span>
                    <span>{productData.nutritional_info?.fats || '-'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Vitamines</span>
                    <span>{productData.nutritional_info?.vitamins || '-'}</span>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Conservation */}
            {activeTab === 'storage' && (
              <div>
                <h3 className="font-medium mb-4">Conseils de conservation</h3>
                <p>{productData.storage_tips || 'Information non disponible.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Produits similaires */}
      {normalizedRelatedProducts && normalizedRelatedProducts.length > 0 && (
        <section className="container-custom pb-12">
          <h2 className="text-xl font-heading font-bold mb-6">Produits similaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {normalizedRelatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="card group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={relatedProduct.images[0]?.url || 'https://via.placeholder.com/300'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  
                  {/* Badge bio */}
                  {relatedProduct.is_organic && (
                    <span className="absolute top-2 left-2 text-xs font-semibold bg-green-100 text-primary px-2 py-1 rounded-full">
                      Bio
                    </span>
                  )}
                </div>
                
                {/* Informations */}
                <div className="p-4">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  
                  <div className="text-primary font-semibold">
                    {formatPrice(relatedProduct.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Bouton retour */}
      <div className="container-custom pb-12">
        <Link 
          href="/products" 
          className="inline-flex items-center text-primary hover:text-primary-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Retour aux produits
        </Link>
      </div>
    </MainLayout>
  );
}

/**
 * Récupération des données au moment de la construction (SSG)
 */
export async function getStaticProps({ params }) {
  try {
    // Récupérer les données du produit via notre service API
    const product = await productService.getProductBySlug(params.slug);
    
    // Si le produit n'existe pas
    if (!product) {
      return {
        notFound: true,
        revalidate: 60 // Réessayer après 1 minute
      };
    }
    
    // Récupérer les produits liés
    let relatedProducts = [];
    try {
      relatedProducts = await productService.getRelatedProducts(product.id, 4);
    } catch (relatedError) {
      console.error('Erreur lors de la récupération des produits liés:', relatedError);
      // Continuer malgré l'erreur
    }
    
    return {
      props: {
        product,
        relatedProducts
      },
      // Revalidation toutes les heures (ISR)
      revalidate: 3600
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return {
      props: { product: null, relatedProducts: [] },
      revalidate: 60 // Réessayer plus rapidement en cas d'erreur
    };
  }
}

/**
 * Chemins à générer au moment de la construction
 */
export async function getStaticPaths() {
  try {
    // Récupérer tous les produits (ou une partie) pour générer les chemins statiques
    const products = await productService.getAllProducts({ limit: 20 });
    
    const paths = products.map((product) => ({
      params: { slug: product.slug }
    }));
    
    return {
      paths,
      // Générer les autres pages à la demande
      fallback: true
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des chemins:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}
