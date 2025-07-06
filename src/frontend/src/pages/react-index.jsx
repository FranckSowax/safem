import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Composant Header
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-700">SAFEM</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-green-700 hover:text-green-900">Accueil</Link></li>
            <li><Link href="/products" className="text-gray-600 hover:text-green-700">Produits</Link></li>
            <li><Link href="/about" className="text-gray-600 hover:text-green-700">Notre Histoire</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-green-700">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Composant Hero
const Hero = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:flex items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">
            <div>Fresh.</div>
            <div>Organic.</div>
            <div>Sustainable.</div>
          </h1>
          <p className="text-gray-600 mb-6">
            Des produits bio cultivés avec passion au cœur du Gabon, livrés directement du producteur au consommateur.
          </p>
          <Link href="/products" className="inline-block bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700">
            Découvrir nos produits →
          </Link>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1506484381205-f7945653044d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Agriculture biologique au Gabon" 
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

// Composant Histoire
const About = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Notre Histoire</h2>
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Champs agricoles au Gabon" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h3 className="text-2xl font-bold mb-4">Notre mission pour l'agriculture durable</h3>
            <p className="text-gray-600 mb-4">
              Safem est née de la passion d'un groupe d'agriculteurs gabonais déterminés à produire des aliments sains, locaux et durables. 
              Notre coopérative fondée en 2018 rassemble aujourd'hui plus de 30 producteurs qui partagent les mêmes valeurs : respect de la terre, circuits courts et qualité irréprochable.
            </p>
            <p className="text-gray-600 mb-4">
              Notre mission est simple : vous offrir le meilleur de la nature gabonaise tout en préservant notre patrimoine agricole pour les générations futures. Chaque produit que vous achetez chez Safem contribue à soutenir l'économie locale et des pratiques agricoles responsables.
            </p>
            <div className="mt-6">
              <Link href="/about" className="text-green-600 hover:text-green-800">
                En savoir plus sur notre histoire →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Produits
const Products = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Tomates',
      price: '2 500 FCFA',
      image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isBio: true
    },
    {
      id: 2,
      name: 'Laitue verte',
      price: '1 800 FCFA',
      image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isBio: true
    },
    {
      id: 3,
      name: 'Chou kale',
      price: '2 200 FCFA',
      image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isBio: true
    },
    {
      id: 4,
      name: 'Poivrons colorés',
      price: '3 000 FCFA',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isBio: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Our Freshest Picks</h2>
        <p className="text-gray-600 text-center mb-12">Découvrez notre sélection de produits frais récoltés cette semaine, directement de nos fermes à votre table.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                {product.isBio && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    BIO
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-green-700 font-bold">{product.price}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link href={`/products/${product.id}`} className="text-sm text-gray-600 hover:text-green-700">
                    Voir le produit
                  </Link>
                  <button className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 text-sm">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/products" className="inline-block bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700">
            Voir tous nos produits →
          </Link>
        </div>
      </div>
    </section>
  );
};

// Composant Avantages
const Features = () => {
  const features = [
    {
      icon: "🌱",
      title: "100% Bio Certifié",
      description: "Nos produits sont certifiés biologiques, sans pesticides ni produits chimiques."
    },
    {
      icon: "🚚",
      title: "Ferme à Table",
      description: "Produits frais livrés directement de notre ferme à votre domicile."
    },
    {
      icon: "✓",
      title: "Qualité Premium",
      description: "Nos produits sont sélectionnés avec soin pour une qualité exceptionnelle."
    },
    {
      icon: "♻️",
      title: "Agriculture Durable",
      description: "Nous pratiquons une agriculture respectueuse de l'environnement."
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Organic Farm?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant Newsletter
const Newsletter = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Merci de votre inscription avec l'adresse: ${email}`);
    setEmail('');
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-green-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Get Updates & Offers</h2>
          <p className="text-gray-600 text-center mb-8">
            Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales et les dernières nouvelles de notre ferme biologique.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700"
            >
              S'inscrire
            </button>
          </form>
          
          <div className="mt-4 flex items-center">
            <input type="checkbox" id="consent" className="mr-2" required />
            <label htmlFor="consent" className="text-sm text-gray-600">
              J'accepte de recevoir des messages de Safem par e-mail
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Footer
const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="font-bold text-xl mb-4 text-green-700">SAFEM</h2>
            <p className="text-gray-600 mb-4">
              Produits biologiques frais du Gabon livrés directement du producteur au consommateur.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-700">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-700">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-700">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Libreville, Gabon</li>
              <li>+241 074 589 632</li>
              <li>info@safem-gabon.com</li>
              <li>9h - 17h, Lun - Sam</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-green-700">Notre Histoire</Link></li>
              <li><Link href="/products" className="text-gray-600 hover:text-green-700">Nos Produits</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-green-700">Blog</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-green-700">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Get In Touch</h3>
            <p className="text-gray-600 mb-4">Des questions ou suggestions ? N'hésitez pas à nous contacter !</p>
            <Link href="/contact" className="inline-block bg-white text-green-700 border border-green-700 py-2 px-4 rounded-md hover:bg-green-700 hover:text-white">
              Contactez-nous
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Safem. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>SAFEM - Produits Agricoles Bio du Gabon</title>
        <meta name="description" content="Découvrez les produits frais, bio et locaux de la ferme Safem au Gabon. Livraison à domicile ou retrait à la ferme." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
