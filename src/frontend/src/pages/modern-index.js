import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPackage, FiTruck, FiRefreshCw, FiShield, FiClock, FiCheck, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiStar, FiShoppingCart, FiMap, FiPhone, FiMail } from 'react-icons/fi';

// Données pour la page d'accueil
const featuredProducts = [
  {
    id: 1,
    name: 'Tomates',
    slug: 'tomates',
    price: 2500,
    description: 'Tomates fraîches cultivées localement',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 2,
    name: 'Laitue verte',
    slug: 'laitue-verte',
    price: 1800,
    description: 'Laitue fraîche et croquante',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 3,
    name: 'Chou kale',
    slug: 'chou-kale',
    price: 2200,
    description: 'Chou kale frais riche en nutriments',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 4,
    name: 'Carottes',
    slug: 'carottes',
    price: 2000,
    description: 'Carottes fraîches et croquantes',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1606355571730-90061eea1d56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 5,
    name: 'Poivrons colorés',
    slug: 'poivrons',
    price: 3000,
    description: 'Assortiment de poivrons colorés',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'legumes',
    is_organic: true,
  },
  {
    id: 6,
    name: 'Fraises',
    slug: 'fraises',
    price: 3500,
    description: 'Fraises fraîches et sucrées',
    images: [{ publicUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    category: 'fruits',
    is_organic: true,
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

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleConsentChange = () => {
    setIsConsentChecked(!isConsentChecked);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && isConsentChecked) {
      alert('Merci pour votre inscription à notre newsletter !');
      setEmail('');
      setIsConsentChecked(false);
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  };

  return (
    <div>
      <Head>
        <title>SAFEM - Produits Agricoles Bio du Gabon</title>
        <meta name="description" content="Découvrez les produits frais, bio et locaux de la ferme Safem au Gabon. Livraison à domicile ou retrait à la ferme." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon bg-primary text-white flex items-center justify-center rounded-full">S</div>
            <span>SAFEM</span>
          </Link>
          
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link href="/" className="navbar-link">Accueil</Link>
            </li>
            <li className="navbar-item">
              <Link href="/products" className="navbar-link">Produits</Link>
            </li>
            <li className="navbar-item">
              <Link href="/about" className="navbar-link">Notre Histoire</Link>
            </li>
            <li className="navbar-item">
              <Link href="/contact" className="navbar-link">Contact</Link>
            </li>
            <li className="navbar-item">
              <Link href="/cart" className="navbar-link relative inline-flex items-center">                
                <FiShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 bg-primary text-white text-xs font-bold rounded-full">0</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="grid grid-2">
              <div className="hero-content animate-fadeIn">
                <h1 className="hero-title">
                  Fresh. <br />
                  Organic. <br />
                  Sustainable.
                </h1>
                <p className="hero-subtitle">
                  Des produits bio cultivés avec passion au cœur du Gabon, livrés directement du producteur au consommateur.
                </p>
                <Link href="/products" className="btn btn-primary">
                  Découvrir nos produits
                  <FiArrowRight className="btn-icon" />
                </Link>
              </div>
              
              <div className="hero-image animate-fadeIn">
                <img 
                  src="https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Agriculture biologique au Gabon"
                  className="hero-img"
                />
                <div className="hero-shape hero-shape-1"></div>
                <div className="hero-shape hero-shape-2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Histoire de Safem */}
        <section className="section bg-gray-100">
          <div className="container">
            <div className="section-title">
              <h2>Notre Histoire</h2>
              <p>Découvrez comment notre passion pour l'agriculture durable a débuté</p>
            </div>
            
            <div className="grid grid-2">
              <div className="grid grid-2">
                <div className="card" style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Champ de culture biologique"
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card" style={{ height: '200px', marginTop: '20px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1552913898-063f608cb81c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Marché local au Gabon"
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card" style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1621809198702-cd229d5d40ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Agriculteur dans sa ferme"
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card" style={{ height: '200px', marginTop: '-20px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1623400518182-a9affa33a5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Produits biologiques locaux"
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              
              <div>
                <span className="badge">Notre Histoire</span>
                <h2>Mieux qu'un producteur : <br />votre partenaire de confiance</h2>
                
                <p>
                  Safem est née de la passion d'un groupe d'agriculteurs gabonais déterminés à produire des aliments sains, locaux et durables. 
                  Notre coopérative fondée en 2018 rassemble aujourd'hui plus de 30 producteurs qui partagent les mêmes valeurs : respect de la terre, circuits courts et qualité irréprochable.
                </p>
                
                <p>
                  Notre mission est simple : vous offrir le meilleur de la nature gabonaise tout en préservant notre patrimoine agricole pour les générations futures. Chaque produit que vous achetez chez Safem contribue à soutenir l'économie locale et des pratiques agricoles responsables.
                </p>
                
                <Link href="/about" className="link-with-arrow">
                  En savoir plus sur notre histoire <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nos meilleurs produits frais */}
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Our Freshest Picks</h2>
              <p>Découvrez notre sélection de produits frais récoltés cette semaine, directement de nos fermes à votre table</p>
            </div>
            
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="card product-card">
                  <div style={{ position: 'relative' }}>
                    <img
                      src={product.images[0]?.publicUrl}
                      alt={product.name}
                      className="card-img"
                    />
                    {product.is_organic && (
                      <span className="card-badge">BIO</span>
                    )}
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-price">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(product.price)}</p>
                    <div className="product-actions">
                      <Link href={`/products/${product.slug}`} className="btn btn-outline btn-sm">
                        Voir
                      </Link>
                      <button className="btn btn-primary btn-sm">
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <Link href="/products" className="btn btn-primary">
                Voir tous nos produits
                <FiArrowRight className="btn-icon" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Pourquoi choisir notre ferme biologique */}
        <section className="section bg-gray-100">
          <div className="container">
            <div className="section-title">
              <h2>Why Choose Our Organic Farm?</h2>
            </div>
            
            <div className="grid grid-2">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Ferme biologique au Gabon"
                  className="card-img"
                />
                <div className="card-overlay">
                  <div className="rating">
                    <FiStar className="rating-star" />
                    <span>4.9/5.0</span>
                    <small>+2800 Avis Clients</small>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="feature-card card">
                  <div className="feature-icon">
                    <FiCheck />
                  </div>
                  <h3>100% Bio Certifié</h3>
                  <p>Nos produits sont certifiés biologiques, sans pesticides ni produits chimiques.</p>
                </div>
                
                <div className="feature-card card">
                  <div className="feature-icon">
                    <FiTruck />
                  </div>
                  <h3>Ferme à Table</h3>
                  <p>Produits frais livrés directement de notre ferme à votre domicile.</p>
                </div>
                
                <div className="feature-card card">
                  <div className="feature-icon">
                    <FiShield />
                  </div>
                  <h3>Qualité Premium</h3>
                  <p>Nos produits sont sélectionnés avec soin pour une qualité exceptionnelle.</p>
                </div>
                
                <div className="feature-card card">
                  <div className="feature-icon">
                    <FiRefreshCw />
                  </div>
                  <h3>Agriculture Durable</h3>
                  <p>Nous pratiquons une agriculture respectueuse de l'environnement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Témoignages */}
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>What Our Customers Say</h2>
              <p>Découvrez les témoignages de nos clients satisfaits qui ont choisi nos produits bio gabonais</p>
            </div>
            
            <div className="grid grid-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card card">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < testimonial.rating ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="testimonial-avatar"
                    />
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="section bg-gray-100">
          <div className="container">
            <div className="grid grid-2">
              <div>
                <h2>Get Updates <br />& Offers</h2>
                <p>Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales et les dernières nouvelles de notre ferme biologique.</p>
                
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Votre adresse e-mail" 
                    className="form-control newsletter-input"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    S'inscrire
                  </button>
                </form>
                
                <div className="form-check mt-3">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    checked={isConsentChecked}
                    onChange={handleConsentChange}
                    className="form-check-input" 
                  />
                  <label htmlFor="consent" className="form-check-label">
                    J'accepte de recevoir des messages de Safem par e-mail
                  </label>
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="card" style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Légumes biologiques" 
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card" style={{ height: '200px', marginTop: '20px', overflow: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1595436275705-3fcf8bed5b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Produits biologiques" 
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card" style={{ gridColumn: 'span 2', height: '200px', marginTop: '-20px', overflow: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1470107355970-2ace9f20ab15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Fruits frais" 
                    className="card-img"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid grid-4">
            <div>
              <div className="footer-logo">
                <div className="navbar-logo">
                  <div className="navbar-logo-icon bg-primary text-white flex items-center justify-center rounded-full">S</div>
                  <span>SAFEM</span>
                </div>
              </div>
              <p>Produits biologiques frais du Gabon livrés directement du producteur au consommateur.</p>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <FiInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FiTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FiFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FiYoutube />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="footer-title">Contact Us</h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    <FiMap className="icon" /> Libreville, Gabon
                  </a>
                </li>
                <li>
                  <a href="tel:+24174589632" className="footer-link">
                    <FiPhone className="icon" /> +241 074 589 632
                  </a>
                </li>
                <li>
                  <a href="mailto:info@safem-gabon.com" className="footer-link">
                    <FiMail className="icon" /> info@safem-gabon.com
                  </a>
                </li>
                <li>
                  <span className="footer-link">
                    <FiClock className="icon" /> 9h - 17h, Lun - Sam
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Liens Utiles</h4>
              <ul className="footer-links">
                <li><Link href="/about" className="footer-link">Notre Histoire</Link></li>
                <li><Link href="/products" className="footer-link">Nos Produits</Link></li>
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Get In Touch</h4>
              <p>Des questions ou suggestions ? N'hésitez pas à nous contacter !</p>
              <Link href="/contact" className="btn btn-outline mt-3">
                Contactez-nous
              </Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Safem. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Styles spécifiques pour cette page */
        .badge {
          display: inline-block;
          background-color: rgba(46, 125, 50, 0.1);
          color: #2E7D32;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .link-with-arrow {
          display: inline-flex;
          align-items: center;
          color: #2E7D32;
          font-weight: 500;
          margin-top: 1rem;
          text-decoration: none;
        }
        
        .link-with-arrow svg {
          margin-left: 0.5rem;
        }
        
        .card-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .rating {
          display: flex;
          align-items: center;
        }
        
        .rating-star {
          color: #f9a825;
          margin-right: 0.25rem;
        }
        
        .rating span {
          color: #2E7D32;
          font-weight: 600;
          margin-right: 0.5rem;
        }
        
        .rating small {
          color: #757575;
          font-size: 0.75rem;
        }
        
        .stars {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .star-filled {
          color: #f9a825;
          margin-right: 0.25rem;
        }
        
        .star-empty {
          color: #e0e0e0;
          margin-right: 0.25rem;
        }
        
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .form-check {
          display: flex;
          align-items: center;
        }
        
        .form-check-input {
          margin-right: 0.5rem;
        }
        
        .form-check-label {
          font-size: 0.875rem;
          color: #757575;
        }
        
        .icon {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}
