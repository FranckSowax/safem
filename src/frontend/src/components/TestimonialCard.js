import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

/**
 * Carte de témoignage client
 * Affiche un avis client avec photo, note et citation
 */
const TestimonialCard = ({ testimonial }) => {
  const { name, role, quote, rating, image } = testimonial;

  // Génère les étoiles en fonction de la note
  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar 
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="bg-gray-50 rounded-card p-6 shadow-card">
      {/* En-tête avec photo et informations */}
      <div className="flex items-center mb-4">
        {/* Photo de profil */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
            alt={`Photo de ${name}`}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Nom et rôle */}
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      
      {/* Note en étoiles */}
      <div className="flex mb-3">
        {renderStars(rating)}
      </div>
      
      {/* Citation */}
      <blockquote className="italic text-gray-700">
        <span className="text-primary text-2xl font-serif leading-none">"</span>
        {quote}
        <span className="text-primary text-2xl font-serif leading-none">"</span>
      </blockquote>
    </div>
  );
};

export default TestimonialCard;
