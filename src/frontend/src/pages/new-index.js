import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import NewsletterForm from '../components/NewsletterForm';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPackage, FiTruck, FiRefreshCw, FiShield, FiClock, FiCheck, FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

// Données temporaires pour la page d'accueil (à remplacer par des appels API)
const featuredProducts = [
  {
    id: 1,
    name: 'Tomates',
    slug: 'tomates',
    price: 2500,
    description: 'Tomates fraîches cultivées localement.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 30,
    category: 'legumes',
    is_organic: true,
    unit: 'kg',
    weight: '1kg',
    featured: true,
  },
  {
    id: 2,
    name: 'Laitue verte',
    slug: 'laitue-verte',
    price: 1800,
    description: 'Laitue fraîche et croquante.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 25,
    category: 'legumes',
    is_organic: true,
    unit: 'pièce',
    weight: '500g environ',
    featured: true,
  },
  {
    id: 3,
    name: 'Chou kale',
    slug: 'chou-kale',
    price: 2200,
    description: 'Chou kale frais riche en nutriments.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 18,
    category: 'legumes',
    is_organic: true,
    unit: 'botte',
    weight: '400g environ',
    featured: true,
  },
  {
    id: 4,
    name: 'Carottes',
    slug: 'carottes',
    price: 2000,
    description: 'Carottes fraîches et croquantes.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1606355571730-90061eea1d56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 25,
    category: 'legumes',
    is_organic: true,
    unit: 'kg',
    weight: '1kg',
    featured: true,
  },
  {
    id: 5,
    name: 'Poivrons colorés',
    slug: 'poivrons',
    price: 3000,
    description: 'Assortiment de poivrons colorés.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 15,
    category: 'legumes',
    is_organic: true,
    unit: 'kg',
    weight: '1kg',
    featured: true,
  },
  {
    id: 6,
    name: 'Fraises',
    slug: 'fraises',
    price: 3500,
    description: 'Fraises fraîches et sucrées.',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    stock: 12,
    category: 'fruits',
    is_organic: true,
    unit: 'barquette',
    weight: '250g',
    featured: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Marie Ndong',
    location: 'Libreville',
    content: 'Je suis ravie de la qualité des produits de Safem. Les légumes sont vraiment frais et savoureux!',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Thomas Engonga',
    location: 'Port-Gentil',
    content: 'Excellent service de livraison et produits de grande qualité. Je recommande vivement!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sylvie Mba',
    location: 'Franceville',
    content: 'Grâce à Safem, je peux enfin cuisiner avec des produits bio et locaux. Merci!',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 4,
  },
];

/**
 * Page d'accueil de l'application Safem
 */
