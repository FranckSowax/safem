# 🗺️ Cartes avec Géolocalisation SAFEM

## 📍 Vue d'ensemble

Le système SAFEM intègre maintenant des cartes interactives Google Maps avec géolocalisation pour améliorer l'expérience utilisateur lors des commandes et pour visualiser les données dans le dashboard.

## 🔑 Clé API Publique

**Clé API utilisée :** `AIzaSyBFw0Qbyq9zTFTd-tUOUoNhXr6vHPlHDvw`

⚠️ **Important :** Cette clé est configurée avec des restrictions de domaine pour la sécurité. Elle fonctionne uniquement sur les domaines autorisés.

## 🛠️ Composants Créés

### 1. InteractiveMap (`/components/InteractiveMap.js`)

**Fonctionnalités :**
- ✅ Carte Google Maps interactive
- ✅ Géolocalisation automatique
- ✅ Clic sur la carte pour choisir une position
- ✅ Marqueur personnalisé SAFEM (vert)
- ✅ InfoWindow avec détails de position
- ✅ Boutons de contrôle (Ma position, Ouvrir dans Google Maps)
- ✅ Géocodage inverse (coordonnées → adresse)
- ✅ Gestion d'erreurs complète

**Utilisation :**
```jsx
import InteractiveMap from '../components/InteractiveMap';

<InteractiveMap
  latitude={location.latitude}
  longitude={location.longitude}
  address={location.address}
  onLocationChange={handleLocationChange}
  height="300px"
  showControls={true}
/>
```

### 2. OrdersMap (`/components/dashboard/OrdersMap.js`)

**Fonctionnalités :**
- ✅ Visualisation des commandes sur carte
- ✅ Marqueurs colorés selon statut de commande
- ✅ InfoWindow détaillée pour chaque commande
- ✅ Statistiques en temps réel
- ✅ Légende des statuts
- ✅ Zoom automatique sur les commandes
- ✅ Liens vers Google Maps

**Statuts des commandes :**
- 🟡 **En attente** (pending) - Jaune
- 🔵 **En cours** (processing) - Bleu  
- 🟣 **Expédiées** (shipped) - Violet
- 🟢 **Livrées** (delivered) - Vert
- 🔴 **Annulées** (cancelled) - Rouge

## 📱 Intégration Pages

### Page Cart (`/pages/cart.js`)

**Améliorations apportées :**
- ✅ Remplacement de la géolocalisation basique par carte interactive
- ✅ Fonction `handleLocationChange` pour gérer les changements de position
- ✅ Instructions utilisateur pour utiliser la carte
- ✅ Validation de position avant commande

**Fonctionnalités utilisateur :**
1. **Géolocalisation automatique** : Bouton "Ma position"
2. **Sélection manuelle** : Clic sur la carte
3. **Confirmation visuelle** : Marqueur et adresse affichés
4. **Lien Google Maps** : Pour navigation externe

### Dashboard (Prêt pour intégration)

Le composant `OrdersMap` peut être intégré dans le dashboard pour :
- Visualiser toutes les commandes géolocalisées
- Analyser la répartition géographique
- Optimiser les tournées de livraison
- Identifier les zones de forte demande

## 🌍 Configuration Géographique

### Centre par défaut : Libreville, Gabon
- **Latitude :** 0.4162
- **Longitude :** 9.4673
- **Zoom initial :** 11 (vue ville)
- **Zoom commande :** 15 (vue quartier)

### Fonctionnalités de géolocalisation
- **Précision élevée** : `enableHighAccuracy: true`
- **Timeout :** 10 secondes
- **Cache :** 5 minutes (`maximumAge: 300000`)

## 🎨 Personnalisation SAFEM

### Marqueurs personnalisés
- **Couleur principale :** Vert SAFEM (#16a34a)
- **Icône :** SVG personnalisé avec logo
- **Taille :** 32x32 pixels
- **Anchor :** Centré en bas

### Styles de carte
- **POI masqués** : Points d'intérêt cachés pour clarté
- **Transit masqué** : Lignes de transport cachées
- **Contrôles :** Zoom + Plein écran uniquement

## 🔧 Gestion d'erreurs

### Types d'erreurs gérées
1. **PERMISSION_DENIED** : Géolocalisation refusée
2. **POSITION_UNAVAILABLE** : Position indisponible
3. **TIMEOUT** : Délai dépassé
4. **API_ERROR** : Erreur Google Maps API

### Fallbacks
- Carte centrée sur Libreville si pas de position
- Messages d'erreur explicites en français
- Interface dégradée mais fonctionnelle

## 📊 Données requises

### Pour InteractiveMap
```javascript
{
  latitude: number,    // Latitude (optionnel)
  longitude: number,   // Longitude (optionnel)
  address: string,     // Adresse formatée (optionnel)
  onLocationChange: function, // Callback changement position
  height: string,      // Hauteur carte (défaut: "300px")
  showControls: boolean // Afficher contrôles (défaut: true)
}
```

### Pour OrdersMap
```javascript
{
  orders: [
    {
      id: string,
      client_name: string,
      client_phone: string,
      quartier: string,
      latitude: number,
      longitude: number,
      address_formatted: string,
      total_amount: number,
      order_date: string,
      status: string, // pending|processing|shipped|delivered|cancelled
      notes: string
    }
  ],
  height: string // Hauteur carte (défaut: "400px")
}
```

## 🚀 Déploiement

### Variables d'environnement
Aucune variable d'environnement requise - la clé API est intégrée dans le code.

### Restrictions de sécurité
La clé API est configurée avec :
- Restrictions de domaine
- Limitations d'usage
- APIs autorisées : Maps JavaScript API, Geocoding API

## 🎯 Prochaines étapes

### Améliorations possibles
1. **Calcul d'itinéraires** : Intégrer Directions API
2. **Zones de livraison** : Définir des polygones de livraison
3. **Optimisation tournées** : Algorithme de routage
4. **Heatmap** : Visualisation densité commandes
5. **Clustering** : Regroupement marqueurs proches

### Intégrations dashboard
1. **Module géolocalisation** : Nouveau module dashboard
2. **Analytics géographiques** : Statistiques par zone
3. **Gestion livreurs** : Suivi en temps réel
4. **Rapports géographiques** : Export données géolocalisées

## 📞 Support

Pour toute question sur l'implémentation des cartes :
- Vérifier la console navigateur pour erreurs API
- Tester la géolocalisation sur HTTPS uniquement
- Valider les restrictions de domaine de la clé API

---

**🌟 Les cartes interactives SAFEM sont maintenant opérationnelles avec géolocalisation complète !**
