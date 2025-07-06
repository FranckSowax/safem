import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import { FiChevronRight, FiCheck, FiInfo } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Page de paiement (checkout)
 * Permet à l'utilisateur de finaliser sa commande en renseignant ses informations
 * et en choisissant un mode de paiement
 */
export default function CheckoutPage() {
  const router = useRouter();
  
  // États pour les informations du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    saveInfo: false,
    notes: ''
  });
  
  // État pour le récapitulatif de la commande
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });
  
  // États pour la validation et l'envoi du formulaire
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Chargement des données du panier
  useEffect(() => {
    // Dans une implémentation réelle, nous récupérerions ces données depuis le panier
    const sampleCartItems = [
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
    ];
    
    const subtotal = sampleCartItems.reduce((total, item) => total + item.subtotal, 0);
    const shipping = 1000; // Frais de livraison standard
    const discount = 0; // Pas de remise par défaut
    const total = subtotal + shipping - discount;
    
    setOrderSummary({
      items: sampleCartItems,
      subtotal,
      shipping,
      discount,
      total
    });
  }, []);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: val });
    
    // Si le champ avait une erreur, on la supprime
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Mise à jour des frais de livraison en fonction de la méthode choisie
    if (name === 'deliveryMethod') {
      const shipping = value === 'express' ? 2000 : 1000;
      setOrderSummary({
        ...orderSummary,
        shipping,
        total: orderSummary.subtotal + shipping - orderSummary.discount
      });
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    
    // Vérifier les champs obligatoires
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Ce champ est obligatoire';
      }
    });
    
    // Validation de l'email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Adresse email invalide';
    }
    
    // Validation du téléphone
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Passer à l'étape suivante
  const goToNextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };
  
  // Retourner à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi des données à l'API
      console.log('Envoi des données:', { formData, orderSummary });
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Rediriger vers la page de confirmation
      router.push('/checkout/confirmation');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      alert('Une erreur est survenue lors de la validation de votre commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout 
      title="Paiement - Safem"
      description="Finalisez votre commande chez Safem."
    >
      {/* Fil d'Ariane */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container-custom">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Accueil</Link>
            <FiChevronRight className="mx-2 text-gray-400" />
            <Link href="/cart" className="text-gray-500 hover:text-primary">Panier</Link>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className="text-primary font-medium">Paiement</span>
          </div>
        </div>
      </div>
      
      {/* Étapes du processus d'achat */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex justify-center">
            <div className="relative flex items-center w-full max-w-2xl">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > 1 ? <FiCheck /> : <span>1</span>}
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > 2 ? <FiCheck /> : <span>2</span>}
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
                <span>3</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="relative flex text-sm text-gray-600 w-full max-w-2xl">
              <div className={`flex-1 text-center ${currentStep === 1 ? 'text-primary font-medium' : ''}`}>
                Livraison
              </div>
              <div className={`flex-1 text-center ${currentStep === 2 ? 'text-primary font-medium' : ''}`}>
                Paiement
              </div>
              <div className="flex-1 text-center">
                Confirmation
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Étape 1: Informations de livraison */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-heading font-semibold mb-6">Informations de livraison</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-button ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-button ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-button ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-button ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-button ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-button ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-button"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Mode de livraison</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-button cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="standard"
                          checked={formData.deliveryMethod === 'standard'}
                          onChange={handleChange}
                          className="text-primary"
                        />
                        <div className="ml-3">
                          <div className="font-medium">Livraison standard</div>
                          <div className="text-sm text-gray-500">
                            3-5 jours ouvrés - {formatPrice(1000)}
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 border rounded-button cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="express"
                          checked={formData.deliveryMethod === 'express'}
                          onChange={handleChange}
                          className="text-primary"
                        />
                        <div className="ml-3">
                          <div className="font-medium">Livraison express</div>
                          <div className="text-sm text-gray-500">
                            1-2 jours ouvrés - {formatPrice(2000)}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions de livraison (facultatif)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Instructions particulières pour la livraison..."
                      className="w-full p-2 border border-gray-300 rounded-button"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="form-checkbox text-primary h-5 w-5"
                      />
                      <span className="ml-2 text-sm">
                        Enregistrer ces informations pour mes prochaines commandes
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link href="/cart" className="btn-secondary">
                      Retour au panier
                    </Link>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="btn-primary py-2 px-6"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}
              
              {/* Étape 2: Mode de paiement */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-heading font-semibold mb-6">Mode de paiement</h2>
                  
                  <div className="mb-6">
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-button cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleChange}
                          className="text-primary"
                        />
                        <div className="ml-3">
                          <div className="font-medium">Carte bancaire</div>
                          <div className="text-sm text-gray-500">
                            Visa, Mastercard, American Express
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 border rounded-button cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mobile"
                          checked={formData.paymentMethod === 'mobile'}
                          onChange={handleChange}
                          className="text-primary"
                        />
                        <div className="ml-3">
                          <div className="font-medium">Mobile Money</div>
                          <div className="text-sm text-gray-500">
                            Airtel Money, Orange Money
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 border rounded-button cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="delivery"
                          checked={formData.paymentMethod === 'delivery'}
                          onChange={handleChange}
                          className="text-primary"
                        />
                        <div className="ml-3">
                          <div className="font-medium">Paiement à la livraison</div>
                          <div className="text-sm text-gray-500">
                            Payez en espèces à la réception de votre commande
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Sécurité de paiement */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <FiInfo className="text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-green-800">Paiement sécurisé</h4>
                        <p className="text-sm text-green-700">
                          Toutes vos informations sont protégées. Les paiements sont sécurisés 
                          avec le protocole SSL.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="btn-secondary"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="btn-primary py-2 px-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif de la commande</h2>
              
              {/* Liste des produits */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-gray-500 mb-3">ARTICLES ({orderSummary.items.length})</h3>
                <ul className="divide-y">
                  {orderSummary.items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
                      </div>
                      <div className="font-medium text-right">
                        {formatPrice(item.subtotal)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Détails des coûts */}
              <div className="border-t pt-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span>{formatPrice(orderSummary.shipping)}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise</span>
                      <span>-{formatPrice(orderSummary.discount)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(orderSummary.total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  TVA incluse le cas échéant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
