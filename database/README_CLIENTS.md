# 🗄️ Base de données SAFEM - Gestion Clients

Configuration et scripts pour la gestion des clients avec synchronisation automatique.

## 📁 Structure des Fichiers

```
database/
├── SETUP_COMPLET_SAFEM.sql          # ⭐ Script principal à exécuter
├── TEST_INSTALLATION.sql             # Tests de vérification
├── README_CLIENTS.md                 # Ce fichier
└── migrations/
    └── 003_clients_and_sync.sql      # Migration complète (backup)
```

## 🚀 Installation Rapide

### Projet Supabase
```
URL: https://iwwgbmukenmxumfxibsz.supabase.co
Dashboard: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz
SQL Editor: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
Table Editor: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/editor
```

### 🎯 Ordre d'Exécution

1. **Script Principal** (Obligatoire)
   ```
   Fichier: SETUP_COMPLET_SAFEM.sql
   Durée: ~10 secondes
   Action: Crée toutes les tables, triggers et données
   ```

2. **Tests** (Optionnel mais recommandé)
   ```
   Fichier: TEST_INSTALLATION.sql
   Durée: ~5 secondes
   Action: Vérifie que tout fonctionne correctement
   ```

## 📊 Tables Créées

### 1. `clients` - Gestion des clients
```sql
Colonnes:
- id (UUID) - Identifiant unique
- name (VARCHAR) - Nom complet
- phone (VARCHAR) - Téléphone
- email (VARCHAR) - Email (optionnel)
- address (TEXT) - Adresse (optionnel)
- client_type (VARCHAR) - 'particulier' ou 'pro'
- notes (TEXT) - Notes internes
- created_at, updated_at (TIMESTAMP)

Index:
- name, phone, email, client_type

Fonctionnalités:
✅ Recherche rapide par nom/téléphone/email
✅ Filtrage par type
✅ Historique complet des achats
✅ Création automatique depuis les ventes
```

### 2. `products` - Base produits caisse
```sql
Colonnes:
- id (SERIAL) - Identifiant auto-incrémenté
- name (VARCHAR UNIQUE) - Nom du produit
- category (VARCHAR) - Catégorie
- icon (VARCHAR) - Emoji d'affichage
- unit (VARCHAR) - Unité (kg, botte, etc.)
- price (DECIMAL) - Prix unitaire
- stock_quantity (DECIMAL) - Stock actuel
- min_stock_level (DECIMAL) - Seuil d'alerte
- created_at, updated_at (TIMESTAMP)

Index:
- name, category, stock_quantity

Données initiales:
✅ 20 produits SAFEM pré-chargés
✅ Stock initial configuré
✅ Seuils d'alerte définis
```

### 3. `sales` - Enregistrement des ventes
```sql
Colonnes:
- id (UUID) - Identifiant unique
- client_id (UUID FK) - Lien vers clients
- client_name (VARCHAR) - Nom (si pas de client_id)
- client_phone (VARCHAR) - Téléphone
- sale_date (TIMESTAMP) - Date de vente
- total_amount (DECIMAL) - Montant total
- payment_method (VARCHAR) - Mode de paiement
- notes (TEXT) - Remarques
- created_at, updated_at (TIMESTAMP)

Index:
- client_id, sale_date, client_name

Triggers:
✅ Création automatique de client si nécessaire
```

### 4. `sale_items` - Détails des articles vendus
```sql
Colonnes:
- id (UUID) - Identifiant unique
- sale_id (UUID FK) - Lien vers sales
- product_id (INTEGER FK) - Lien vers products
- product_name (VARCHAR) - Nom du produit
- quantity (DECIMAL) - Quantité vendue
- unit_price (DECIMAL) - Prix unitaire
- total_price (DECIMAL) - Prix total
- created_at (TIMESTAMP)

Index:
- sale_id, product_id

Triggers:
✅ Décrémentation automatique du stock
✅ Association automatique product_id
✅ Restauration stock si suppression
```

### 5. `harvests` - Récoltes
```sql
Colonnes:
- id (UUID) - Identifiant unique
- product_id (INTEGER FK) - Lien vers products
- product_name (VARCHAR) - Nom du produit
- quantity (DECIMAL) - Quantité récoltée
- unit (VARCHAR) - Unité
- harvest_date (DATE) - Date de récolte
- quality (VARCHAR) - Qualité
- notes (TEXT) - Remarques
- added_to_stock (BOOLEAN) - Ajouté au stock?
- created_at, updated_at (TIMESTAMP)

Index:
- harvest_date, product_id, added_to_stock

Triggers:
✅ Ajout automatique au stock
```

