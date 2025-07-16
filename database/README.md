# Configuration Base de Données SAFEM

## 🗄️ Supabase Setup

### 1. Création du Projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé API anonyme

### 2. Configuration des Variables d'Environnement

Créer un fichier `.env.local` dans `/src/frontend/` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### 3. Exécution des Migrations

Copier et exécuter le contenu de `migrations/001_create_sales_tables.sql` dans l'éditeur SQL de Supabase.

## 📊 Structure de la Base de Données

### Tables Principales

#### `clients`
- `id` (UUID) - Identifiant unique
- `name` (VARCHAR) - Nom du client
- `phone` (VARCHAR) - Numéro de téléphone
- `email` (VARCHAR) - Email (optionnel)
- `address` (TEXT) - Adresse (optionnel)

#### `products`
- `id` (SERIAL) - Identifiant produit
- `name` (VARCHAR) - Nom du produit
- `variety` (VARCHAR) - Variété
- `price` (DECIMAL) - Prix au kg
- `category` (VARCHAR) - Catégorie
- `icon` (VARCHAR) - Emoji d'affichage
- `color` (VARCHAR) - Couleur de prix

#### `sales`
- `id` (UUID) - Identifiant de vente
- `client_name` (VARCHAR) - Nom du client
- `client_phone` (VARCHAR) - Téléphone client
- `total_amount` (DECIMAL) - Montant total
- `payment_method` (VARCHAR) - Mode de paiement
- `sale_date` (TIMESTAMP) - Date de vente

#### `sale_items`
- `id` (UUID) - Identifiant article
- `sale_id` (UUID) - Référence vente
- `product_id` (INTEGER) - Référence produit
- `product_name` (VARCHAR) - Nom produit
- `quantity` (DECIMAL) - Quantité vendue
- `unit_price` (DECIMAL) - Prix unitaire
- `total_price` (DECIMAL) - Prix total article

## 🔐 Sécurité (RLS)

Row Level Security activé sur toutes les tables avec politiques pour :
- Lecture publique des produits
- Accès authentifié pour les ventes
- Protection des données clients

## 🚀 Utilisation

### Service de Ventes

```javascript
import SalesService from '../services/salesService';

// Créer une vente
const result = await SalesService.createSale({
  client_name: "Jean Dupont",
  client_phone: "+237 6XX XXX XXX",
  items: [
    {
      product_id: 1,
      product_name: "Demon",
      quantity: 2.5,
      unit_price: 2000,
      total_price: 5000
    }
  ],
  total_amount: 5000,
  payment_method: "cash"
});

// Récupérer les ventes récentes
const sales = await SalesService.getRecentSales(10);

// Statistiques
const stats = await SalesService.getSalesStats('today');
```

## 📈 Fonctionnalités

✅ **Implémenté :**
- Création de ventes avec articles
- Gestion des clients
- Produits pré-configurés
- Statistiques de base
- Sécurité RLS

🔄 **À venir :**
- Synchronisation hors-ligne
- Gestion des stocks
- Rapports avancés
- Export des données
- Authentification utilisateurs

## 🛠️ Maintenance

### Sauvegarde
```sql
-- Export des ventes du jour
SELECT * FROM sales WHERE DATE(sale_date) = CURRENT_DATE;
```

### Nettoyage
```sql
-- Supprimer les ventes de test (optionnel)
DELETE FROM sales WHERE client_name LIKE 'Test%';
```

## 📞 Support

Pour toute question sur la configuration de la base de données, consulter la documentation Supabase ou contacter l'équipe de développement.
