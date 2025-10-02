# 📋 Guide de Gestion des Clients et Synchronisation - SAFEM

## Vue d'ensemble

Le système de gestion des clients SAFEM offre un suivi complet des clients (particuliers et professionnels) avec synchronisation automatique entre les produits, les ventes et les récoltes.

## 🎯 Fonctionnalités principales

### 1. **Gestion des Clients**
- ✅ Enregistrement clients particuliers et professionnels
- ✅ Historique complet des achats par client
- ✅ Statistiques détaillées (total dépensé, panier moyen, fréquence)
- ✅ Produits préférés par client
- ✅ Recherche rapide par nom, téléphone ou email
- ✅ Filtres par type de client
- ✅ Création automatique de clients depuis les ventes

### 2. **Synchronisation Automatique**
- ✅ **Récoltes → Stock**: Les récoltes sont automatiquement ajoutées au stock
- ✅ **Ventes → Stock**: Le stock est décrémenté automatiquement lors des ventes
- ✅ **Annulation → Stock**: Le stock est restauré si une vente est annulée
- ✅ **Ventes → Clients**: Création automatique d'un client si nécessaire

### 3. **Alertes Stock**
- ✅ Détection automatique des stocks faibles
- ✅ Seuils configurables par produit
- ✅ Statut visuel (OK, Warning, Low)

## 📁 Structure des Fichiers

```
safem-main/
├── database/
│   └── migrations/
│       └── 003_clients_and_sync.sql     # Migration complète
│
├── src/frontend/src/
│   ├── components/dashboard/
│   │   └── ClientsModule.js             # Interface de gestion clients
│   ├── services/
│   │   └── clientsService.js            # Service API clients
│   ├── pages/dashboard/
│   │   └── index.js                     # Dashboard avec module clients
│   └── layouts/
│       └── ModernDashboardLayout.js     # Navigation avec lien Clients
```

## 🚀 Installation

### Étape 1: Exécuter la Migration SQL

```bash
# Se connecter à Supabase SQL Editor
# Copier/coller le contenu de: database/migrations/003_clients_and_sync.sql
# Exécuter le script
```

Cette migration crée:
- ✅ Table `clients` (mise à jour si existe déjà)
- ✅ Table `products` (base produits caisse)
- ✅ Table `harvests` (récoltes)
- ✅ Triggers de synchronisation automatique
- ✅ Vues statistiques (`clients_stats`, `products_stock_movements`)
- ✅ Données initiales (20 produits SAFEM)
- ✅ Row Level Security (RLS)

### Étape 2: Vérifier l'Installation

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clients', 'products', 'harvests');

-- Vérifier les triggers
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table IN ('sales', 'sale_items', 'harvests');

-- Tester le rapport de synchronisation
SELECT * FROM get_sync_report();
```

## 📊 Utilisation

### Accéder au Module Clients

1. Ouvrir le dashboard: `http://localhost:3001/dashboard`
2. Cliquer sur **"Clients"** dans la navigation latérale
3. Le module affiche:
   - Statistiques globales (Total, Particuliers, Professionnels)
   - Liste des clients avec recherche et filtres
   - Détails et historique du client sélectionné

### Créer un Client

**Méthode 1: Manuelle**
```javascript
1. Cliquer sur "Nouveau Client"
2. Remplir le formulaire:
   - Nom* (requis)
   - Téléphone* (requis)
   - Email (optionnel)
   - Type: Particulier ou Professionnel
   - Adresse (optionnel)
   - Notes (optionnel)
3. Cliquer sur "Créer"
```

**Méthode 2: Automatique depuis une Vente**
```javascript
// Lors de la création d'une vente dans CaisseModule
// Si un client n'existe pas, il sera créé automatiquement
// avec le nom et téléphone fournis dans la vente
```

### Synchroniser les Clients

```javascript
// Dans l'interface ClientsModule
1. Cliquer sur "Synchroniser"
2. Le système va:
   - Récupérer toutes les ventes sans client_id
   - Créer les clients manquants
   - Associer les ventes aux clients
3. Un message affiche le nombre de ventes synchronisées
```

### Enregistrer une Récolte

```sql
-- Exemple d'ajout de récolte
INSERT INTO harvests (product_name, quantity, harvest_date, quality, notes)
VALUES ('Padma', 25.5, CURRENT_DATE, 'excellent', 'Belle récolte');

-- Le stock du produit "Padma" est automatiquement incrémenté de 25.5 kg
-- via le trigger sync_harvest_to_stock()
```

### Vérifier la Synchronisation

```sql
-- Vue consolidée: stock actuel vs récoltes vs ventes
SELECT * FROM products_stock_movements
ORDER BY stock_status DESC, current_stock ASC;

-- Statistiques clients
SELECT * FROM clients_stats
ORDER BY total_spent DESC
LIMIT 10;
```

## 🔄 Flux de Synchronisation

### 1. Récolte → Stock
```
Ajout Récolte
    ↓
Trigger: sync_harvest_to_stock()
    ↓
Stock Produit += Quantité Récoltée
    ↓
harvest.added_to_stock = TRUE
```

### 2. Vente → Stock
```
Création sale_items
    ↓
Trigger: decrement_stock_on_sale()
    ↓
Recherche product_id par product_name
    ↓
Stock Produit -= Quantité Vendue
    ↓
sale_items.product_id mis à jour
```

### 3. Annulation Vente → Stock
```
Suppression sale_items
    ↓
Trigger: restore_stock_on_sale_delete()
    ↓
Stock Produit += Quantité (restaurée)
```

