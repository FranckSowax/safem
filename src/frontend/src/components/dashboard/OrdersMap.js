import React, { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiPackage, FiTruck, FiUsers } from 'react-icons/fi';

/**
 * Composant de carte pour visualiser les commandes SAFEM dans le dashboard
 * Affiche les commandes avec géolocalisation sur une carte Google Maps
 */
const OrdersMap = ({ orders = [], height = '400px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Clé API publique Google Maps
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
  }, []);

  // Initialiser la carte et les marqueurs
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      // Centre sur Libreville, Gabon
      const center = { lat: 0.4162, lng: 9.4673 };

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
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

      // Ajouter les marqueurs pour chaque commande
      const newMarkers = [];
      const bounds = new window.google.maps.LatLngBounds();

      orders.forEach((order, index) => {
        if (order.latitude && order.longitude) {
          const position = { lat: order.latitude, lng: order.longitude };
          
          // Couleur selon le statut de la commande
          let color = '#16a34a'; // vert par défaut
          let icon = '📦';
          
          switch (order.status) {
            case 'pending':
              color = '#f59e0b';
              icon = '⏳';
              break;
            case 'processing':
              color = '#3b82f6';
              icon = '🔄';
              break;
            case 'shipped':
              color = '#8b5cf6';
              icon = '🚚';
              break;
            case 'delivered':
              color = '#16a34a';
              icon = '✅';
              break;
            case 'cancelled':
              color = '#ef4444';
              icon = '❌';
              break;
          }

          const marker = new window.google.maps.Marker({
            position: position,
            map: mapInstance,
            title: `Commande #${order.id?.slice(0, 8)} - ${order.client_name}`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${icon}</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32)
            }
          });

          // InfoWindow avec détails de la commande
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; font-family: system-ui; max-width: 300px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 16px; margin-right: 8px;">${icon}</span>
                  <h3 style="margin: 0; color: ${color}; font-size: 14px; font-weight: 600;">
                    Commande #${order.id?.slice(0, 8)}
                  </h3>
                </div>
                
                <div style="margin-bottom: 8px;">
                  <p style="margin: 0; font-size: 13px; color: #333;">
                    <strong>Client:</strong> ${order.client_name}
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #333;">
                    <strong>Téléphone:</strong> ${order.client_phone}
                  </p>
                </div>
                
                <div style="margin-bottom: 8px;">
                  <p style="margin: 0; font-size: 13px; color: #333;">
                    <strong>Quartier:</strong> ${order.quartier}
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                    ${order.address_formatted || `${order.latitude?.toFixed(6)}, ${order.longitude?.toFixed(6)}`}
                  </p>
                </div>
                
                <div style="margin-bottom: 8px;">
                  <p style="margin: 0; font-size: 13px; color: #333;">
                    <strong>Total:</strong> <span style="color: ${color}; font-weight: 600;">${order.total_amount?.toLocaleString('fr-FR')} FCFA</span>
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                    ${new Date(order.order_date).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                ${order.notes ? `
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                      <strong>Notes:</strong> ${order.notes}
                    </p>
                  </div>
                ` : ''}
                
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <a href="https://www.google.com/maps?q=${order.latitude},${order.longitude}" 
                     target="_blank" 
                     style="color: ${color}; text-decoration: none; font-size: 12px;">
                    🗺️ Ouvrir dans Google Maps
                  </a>
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            // Fermer les autres InfoWindows
            markers.forEach(m => {
              if (m.infoWindow) {
                m.infoWindow.close();
              }
            });
            
            infoWindow.open(mapInstance, marker);
            setSelectedOrder(order);
          });

          newMarkers.push({ marker, infoWindow, order });
          bounds.extend(position);
        }
      });

      setMarkers(newMarkers);

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMarkers.length > 0) {
        mapInstance.fitBounds(bounds);
        
        // Éviter un zoom trop important pour une seule commande
        const listener = window.google.maps.event.addListener(mapInstance, 'idle', () => {
          if (mapInstance.getZoom() > 16) {
            mapInstance.setZoom(16);
          }
          window.google.maps.event.removeListener(listener);
        });
      }

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError('Erreur lors de l\'initialisation de la carte');
    }
  }, [isLoaded, orders]);

  // Statistiques des commandes
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
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
            <p className="text-gray-500 text-sm">Chargement de la carte des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* En-tête avec statistiques */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiMapPin className="mr-2 text-green-600" />
            Carte des Commandes
          </h3>
          <span className="text-sm text-gray-500">
            {stats.total} commande{stats.total > 1 ? 's' : ''} géolocalisée{stats.total > 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Légende des statuts */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>En attente ({stats.pending})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>En cours ({stats.processing})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Expédiées ({stats.shipped})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Livrées ({stats.delivered})</span>
          </div>
          {stats.cancelled > 0 && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>Annulées ({stats.cancelled})</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Carte */}
      <div 
        ref={mapRef} 
        style={{ height: `calc(${height} - 100px)`, width: '100%' }}
      />
      
      {/* Informations sur la commande sélectionnée */}
      {selectedOrder && (
        <div className="p-3 bg-green-50 border-t border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiPackage className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-900">
                Commande #{selectedOrder.id?.slice(0, 8)} sélectionnée
              </span>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersMap;
