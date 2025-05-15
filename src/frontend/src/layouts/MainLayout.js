import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Layout principal de l'application
 * Contient l'en-tête, le pied de page et la structure commune à toutes les pages
 */
const MainLayout = ({ children, title = 'Safem - Produits bio du Gabon', description = 'Découvrez les produits bio et locaux de la ferme Safem au Gabon' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <div className="container-custom py-8">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
