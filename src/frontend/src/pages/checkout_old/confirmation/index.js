import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../../layouts/MainLayout';
import { FiCheck, FiDownload, FiArrowRight, FiHome, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';

/**
 * Page de confirmation de commande
 * Affiche les détails de la commande qui vient d'être passée
 */
export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query;
  
  // État pour les informations de la commande
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Charger les détails de la commande
  useEffect(() => {
    if (!router.isReady) return;
    
    // Dans une implémentation réelle, nous récupérerions les données de la commande
    // depuis l'API en utilisant l'orderId
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données fictives de commande
        const sampleOrder = {
          id: orderId || 'SAFEM-' + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toISOString(),
          status: 'confirmed',
          customer: {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '+241 77 12 34 56'
          },
          shipping: {
            address: '123 Avenue des Palmiers',
            city: 'Libreville',
            postalCode: '',
            method: 'standard',
            cost: 1000
          },
          payment: {
            method: 'card',
            last4: '4242',
            status: 'paid'
          },
          items: [
            {
              id: '1',
              name: 'Tomates Bio',
              quantity: 2,
              price: 1500,
              subtotal: 3000
            },
            {
              id: '2',
              name: 'Panier de Légumes',
              quantity: 1,
              price: 8000,
              subtotal: 8000
            }
          ],
          subtotal: 11000,
          discount: 0,
          total: 12000,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setOrderDetails(sampleOrder);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la commande:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [router.isReady, orderId]);
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater l'heure
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
  };
  
  return (
    <MainLayout
      title="Confirmation de commande - Safem"
      description="Votre commande a été confirmée avec succès."
    >
      <div className="bg-primary/10 py-10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheck className="text-green-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Merci pour votre commande!</h1>
            <p className="text-gray-600 mb-6">
              Votre commande a été traitée avec succès. Un email de confirmation vous a été envoyé.
            </p>
            
            {orderDetails && (
              <div className="inline-block bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="text-gray-600">
                  Commande <span className="font-semibold text-gray-800">#{orderDetails.id}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : orderDetails ? (
          <div className="max-w-4xl mx-auto">
            {/* Statut de la commande */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="font-heading font-semibold text-lg mb-1">État de la commande</h2>
                  <p className="text-green-600 flex items-center">
                    <FiCheck className="mr-1" /> Confirmée
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600">Date de la commande</div>
                  <div className="font-medium">
                    {formatDate(orderDetails.date)} à {formatTime(orderDetails.date)}
                  </div>
                </div>
                
                <button className="btn-secondary flex items-center">
                  <FiDownload className="mr-2" />
                  Télécharger la facture
                </button>
              </div>
            </div>
            
            {/* Informations de livraison estimée */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h2 className="font-heading font-semibold text-lg mb-4">Livraison estimée</h2>
                  <p className="text-lg font-medium text-gray-800 mb-1">
                    {formatDate(orderDetails.estimatedDelivery)}
                  </p>
                  <p className="text-gray-600">
                    {orderDetails.shipping.method === 'express' ? 'Livraison express' : 'Livraison standard'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Adresse de livraison</h3>
                  <p className="text-gray-700 mb-1">{orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
                  <p className="text-gray-700 mb-1">{orderDetails.shipping.address}</p>
                  <p className="text-gray-700 mb-1">{orderDetails.shipping.city} {orderDetails.shipping.postalCode}</p>
                  <p className="text-gray-700">{orderDetails.customer.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Détails de la commande */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-heading font-semibold text-lg mb-0">Détails de la commande</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="py-4 px-6 font-medium text-gray-600">Produit</th>
                      <th className="py-4 px-6 font-medium text-gray-600 text-center">Quantité</th>
                      <th className="py-4 px-6 font-medium text-gray-600 text-right">Prix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderDetails.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium">{item.name}</div>
                        </td>
                        <td className="py-4 px-6 text-center">{item.quantity}</td>
                        <td className="py-4 px-6 text-right">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col items-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span>{formatPrice(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frais de livraison</span>
                      <span>{formatPrice(orderDetails.shipping.cost)}</span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise</span>
                        <span>-{formatPrice(orderDetails.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatPrice(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informations de paiement */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Informations de paiement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Méthode de paiement</h3>
                  {orderDetails.payment.method === 'card' && (
                    <p className="text-gray-700">
                      Carte bancaire (se terminant par {orderDetails.payment.last4})
                    </p>
                  )}
                  {orderDetails.payment.method === 'mobile' && (
                    <p className="text-gray-700">
                      Mobile Money
                    </p>
                  )}
                  {orderDetails.payment.method === 'delivery' && (
                    <p className="text-gray-700">
                      Paiement à la livraison
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Statut du paiement</h3>
                  {orderDetails.payment.status === 'paid' ? (
                    <p className="text-green-600 flex items-center">
                      <FiCheck className="mr-1" /> Payé
                    </p>
                  ) : orderDetails.payment.method === 'delivery' ? (
                    <p className="text-orange-600">
                      À payer à la livraison
                    </p>
                  ) : (
                    <p className="text-red-600">
                      En attente de paiement
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-secondary flex-1 py-3 flex items-center justify-center">
                <FiHome className="mr-2" />
                Retour à l'accueil
              </Link>
              <Link href="/products" className="btn-primary flex-1 py-3 flex items-center justify-center">
                <FiShoppingBag className="mr-2" />
                Continuer vos achats
              </Link>
            </div>
            
            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="font-heading font-semibold text-lg mb-6 text-center">
                Vous pourriez aussi aimer
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Produits suggérés */}
                <Link href="/products/ananas-bio" className="group">
                  <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Ananas Bio" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Ananas Bio</h3>
                  <p className="text-primary text-sm font-semibold">{formatPrice(3000)}</p>
                </Link>
                
                <Link href="/products/mangue-bio" className="group">
                  <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Mangue Bio" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Mangue Bio</h3>
                  <p className="text-primary text-sm font-semibold">{formatPrice(2500)}</p>
                </Link>
                
                <Link href="/products/avocat-bio" className="group">
                  <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1519162808019-7de1f919b24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Avocat Bio" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Avocat Bio</h3>
                  <p className="text-primary text-sm font-semibold">{formatPrice(1800)}</p>
                </Link>
                
                <Link href="/products/bananes-bio" className="group">
                  <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1566393028639-d108a42c46a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Bananes Bio" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Bananes Bio</h3>
                  <p className="text-primary text-sm font-semibold">{formatPrice(1200)}</p>
                </Link>
              </div>
              
              <div className="text-center mt-6">
                <Link 
                  href="/products" 
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Voir tous nos produits 
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-heading font-semibold mb-2">
              Commande non trouvée
            </h2>
            <p className="text-gray-600 mb-6">
              Nous n'avons pas pu trouver les détails de votre commande.
            </p>
            <Link href="/" className="btn-primary py-2 px-6">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
