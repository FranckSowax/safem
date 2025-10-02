# 🚀 Installation Rapide - SAFEM Gestion Clients

## Étape 1️⃣: Exécuter le Script SQL dans Supabase

### Option A: Via l'interface Supabase (Recommandé)

1. **Ouvrir le SQL Editor**
   ```
   https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
   ```

2. **Créer une nouvelle requête**
   - Cliquer sur `+ New query`

3. **Copier/Coller le script**
   - Ouvrir le fichier: `database/SETUP_COMPLET_SAFEM.sql`
   - Copier tout le contenu (Ctrl+A puis Ctrl+C)
   - Coller dans le SQL Editor (Ctrl+V)

4. **Exécuter**
   - Cliquer sur `Run` (ou Ctrl+Enter)
   - Attendre la fin de l'exécution (~10 secondes)

5. **Vérifier le résultat**
   ```
   Vous devriez voir un message:
   ✅ SETUP SAFEM TERMINÉ AVEC SUCCÈS!
   📋 Tables créées: 5 / 5
   ⚡ Triggers activés: 8
   📦 Produits chargés: 20 / 20
   ```

### Option B: Via l'API Supabase

```bash
# Depuis le terminal
cd /Users/sowax/Desktop/safem-main
supabase db push
```

---

## Étape 2️⃣: Vérifier les Tables

Dans le **Table Editor** de Supabase:
```
https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/editor
```

Vous devriez voir 5 nouvelles tables:
- ✅ `clients` - Gestion des clients
- ✅ `products` - Base produits caisse (20 produits)
- ✅ `sales` - Enregistrement des ventes
- ✅ `sale_items` - Détails des articles vendus
- ✅ `harvests` - Enregistrement des récoltes

---

## Étape 3️⃣: Tester les Données

### Vérifier les produits chargés
```sql
SELECT * FROM products ORDER BY category, name;
```
**Résultat attendu**: 20 produits (Demon, Padma, etc.)

### Vérifier les vues
```sql
-- Vue stock et mouvements
SELECT * FROM products_stock_movements;

-- Rapport de synchronisation
SELECT * FROM get_sync_report();
```

---

## Étape 4️⃣: Lancer le Frontend

```bash
cd /Users/sowax/Desktop/safem-main/src/frontend
npm install  # Si première fois
npm run dev
```

Ouvrir le navigateur:
```
http://localhost:3001/dashboard
```

Cliquer sur **"Clients"** dans la navigation → Module de gestion des clients s'affiche ✅

---

## Étape 5️⃣: Tester la Synchronisation

### Test 1: Ajouter une récolte
Dans le SQL Editor:
```sql
-- Ajouter une récolte de tomates Padma
INSERT INTO harvests (product_name, quantity, harvest_date, quality, notes)
VALUES ('Padma', 25.5, CURRENT_DATE, 'excellent', 'Belle récolte du matin');

-- Vérifier que le stock a augmenté automatiquement
SELECT name, stock_quantity FROM products WHERE name = 'Padma';
-- Avant: 45 kg → Après: 70.5 kg ✅
```

### Test 2: Créer une vente
Dans le dashboard → Module **Caisse** ou via SQL:
```sql
-- Créer une vente
INSERT INTO sales (client_name, client_phone, total_amount, payment_method)
VALUES ('Marie Dupont', '+241 XX XX XX XX', 7500, 'cash')
RETURNING id;

-- Noter l'ID retourné (ex: 'abc-123-def')

-- Ajouter un article à la vente
INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
VALUES ('abc-123-def', 'Padma', 5, 1500, 7500);

-- Vérifier que le stock a diminué automatiquement
SELECT name, stock_quantity FROM products WHERE name = 'Padma';
-- Avant: 70.5 kg → Après: 65.5 kg ✅

-- Vérifier que le client a été créé automatiquement
SELECT * FROM clients WHERE name = 'Marie Dupont';
-- Client créé automatiquement ✅
```