### 4. Vente → Client
```
Création sale (sans client_id)
    ↓
Trigger: auto_create_client_from_sale()
    ↓
Recherche client existant (téléphone/nom)
    ↓
Si absent: Création nouveau client
    ↓
sale.client_id = client.id
```

## 📈 Statistiques et Rapports

### Statistiques Client
```javascript
// Via clientsService.js
const stats = await ClientsService.getClientStats(clientId);

// Retourne:
{
  totalSales: 15,           // Nombre d'achats
  totalAmount: 125000,      // Total dépensé (FCFA)
  averageAmount: 8333,      // Panier moyen
  totalItems: 45.5,         // Total kg achetés
  lastPurchaseDate: "2025-10-01",
  firstPurchaseDate: "2025-06-15"
}
```

### Produits Préférés Client
```javascript
const favorites = await ClientsService.getClientFavoriteProducts(clientId);

// Retourne top 10:
[
  { name: "Padma", totalQuantity: 12.5, totalSpent: 18750, purchaseCount: 5 },
  { name: "Demon", totalQuantity: 8.0, totalSpent: 16000, purchaseCount: 4 },
  ...
]
```

### Rapport Global
```sql
SELECT * FROM get_sync_report();

-- Retourne:
--  metric               | value  | unit  | status
-- ---------------------+--------+-------+---------
--  Total Récoltes      | 450.5  | kg    | info
--  Total Ventes        | 320.3  | kg    | info
--  Stock Actuel        | 580.2  | kg    | ok
--  Produits Stock Faible| 3     | items | warning
```

## 🔐 Sécurité

### Row Level Security (RLS)
```sql
-- Tous les utilisateurs authentifiés et anonymes peuvent:
- Lire les clients
- Créer/modifier des clients
- Lire les produits
- Gérer les récoltes

-- Seuls les utilisateurs authentifiés peuvent:
- Supprimer des clients
```

### Bonnes Pratiques
```javascript
// 1. Toujours valider les données côté frontend
if (!formData.name || !formData.phone) {
  setFormErrors({ name: 'Nom requis', phone: 'Téléphone requis' });
  return;
}

// 2. Utiliser try/catch pour gérer les erreurs
try {
  const result = await ClientsService.upsertClient(formData);
  if (!result.success) {
    setError(result.error);
  }
} catch (error) {
  console.error('Erreur:', error);
}

// 3. Rafraîchir les données après modification
await loadClients();
await loadGlobalStats();
```

## 🐛 Dépannage

### Problème: Les récoltes n'incrémentent pas le stock
```sql
-- Vérifier le trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_sync_harvest_to_stock';

-- Vérifier le statut added_to_stock
SELECT id, product_name, quantity, added_to_stock 
FROM harvests 
WHERE added_to_stock = FALSE;

-- Forcer la synchronisation manuelle
UPDATE products p
SET stock_quantity = stock_quantity + h.quantity
FROM harvests h
WHERE h.product_id = p.id 
AND h.added_to_stock = FALSE;

UPDATE harvests SET added_to_stock = TRUE 
WHERE added_to_stock = FALSE;
```

### Problème: Les ventes ne décrémententpas le stock
```sql
-- Vérifier le trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_decrement_stock_on_sale';

-- Vérifier les product_id dans sale_items
SELECT si.id, si.product_name, si.product_id, p.id AS real_product_id
FROM sale_items si
LEFT JOIN products p ON si.product_name = p.name
WHERE si.product_id IS NULL OR si.product_id != p.id;

-- Corriger les product_id manquants
UPDATE sale_items si
SET product_id = p.id
FROM products p
WHERE si.product_name = p.name 
AND si.product_id IS NULL;
```

### Problème: Clients non créés automatiquement
```sql
-- Vérifier le trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_create_client_from_sale';

-- Vérifier les ventes sans client
SELECT id, client_name, client_phone, client_id 
FROM sales 
WHERE client_id IS NULL;

-- Synchroniser manuellement via le service
-- Utiliser le bouton "Synchroniser" dans ClientsModule
```

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs console (`console.log`, `console.error`)
2. Vérifier les données dans Supabase Table Editor
3. Exécuter les requêtes de diagnostic ci-dessus
4. Consulter la documentation Supabase: https://supabase.com/docs

## 🎓 Exemples d'Utilisation

### Scénario Complet
```javascript
// 1. Enregistrer une récolte
const harvest = await supabase.from('harvests').insert({
  product_name: 'Padma',
  quantity: 30,
  harvest_date: '2025-10-01',
  quality: 'excellent',
  notes: 'Belle récolte de tomates'
});
// → Stock de "Padma" passe de 45kg à 75kg automatiquement

// 2. Créer une vente
const sale = await SalesService.createSale({
  client_name: 'Marie Dupont',
  client_phone: '+241 XX XX XX XX',
  items: [
    { product_name: 'Padma', quantity: 5, unit_price: 1500, total_price: 7500 }
  ],
  total_amount: 7500,
  payment_method: 'cash'
});
// → Client "Marie Dupont" créé automatiquement
// → Stock de "Padma" passe de 75kg à 70kg automatiquement
// → Vente associée au nouveau client

// 3. Consulter les stats du client
const clientStats = await ClientsService.getClientStats(clientId);
// → totalSales: 1, totalAmount: 7500, favoriteProducts: ['Padma']

// 4. Vérifier le stock
const stockReport = await supabase.from('products_stock_movements')
  .select('*')
  .eq('product_name', 'Padma');
// → current_stock: 70, total_harvested: 30, total_sold: 5
```

---

✅ **Système opérationnel et prêt à l'emploi!**
