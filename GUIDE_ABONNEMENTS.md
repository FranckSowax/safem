# 🥬 Guide d'utilisation - Abonnements SAFEM

## 🎯 Vue d'ensemble

Le système d'abonnements SAFEM permet aux clients de créer des paniers récurrents avec livraisons automatiques. Idéal pour les particuliers et les professionnels qui souhaitent recevoir régulièrement leurs produits bio préférés.

## ✨ Fonctionnalités principales

### 🛒 **Composition de panier personnalisé**
- Sélection parmi 21+ produits bio disponibles
- Ajustement automatique selon les stocks
- Calcul en temps réel des totaux
- Icônes visuelles par catégorie de produits

### 👥 **Types de clients**
- **Particulier** : Tarifs standards
- **Professionnel** : Remise automatique de 10%

### 📅 **Fréquences de livraison**
- **Hebdomadaire** : Livraison chaque semaine
- **Bi-hebdomadaire** : Livraison toutes les 2 semaines  
- **Mensuelle** : Livraison chaque mois

### 🚚 **Gestion des livraisons**
- Adresse de livraison personnalisée
- Créneaux horaires préférés
- Notes spéciales pour le livreur
- Historique complet des livraisons

## 🚀 Comment utiliser le système

### 1. **Accès à la page d'abonnements**
- Cliquer sur "Abonnements" dans le menu principal
- URL directe : `http://localhost:3000/abonnements`

### 2. **Étape 1 : Composer votre panier**
- Parcourir les produits disponibles
- Utiliser les boutons +/- pour ajuster les quantités
- Vérifier le stock disponible
- Consulter le résumé du panier en temps réel

### 3. **Étape 2 : Informations client**
- Renseigner nom, téléphone, email
- Choisir le type de client (particulier/pro)
- Saisir l'adresse de livraison complète
- Optionnel : heure préférée et notes

### 4. **Étape 3 : Configuration abonnement**
- Nommer votre abonnement
- Choisir la fréquence de livraison
- Vérifier le résumé complet
- Valider la remise pro si applicable

### 5. **Étape 4 : Confirmation**
- Validation de la création
- Calcul de la prochaine livraison
- Possibilité de créer un nouvel abonnement

## 🛠️ Configuration technique

### **Base de données Supabase**

#### Tables créées :
- `subscriptions` : Abonnements principaux
- `subscription_items` : Produits de chaque abonnement
- `subscription_deliveries` : Historique des livraisons
- `subscription_delivery_items` : Détails des produits livrés

#### Pour initialiser les tables :
1. Aller sur https://supabase.com/dashboard
2. Ouvrir votre projet SAFEM
3. Aller dans "SQL Editor"
4. Copier-coller le contenu de `database/subscriptions_schema.sql`
5. Exécuter le script

### **Services développés**

#### `SubscriptionsService.js`
- `getAvailableProducts()` : Récupère les produits en stock
- `createSubscription()` : Crée un nouvel abonnement
- `getSubscriptions()` : Liste les abonnements avec filtres
- `updateSubscriptionStatus()` : Modifie le statut
- `createDelivery()` : Génère une livraison
- `getSubscriptionStats()` : Statistiques globales

## 📊 Données et statistiques

### **Produits disponibles**
- 21 produits bio synchronisés avec Supabase
- Gestion automatique des stocks
- Catégories : Légumes Fruits, Légumes Feuilles, Épices, etc.
- Prix en FCFA avec unités (kg, pièce)

### **Calculs automatiques**
- Sous-total du panier
- Remise professionnelle (-10%)
- Total final par livraison
- Prochaine date de livraison

### **Suivi des abonnements**
- Statuts : actif, en pause, annulé, en attente
- Historique complet des livraisons
- Évaluations et feedback clients
- Gestion des substitutions de produits

## 🎨 Interface utilisateur

### **Design moderne et responsive**
- Interface en 4 étapes guidées
- Indicateur de progression visuel
- Messages d'erreur et de succès
- Optimisé mobile et desktop

### **Couleurs et thème SAFEM**
- Vert principal : #2E7D32
- Design cohérent avec le reste du site
- Icônes intuitives et emojis produits

## 🔧 Fonctionnalités avancées

### **Gestion des stocks**
- Vérification en temps réel de la disponibilité
- Limitation des quantités selon le stock
- Produits de substitution automatiques

### **Système de notifications**
- Confirmation de création d'abonnement
- Rappels de livraison
- Alertes de stock faible

### **Rapports et analytics**
- Statistiques par type de client
- Fréquences de livraison populaires
- Revenus récurrents générés
- Produits les plus demandés en abonnement

## 🚀 Prochaines améliorations possibles

### **Fonctionnalités futures**
- Gestion des paiements récurrents
- Application mobile dédiée
- Système de parrainage
- Abonnements saisonniers
- Intégration avec système de livraison GPS

### **Optimisations techniques**
- Cache Redis pour les performances
- Notifications push en temps réel
- API REST complète pour intégrations
- Dashboard administrateur avancé

## 📞 Support et maintenance

### **Logs et debugging**
- Console navigateur pour les erreurs frontend
- Logs Supabase pour les opérations base de données
- Script de test : `database/setup_subscriptions.js`

### **Dépannage courant**
- Vérifier la connexion Supabase (.env.local)
- S'assurer que les tables sont créées
- Contrôler les stocks des produits
- Valider les formats d'email et téléphone

---

## 🎉 Conclusion

Le système d'abonnements SAFEM est maintenant opérationnel et prêt pour la production. Il offre une expérience utilisateur moderne et intuitive tout en étant entièrement synchronisé avec Supabase pour une gestion robuste des données.

**Testez dès maintenant sur : http://localhost:3000/abonnements** 🚀