export default function HomePage() {
  // État pour le défilement des témoignages sur mobile
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Effet pour faire défiler automatiquement les témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <MainLayout 
      title="Safem - Produits bio et frais du Gabon"
      description="Découvrez les produits frais, bio et locaux de la ferme Safem au Gabon. Livraison à domicile ou retrait à la ferme."
    >
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading tracking-tight leading-tight">
                <span className="block">Fresh.</span>
                <span className="block">Organic.</span>
                <span className="block">Sustainable.</span>
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Des produits bio cultivés avec passion au cœur du Gabon, livrés directement du producteur au consommateur.
              </p>
              <Link 
                href="/products" 
                className="bg-primary text-white px-6 py-3 rounded-full font-medium inline-flex items-center hover:bg-primary-700 transition-colors"
              >
                Découvrir nos produits
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Agriculture biologique au Gabon"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover z-10 relative"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-lg overflow-hidden shadow-lg z-20">
                <Image
                  src="https://images.unsplash.com/photo-1563289142-7375de6893e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Légumes frais"
                  width={150}
                  height={150}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-lg overflow-hidden shadow-lg z-20">
                <Image
                  src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Fruits biologiques"
                  width={150}
                  height={150}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-64 w-64 bg-green-50 rounded-full -mt-20 -mr-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-green-50 rounded-full -mb-20 -ml-20 opacity-50"></div>
      </section>
      
      {/* Histoire de Safem */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Champ de culture biologique"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 mt-8 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552913898-063f608cb81c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Marché local au Gabon"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1621809198702-cd229d5d40ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Agriculteur dans sa ferme"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 -mt-8 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1623400518182-a9affa33a5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Produits biologiques locaux"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="md:col-span-7 md:pl-8">
              <div className="inline-block bg-green-50 px-3 py-1 rounded-full text-primary text-sm font-medium mb-4">
                Notre Histoire
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Mieux qu'un producteur : <br />votre partenaire de confiance</h2>
              
              <p className="text-gray-600 mb-4">
                Safem est née de la passion d'un groupe d'agriculteurs gabonais déterminés à produire des aliments sains, locaux et durables. 
                Notre coopérative fondée en 2018 rassemble aujourd'hui plus de 30 producteurs qui partagent les mêmes valeurs : respect de la terre, circuits courts et qualité irréprochable.
              </p>
              
              <p className="text-gray-600 mb-6">
                Notre mission est simple : vous offrir le meilleur de la nature gabonaise tout en préservant notre patrimoine agricole pour les générations futures. Chaque produit que vous achetez chez Safem contribue à soutenir l'économie locale et des pratiques agricoles responsables.
              </p>
              
              <Link href="/about" className="inline-flex items-center text-primary font-medium hover:underline">
                En savoir plus sur notre histoire <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nos meilleurs produits frais */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Freshest Picks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez notre sélection de produits frais récoltés cette semaine, directement de nos fermes à votre table.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="relative group overflow-hidden rounded-lg shadow-md">
                <div className="relative h-48 md:h-60 overflow-hidden">
                  <Image
                    src={product.images[0]?.publicUrl || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.is_organic && (
                    <div className="absolute top-2 right-2 bg-green-100 text-primary text-xs font-bold px-2 py-1 rounded-md">
                      BIO
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-primary font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(product.price)}</span>
                    <Link href={`/products/${product.slug}`} className="block text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-1 px-2">
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/products" 
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
            >
              Voir tous nos produits
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Pourquoi choisir notre ferme biologique */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Choose Our Organic Farm?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ferme biologique au Gabon"
                width={800}
                height={600}
                className="object-cover h-full w-full"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg py-2 px-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 4.9/5.0</span>
                  <span className="text-gray-500 text-sm">+2800 Avis Clients</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <FiClock className="text-xl text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">100% Bio Certifié</h3>
                <p className="text-gray-600 text-sm">Nos produits sont certifiés biologiques, sans pesticides ni produits chimiques.</p>
              </div>
              
              <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <FiTruck className="text-xl text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Ferme à Table</h3>
                <p className="text-gray-600 text-sm">Produits frais livrés directement de notre ferme à votre domicile.</p>
              </div>
              
              <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <FiCheck className="text-xl text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Qualité Premium</h3>
                <p className="text-gray-600 text-sm">Nos produits sont sélectionnés avec soin pour une qualité exceptionnelle.</p>
              </div>
              
              <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <FiRefreshCw className="text-xl text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Agriculture Durable</h3>
                <p className="text-gray-600 text-sm">Nous pratiquons une agriculture respectueuse de l'environnement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Updates & Offers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Get Updates <br />& Offers</h2>
                <p className="text-gray-600 mb-6">Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales et les dernières nouvelles de notre ferme biologique.</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Votre adresse e-mail" 
                    className="px-4 py-3 rounded-lg border border-gray-300 flex-grow"
                  />
                  <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    S'inscrire
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="consent" className="h-4 w-4 text-primary border-gray-300 rounded" />
                  <label htmlFor="consent" className="text-sm text-gray-600">J'accepte de recevoir des messages de Safem par e-mail</label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Légumes biologiques" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden mt-8">
                  <Image 
                    src="https://images.unsplash.com/photo-1595436275705-3fcf8bed5b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Produits biologiques" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 relative h-48 rounded-lg overflow-hidden -mt-6">
                  <Image 
                    src="https://images.unsplash.com/photo-1470107355970-2ace9f20ab15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Fruits frais" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <section className="bg-gray-50 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center text-xl font-bold text-gray-900 mb-4">
                  <div className="w-8 h-8 mr-2 bg-primary rounded-full flex items-center justify-center text-white">
                    S
                  </div>
                  Safem
                </div>
                <p className="text-gray-600 text-sm mb-4">Produits biologiques frais du Gabon livrés directement du producteur au consommateur.</p>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                    <FiInstagram size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                    <FiTwitter size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                    <FiFacebook size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                    <FiYoutube size={16} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Contact Us</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Libreville, Gabon</li>
                  <li>+241 074 589 632</li>
                  <li>info@safem-gabon.com</li>
                  <li>9h - 17h, Lun - Sam</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Liens Utiles</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/about" className="hover:text-primary">Notre Histoire</Link></li>
                  <li><Link href="/products" className="hover:text-primary">Nos Produits</Link></li>
                  <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                  <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Get In Touch</h4>
                <p className="text-sm text-gray-600 mb-4">Des questions ou suggestions ? N'hésitez pas à nous contacter !</p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Contactez-nous
                </Link>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Safem. Tous droits réservés.
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
