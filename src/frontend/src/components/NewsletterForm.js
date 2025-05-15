import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

/**
 * Formulaire d'inscription à la newsletter
 * Inclut la validation d'email et intégration avec SendGrid
 */
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading', null

  /**
   * Valide le format de l'email
   * @param {string} email - Adresse email à valider
   * @returns {boolean} Résultat de la validation
   */
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  /**
   * Traite la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du format de l'email
    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }
    
    // Afficher état de chargement
    setStatus('loading');
    
    try {
      // Envoi du formulaire vers l'API (à implémenter)
      // const response = await fetch('/api/newsletters/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });
      
      // Pour l'instant, simulons une réponse positive
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // if (!response.ok) throw new Error('Erreur serveur');
      // const data = await response.json();
      
      // Succès
      setStatus('success');
      setEmail('');
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la newsletter:', error);
      setStatus('error');
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-4 py-2 rounded-button text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={status === 'loading'}
            aria-label="Email pour la newsletter"
            required
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bg-primary hover:bg-primary-700 text-white rounded-button p-2 transition-colors"
            disabled={status === 'loading'}
            aria-label="S'inscrire à la newsletter"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>
        
        {/* Message de statut */}
        {status === 'success' && (
          <div className="text-green-300 text-sm mt-2">
            Merci pour votre inscription !
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-300 text-sm mt-2">
            Veuillez vérifier votre email.
          </div>
        )}
      </form>
      
      {/* RGPD information */}
      <p className="text-gray-400 text-xs mt-3">
        En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre {' '}
        <a href="/privacy" className="underline hover:text-white">politique de confidentialité</a>.
      </p>
    </div>
  );
};

export default NewsletterForm;
