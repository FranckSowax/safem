import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Head>
        <title>SAFEM - Produits Agricoles Bio du Gabon</title>
        <meta name="description" content="Découvrez les produits frais, bio et locaux de la ferme Safem au Gabon. Livraison à domicile ou retrait à la ferme." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32' }}>SAFEM</h1>
          </div>
          <nav>
            <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              <li><a href="/" style={{ color: '#2E7D32', textDecoration: 'none' }}>Accueil</a></li>
              <li><a href="/products" style={{ color: '#333', textDecoration: 'none' }}>Produits</a></li>
              <li><a href="/about" style={{ color: '#333', textDecoration: 'none' }}>Notre Histoire</a></li>
              <li><a href="/contact" style={{ color: '#333', textDecoration: 'none' }}>Contact</a></li>
              <li>
                <a href="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '0.5rem', color: '#333', textDecoration: 'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span style={{ position: 'absolute', top: '0', right: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', backgroundColor: '#2E7D32', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '9999px', transform: 'translate(50%, -25%)' }}>0</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                <div>Fresh.</div>
                <div>Organic.</div>
                <div>Sustainable.</div>
              </h1>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Des produits bio cultivés avec passion au cœur du Gabon, livrés directement du producteur au consommateur.
              </p>
              <div>
                <a href="/products" style={{ display: 'inline-block', backgroundColor: '#2E7D32', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                  Découvrir nos produits →
                </a>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Produits biologiques frais du Gabon" 
                style={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </section>

        {/* Notre Histoire Section */}
        <section style={{ padding: '4rem 0', backgroundColor: '#f7f7f7' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Notre Histoire</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1485637701894-09ad422f6de6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Ferme agricole au Gabon" 
                  style={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', height: 'auto' }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Découvrez comment notre passion pour l'agriculture durable a débuté</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Safem est née de la passion d'un groupe d'agriculteurs gabonais déterminés à produire des aliments sains, locaux et durables. 
                  Notre coopérative fondée en 2018 rassemble aujourd'hui plus de 30 producteurs qui partagent les mêmes valeurs : respect de la terre, circuits courts et qualité irréprochable.
                </p>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Notre mission est simple : vous offrir le meilleur de la nature gabonaise tout en préservant notre patrimoine agricole pour les générations futures. Chaque produit que vous achetez chez Safem contribue à soutenir l'économie locale et des pratiques agricoles responsables.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <a href="/about" style={{ color: '#2E7D32', textDecoration: 'none' }}>
                    En savoir plus sur notre histoire →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produits Section */}
        <section style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>Nos Produits Frais</h2>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '3rem' }}>Découvrez notre sélection de produits frais récoltés cette semaine, directement de nos fermes à votre table.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {/* Produit 1 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Tomates" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    BIO
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Tomates</h3>
                  <p style={{ color: '#2E7D32', fontWeight: 'bold' }}>2 500 FCFA</p>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href="/products/1" style={{ fontSize: '0.875rem', color: '#666', textDecoration: 'none' }}>
                      Voir le produit
                    </a>
                    <button style={{ backgroundColor: '#2E7D32', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Produit 2 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Laitue verte" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    BIO
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Laitue verte</h3>
                  <p style={{ color: '#2E7D32', fontWeight: 'bold' }}>1 800 FCFA</p>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href="/products/2" style={{ fontSize: '0.875rem', color: '#666', textDecoration: 'none' }}>
                      Voir le produit
                    </a>
                    <button style={{ backgroundColor: '#2E7D32', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Produit 3 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Chou kale" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    BIO
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Chou kale</h3>
                  <p style={{ color: '#2E7D32', fontWeight: 'bold' }}>2 200 FCFA</p>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href="/products/3" style={{ fontSize: '0.875rem', color: '#666', textDecoration: 'none' }}>
                      Voir le produit
                    </a>
                    <button style={{ backgroundColor: '#2E7D32', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Produit 4 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Poivrons colorés" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    BIO
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Poivrons colorés</h3>
                  <p style={{ color: '#2E7D32', fontWeight: 'bold' }}>3 000 FCFA</p>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href="/products/4" style={{ fontSize: '0.875rem', color: '#666', textDecoration: 'none' }}>
                      Voir le produit
                    </a>
                    <button style={{ backgroundColor: '#2E7D32', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <a href="/products" style={{ display: 'inline-block', backgroundColor: '#2E7D32', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
                Voir tous nos produits →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f7f7f7', padding: '2rem 0', marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #eaeaea' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} SAFEM - Tous droits réservés</p>
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>Libreville, Gabon | info@safem-gabon.com | +241 074 589 632</p>
        </div>
      </footer>
    </div>
  );
}