### Test 3: Voir les statistiques client
```sql
-- Statistiques du client
SELECT * FROM clients_stats WHERE name = 'Marie Dupont';
-- Résultat: total_purchases: 1, total_spent: 7500 ✅

-- Historique des achats
SELECT s.*, si.product_name, si.quantity
FROM sales s
JOIN sale_items si ON s.id = si.sale_id
WHERE s.client_name = 'Marie Dupont';
```

---

## 🎯 Fonctionnalités Activées

### ✅ Synchronisation Automatique

1. **Récoltes → Stock**
   - Quand vous ajoutez une récolte
   - → Le stock du produit augmente automatiquement

2. **Ventes → Stock**
   - Quand vous créez une vente
   - → Le stock diminue automatiquement

3. **Annulation → Stock**
   - Si vous supprimez une vente
   - → Le stock est restauré automatiquement

4. **Ventes → Clients**
   - Quand vous créez une vente sans client_id
   - → Un client est créé ou récupéré automatiquement

### ✅ Alertes Stock

```sql
-- Voir les produits en stock faible
SELECT * FROM products_stock_movements 
WHERE stock_status IN ('low', 'warning');
```

### ✅ Rapports

```sql
-- Rapport complet de synchronisation
SELECT * FROM get_sync_report();

-- Top 10 clients
SELECT * FROM clients_stats 
ORDER BY total_spent DESC 
LIMIT 10;

-- Produits les plus vendus
SELECT 
    product_name,
    SUM(quantity) as total_sold,
    COUNT(*) as nb_ventes
FROM sale_items
GROUP BY product_name
ORDER BY total_sold DESC;
```

---

## 🐛 Dépannage

### Problème: Erreur lors de l'exécution du script

**Solution 1**: Exécuter en plusieurs parties
```sql
-- 1. D'abord les tables
CREATE TABLE IF NOT EXISTS clients (...);
CREATE TABLE IF NOT EXISTS products (...);
-- etc.

-- 2. Puis les triggers
CREATE OR REPLACE FUNCTION sync_harvest_to_stock() ...
-- etc.

-- 3. Enfin les données
INSERT INTO products ...
```

**Solution 2**: Vérifier les permissions
```sql
-- Dans Supabase, vous devez être "service_role"
-- Vérifier avec:
SELECT current_user, session_user;
```

### Problème: Frontend ne se connecte pas

**Vérifier la configuration**:
```bash
# Fichier: src/frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://iwwgbmukenmxumfxibsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Tester la connexion**:
```javascript
// Console navigateur (F12)
import { supabase } from './lib/supabaseClient';
const { data, error } = await supabase.from('products').select('*').limit(1);
console.log(data, error);
```

### Problème: RLS bloque les requêtes

**Solution**: Vérifier les politiques RLS
```sql
-- Désactiver temporairement pour tester
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Puis réactiver après test
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

---

## 📞 Support

### Logs utiles
```sql
-- Voir les dernières insertions
SELECT * FROM clients ORDER BY created_at DESC LIMIT 10;
SELECT * FROM sales ORDER BY created_at DESC LIMIT 10;
SELECT * FROM harvests ORDER BY created_at DESC LIMIT 10;

-- Vérifier les triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_schema = 'public';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Documentation Supabase
- SQL Editor: https://supabase.com/docs/guides/database/overview
- RLS: https://supabase.com/docs/guides/auth/row-level-security
- Triggers: https://supabase.com/docs/guides/database/postgres/triggers

---

## ✅ Checklist d'Installation

- [ ] Script SQL exécuté sans erreur
- [ ] 5 tables créées (clients, products, sales, sale_items, harvests)
- [ ] 20 produits chargés dans `products`
- [ ] 8 triggers actifs
- [ ] 2 vues créées (products_stock_movements, clients_stats)
- [ ] RLS activé sur toutes les tables
- [ ] Frontend lancé et connecté
- [ ] Module "Clients" accessible dans le dashboard
- [ ] Test récolte → stock fonctionnel
- [ ] Test vente → stock fonctionnel
- [ ] Test vente → client fonctionnel

---

🎉 **Félicitations ! Votre système SAFEM est opérationnel !**

Accédez au dashboard:
```
http://localhost:3001/dashboard → Clients
```
