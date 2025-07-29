import React, { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiNavigation, FiExternalLink } from 'react-icons/fi';

/**
 * Composant de carte interactive Google Maps pour SAFEM
 * Utilise une clé API publique pour afficher la carte avec géolocalisation
 */
const InteractiveMap = ({ 
  latitude, 
  longitude, 
  address, 
  onLocationChange,
  height = '300px',
  showControls = true 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Clé API publique Google Maps (limitée aux domaines autorisés)
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUOUoNhXr6vHPlHDvw';

  // Charger l'API Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError('Erreur lors du chargement de Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !latitude || !longitude) return;

    try {
      // Configuration de la carte centrée sur Libreville, Gabon par défaut
      const defaultCenter = { lat: 0.4162, lng: 9.4673 }; // Libreville
      const center = latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: latitude && longitude ? 15 : 11,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(mapInstance);

      // Ajouter un marqueur si on a des coordonnées
      if (latitude && longitude) {
        const markerInstance = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          title: 'Position de livraison SAFEM',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#16a34a" stroke="white" stroke-width="2"/>
                <path d="M16 8L20 14H12L16 8Z" fill="white"/>
                <circle cx="16" cy="18" r="2" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        setMarker(markerInstance);

        // InfoWindow avec informations
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; color: #16a34a; font-size: 14px; font-weight: 600;">
                📍 Position de livraison SAFEM
              </h3>
              <p style="margin: 0; font-size: 12px; color: #666;">
                ${address || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`}
              </p>
              <div style="margin-top: 8px;">
                <a href="https://www.google.com/maps?q=${latitude},${longitude}" 
                   target="_blank" 
                   style="color: #16a34a; text-decoration: none; font-size: 12px;">
                  🗺️ Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          `
        });

        markerInstance.addListener('click', () => {
          infoWindow.open(mapInstance, markerInstance);
        });

        // Ouvrir l'InfoWindow automatiquement
        setTimeout(() => {
          infoWindow.open(mapInstance, markerInstance);
        }, 500);
      }

      // Permettre de cliquer sur la carte pour changer la position
      if (onLocationChange) {
        mapInstance.addListener('click', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          
          // Géocodage inverse pour obtenir l'adresse
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: newLat, lng: newLng } },
            (results, status) => {
              if (status === 'OK' && results[0]) {
                onLocationChange({
                  latitude: newLat,
                  longitude: newLng,
                  address: results[0].formatted_address
                });
              } else {
                onLocationChange({
                  latitude: newLat,
                  longitude: newLng,
                  address: `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`
                });
              }
            }
          );
        });
      }

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError('Erreur lors de l\'initialisation de la carte');
    }
  }, [isLoaded, latitude, longitude, address, onLocationChange]);

  // Fonction pour obtenir la position actuelle
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par ce navigateur');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        
        if (onLocationChange) {
          // Géocodage inverse pour obtenir l'adresse
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === 'OK' && results[0]) {
                onLocationChange({
                  latitude: lat,
                  longitude: lng,
                  address: results[0].formatted_address
                });
              } else {
                onLocationChange({
                  latitude: lat,
                  longitude: lng,
                  address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                });
              }
            }
          );
        }
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Autorisation de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé';
            break;
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FiMapPin className="mx-auto text-red-500 mb-2" size={24} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Chargement de la carte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carte Google Maps */}
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-300 overflow-hidden"
      />
      
      {/* Contrôles personnalisés */}
      {showControls && (
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {/* Bouton Ma Position */}
          <button
            onClick={getCurrentLocation}
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-2 shadow-sm transition-colors"
            title="Ma position actuelle"
          >
            <FiNavigation className="text-green-600" size={16} />
          </button>
          
          {/* Lien Google Maps */}
          {latitude && longitude && (
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-2 shadow-sm transition-colors"
              title="Ouvrir dans Google Maps"
            >
              <FiExternalLink className="text-blue-600" size={16} />
            </a>
          )}
        </div>
      )}
      
      {/* Informations de position */}
      {latitude && longitude && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <FiMapPin className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-green-900">Position confirmée</p>
              <p className="text-xs text-green-700 mt-1">
                {address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
