import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';
import cartService from '../../services/cartService';

/**
 * Page de panier
 * Affiche les produits ajoutés au panier et permet de procéder au paiement
 */
export default function CartPage() {
  const router = useRouter();
  
  // État du panier
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Chargement des données du panier
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      
      try {
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        setError('Impossible de charger votre panier. Veuillez rafraîchir la page.');
        // Utiliser un panier vide en cas d'erreur
        setCart({ items: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);
  
  // Calcul des totaux
  const subtotal = cart.items.reduce((total, item) => total + (item.subtotal || 0), 0);
  const shipping = subtotal > 0 ? 1000 : 0; // Frais de livraison
  const discountAmount = cart.discountAmount || (cart.discount && cart.discountType === 'percentage' ? (subtotal * cart.discount) / 100 : cart.discount || 0);
  const total = subtotal + shipping - discountAmount;
  
  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    setError('');
    
    try {
      const updatedCart = await cartService.updateCartItem(productId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      setError('Impossible de mettre à jour la quantité. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Supprimer un produit du panier
  const removeFromCart = async (productId) => {
    setLoading(true);
    setError('');
    
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      setError('Impossible de supprimer le produit. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Vider le panier
  const clearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      setLoading(true);
      setError('');
      
      try {
        const emptyCart = await cartService.clearCart();
        setCart(emptyCart);
      } catch (error) {
        console.error('Erreur lors de la suppression du panier:', error);
        setError('Impossible de vider le panier. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Appliquer un code promo
  const applyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Veuillez entrer un code promo');
      return;
    }
    
    setLoading(true);
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const updatedCart = await cartService.applyCoupon(couponCode);
      setCart(updatedCart);
      setCouponSuccess(`Code promo ${couponCode.toUpperCase()} appliqué avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'application du code promo:', error);
      setCouponError(error.message || 'Code promo non valide');
    } finally {
      setLoading(false);
    }
  };
  
  // Procéder au paiement
  const proceedToCheckout = () => {
    if (cart.items.length === 0) return;
    
    // On sauvegarde l'état actuel du panier dans le localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('safem_cart_state', JSON.stringify(cart));
    }
    
    router.push('/checkout');
  };
  
  return (
    <MainLayout 
      title="Panier - Safem"
      description="Votre panier d'achat chez Safem."
    >
      <div className="container-custom py-10">
        <h1 className="text-3xl font-heading font-bold mb-8">Votre Panier</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiShoppingBag className="mx-auto text-gray-400 text-5xl mb-4" />
            <h2 className="text-xl font-heading font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Parcourez notre catalogue et ajoutez des produits à votre panier.</p>
            <Link href="/products" className="btn-primary py-3 px-6">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tableau des produits */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Produit</th>
                        <th className="py-4 px-4 text-center font-medium text-gray-600">Prix</th>
                        <th className="py-4 px-4 text-center font-medium text-gray-600">Quantité</th>
                        <th className="py-4 px-4 text-right font-medium text-gray-600">Sous-total</th>
                        <th className="py-4 px-4 text-center font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {cart.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={item.product.images[0]?.url || 'https://via.placeholder.com/100'}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <Link 
                                  href={`/products/${item.product.slug}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {formatPrice(item.price)}
                            <span className="text-sm text-gray-500 block">
                              / {item.product.unit}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 rounded-l border border-r-0 border-gray-300 hover:bg-gray-100"
                                aria-label="Diminuer la quantité"
                                disabled={loading}
                              >
                                <FiMinus size={16} />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-12 text-center py-1 border border-gray-300"
                                disabled={loading}
                              />
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 rounded-r border border-l-0 border-gray-300 hover:bg-gray-100"
                                aria-label="Augmenter la quantité"
                                disabled={loading}
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatPrice(item.subtotal)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Supprimer l'article"
                              disabled={loading}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Actions sur le panier */}
                <div className="p-4 border-t flex flex-wrap justify-between gap-4">
                  <Link 
                    href="/products" 
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <FiArrowLeft className="mr-2" />
                    Continuer vos achats
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-red-500"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>
            
            {/* Récapitulatif de commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif</h2>
                
                {/* Code promo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code promo
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Entrez votre code"
                      className="flex-grow rounded-l-button border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-primary hover:bg-primary-700 text-white rounded-r-button px-3 py-2"
                    >
                      Appliquer
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-1">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-600 text-sm mt-1">{couponSuccess}</p>
                  )}
                  {cart.discount > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                      {cart.discountType === 'percentage' 
                        ? `Code promo appliqué : -${cart.discount}%`
                        : `Code promo appliqué : -${formatPrice(cart.discount)}`
                      }
                    </p>
                  )}
                </div>
                
                {/* Détails des coûts */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                
                {/* Bouton de paiement */}
                <button
                  onClick={proceedToCheckout}
                  className="btn-primary py-3 w-full mt-6"
                  disabled={cart.length === 0}
                >
                  Procéder au paiement
                </button>
                
                {/* Informations supplémentaires */}
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">Modes de paiement acceptés :</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">Carte bancaire</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">Mobile Money</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">À la livraison</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