## ⚡ Triggers Automatiques

### 1. Récolte → Stock (`sync_harvest_to_stock`)
```sql
Quand: INSERT ou UPDATE dans harvests
Action: Ajouter la quantité au stock du produit
Résultat: stock_quantity += harvest.quantity
```

### 2. Vente → Stock (`decrement_stock_on_sale`)
```sql
Quand: INSERT dans sale_items
Action: Décrémenter le stock du produit
Résultat: stock_quantity -= sale_item.quantity
```

### 3. Annulation → Stock (`restore_stock_on_sale_delete`)
```sql
Quand: DELETE dans sale_items
Action: Restaurer le stock du produit
Résultat: stock_quantity += sale_item.quantity
```

### 4. Vente → Client (`auto_create_client_from_sale`)
```sql
Quand: INSERT dans sales sans client_id
Action: Créer ou récupérer un client
Résultat: sales.client_id = client.id
```

## 📊 Vues et Fonctions

### Vue: `products_stock_movements`
```sql
Colonnes:
- product_id, product_name, category
- current_stock (stock actuel)
- min_stock_level (seuil)
- total_harvested (total récolté)
- total_sold (total vendu)
- stock_status ('ok', 'warning', 'low')

Utilisation:
SELECT * FROM products_stock_movements 
WHERE stock_status = 'low';
```

### Vue: `clients_stats`
```sql
Colonnes:
- id, name, phone, email, client_type
- total_purchases (nombre d'achats)
- total_spent (montant total dépensé)
- average_purchase (panier moyen)
- last_purchase_date (dernière visite)
- first_purchase_date (première visite)

Utilisation:
SELECT * FROM clients_stats 
ORDER BY total_spent DESC 
LIMIT 10;
```

### Fonction: `get_sync_report()`
```sql
Retourne:
- Total Récoltes (30j) en kg
- Total Ventes (30j) en kg
- Stock Total Actuel en kg
- Produits Stock Faible (count)

Utilisation:
SELECT * FROM get_sync_report();
```

## 🔐 Sécurité (RLS)

Toutes les tables ont Row Level Security activé avec politiques:

```sql
-- Lecture publique
FOR SELECT USING (true)

-- Création/Modification publique (à sécuriser en production)
FOR INSERT/UPDATE/DELETE USING (true)
```

**⚠️ En production**: Remplacer par des politiques basées sur l'authentification.

## 📝 Exemples d'Utilisation

### Ajouter une récolte
```sql
INSERT INTO harvests (product_name, quantity, harvest_date, quality)
VALUES ('Padma', 25.5, CURRENT_DATE, 'excellent');

-- Le stock de 'Padma' augmente automatiquement de 25.5 kg
```

### Créer une vente
```sql
-- 1. Créer la vente
INSERT INTO sales (client_name, client_phone, total_amount, payment_method)
VALUES ('Marie Dupont', '+241 01 23 45 67', 7500, 'cash')
RETURNING id;

-- 2. Ajouter les articles (remplacer 'sale-id' par l'ID retourné)
INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
VALUES 
  ('sale-id', 'Padma', 5, 1500, 7500);

-- Résultats automatiques:
-- ✅ Client 'Marie Dupont' créé automatiquement
-- ✅ Stock de 'Padma' décrémenté de 5 kg
```

### Consulter les statistiques
```sql
-- Top 10 clients
SELECT * FROM clients_stats 
ORDER BY total_spent DESC 
LIMIT 10;

-- Produits en stock faible
SELECT * FROM products_stock_movements 
WHERE stock_status IN ('low', 'warning');

-- Rapport de synchronisation
SELECT * FROM get_sync_report();
```

## 🧪 Tests

Exécuter `TEST_INSTALLATION.sql` pour vérifier:

- ✅ 5 tables créées
- ✅ 8+ triggers actifs
- ✅ 20 produits chargés
- ✅ 2 vues créées
- ✅ 10+ politiques RLS
- ✅ Test récolte → stock
- ✅ Test vente → stock
- ✅ Test vente → client

## 📞 Support

Documentation complète:
- `INSTALLATION_RAPIDE.md` - Guide d'installation étape par étape
- `GUIDE_GESTION_CLIENTS.md` - Guide d'utilisation complet
- Supabase Docs: https://supabase.com/docs

Liens utiles:
- SQL Editor: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
- Table Editor: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/editor
- Logs: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/logs
