# 🚀 SAFEM - Démarrage Rapide

## Système de Gestion Agricole avec Module Clients

### ⚡ Installation en 3 Étapes

---

## 📋 ÉTAPE 1: Configuration Base de Données (5 min)

### 1.1 Accéder à Supabase SQL Editor
```
https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
```

### 1.2 Exécuter le Script SQL
1. Cliquer sur `+ New query`
2. Ouvrir le fichier: **`database/SETUP_COMPLET_SAFEM.sql`**
3. Copier tout le contenu (Ctrl+A puis Ctrl+C)
4. Coller dans le SQL Editor (Ctrl+V)
5. Cliquer sur **`Run`** ou presser Ctrl+Enter
6. Attendre ~10 secondes

### 1.3 Vérifier le Résultat
Vous devez voir un message:
```
✅ SETUP SAFEM TERMINÉ AVEC SUCCÈS!
📋 Tables créées: 5 / 5
⚡ Triggers activés: 8
📦 Produits chargés: 20 / 20
```

✅ **Si vous voyez ce message, la base de données est prête !**

---

## 💻 ÉTAPE 2: Lancer le Frontend (2 min)

### 2.1 Installer les dépendances
```bash
cd /Users/sowax/Desktop/safem-main/src/frontend
npm install
```

### 2.2 Démarrer le serveur
```bash
npm run dev
```

### 2.3 Ouvrir le navigateur
```
http://localhost:3001/dashboard
```

---

## 🎯 ÉTAPE 3: Accéder au Module Clients

1. Dans le dashboard, cliquer sur **"Clients"** dans la navigation latérale
2. Vous devriez voir:
   - ✅ Statistiques globales (0 clients au départ)
   - ✅ Bouton "Nouveau Client"
   - ✅ Bouton "Synchroniser"
   - ✅ Barre de recherche et filtres

---

## 🧪 Test Rapide (Optionnel)

### Tester la Synchronisation Automatique

**Dans Supabase SQL Editor**, exécuter:

```sql
-- 1. Ajouter une récolte de tomates
INSERT INTO harvests (product_name, quantity, harvest_date, quality)
VALUES ('Padma', 25, CURRENT_DATE, 'excellent');

-- 2. Vérifier que le stock a augmenté
SELECT name, stock_quantity FROM products WHERE name = 'Padma';
-- Résultat attendu: stock_quantity = 70 kg (45 initial + 25 récolte)

-- 3. Créer une vente
INSERT INTO sales (client_name, client_phone, total_amount, payment_method)
VALUES ('Test Client', '+241 01 23 45 67', 7500, 'cash')
RETURNING id;
-- Noter l'ID retourné

-- 4. Ajouter un article à la vente (remplacer 'ID-ICI' par l'ID retourné)
INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
VALUES ('ID-ICI', 'Padma', 5, 1500, 7500);

-- 5. Vérifier que le stock a diminué
SELECT name, stock_quantity FROM products WHERE name = 'Padma';
-- Résultat attendu: stock_quantity = 65 kg (70 - 5)

-- 6. Vérifier que le client a été créé automatiquement
SELECT * FROM clients WHERE name = 'Test Client';
-- Résultat: 1 client trouvé ✅

-- 7. Voir les statistiques du client
SELECT * FROM clients_stats WHERE name = 'Test Client';
-- Résultat: total_purchases: 1, total_spent: 7500 ✅
```

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| **`INSTALLATION_RAPIDE.md`** | Guide d'installation détaillé |
| **`GUIDE_GESTION_CLIENTS.md`** | Manuel d'utilisation complet |
| **`IMPLEMENTATION_COMPLETE.md`** | Documentation technique complète |
| **`database/README_CLIENTS.md`** | Documentation base de données |

---

## ✨ Fonctionnalités Principales

### 🔄 Synchronisation Automatique

#### Récoltes → Stock
```
Ajout récolte → Stock augmente automatiquement
```

#### Ventes → Stock
```
Création vente → Stock diminue automatiquement
```

#### Ventes → Clients
```
Vente sans client_id → Client créé automatiquement
```

#### Annulation → Stock
```
Suppression vente → Stock restauré automatiquement
```

### 📊 Module Clients

- ✅ Liste complète des clients (particuliers et professionnels)
- ✅ Recherche par nom, téléphone, email
- ✅ Filtres par type de client
- ✅ Tri (récent, nom, achats)
- ✅ Historique complet des achats par client
- ✅ Produits préférés de chaque client
- ✅ Statistiques: total dépensé, panier moyen, fréquence
- ✅ Création/modification/suppression de clients
- ✅ Synchronisation automatique avec les ventes

### 📦 Base Produits Caisse

**20 produits SAFEM pré-chargés:**

| Catégorie | Produits |
|-----------|----------|
| **Piments** | Demon, Shamsi, Avenir, The King |
| **Poivrons** | Yolo Wander, De Conti, Nobili |
| **Tomates** | Padma, Anita |
| **Aubergines** | Africaine, Bonita, Ping Tung |
| **Bananes** | Plantain Ebanga, Banane Douce |
| **Taros** | Taro Blanc, Taro Rouge |
| **Autres** | Chou Averty, Gombo Kirikou, Concombre Mureino, Ciboulette |

---

## 🎯 Navigation Dashboard

```
Dashboard SAFEM
├── 📊 Dashboard (Vue d'ensemble)
├── 🌾 Récoltes (Enregistrement des récoltes)
├── 💰 Ventes (Historique des ventes)
├── 🏪 Caisse (Point de vente)
├── 👥 Clients ⭐ (Gestion clients - NOUVEAU)
├── 🛍️ Boutique Pro (Commandes professionnelles)
├── 📈 Rapports (Statistiques et analyses)
├── 👨‍💼 Équipe (Gestion de l'équipe)
└── ⚙️ Opérations (Paramètres)
```

---

## 🐛 Dépannage Rapide

### Problème: Erreur lors de l'exécution SQL

**Solution**: Vérifier que vous êtes connecté à Supabase et que vous avez les permissions

### Problème: Frontend ne démarre pas

**Solutions**:
```bash
# 1. Vérifier la version de Node
node --version  # Doit être >= 16

# 2. Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# 3. Vérifier le port 3001
lsof -ti:3001 | xargs kill -9  # Libérer le port si occupé
npm run dev
```

### Problème: Module Clients ne s'affiche pas

**Solutions**:
```bash
# 1. Vérifier que les fichiers existent
ls src/frontend/src/services/clientsService.js
ls src/frontend/src/components/dashboard/ClientsModule.js

# 2. Redémarrer le serveur
# Ctrl+C pour arrêter, puis:
npm run dev

# 3. Vider le cache du navigateur
# Chrome: Ctrl+Shift+R
```

### Problème: Aucun produit dans la base

**Solution SQL**:
```sql
-- Vérifier les produits
SELECT COUNT(*) FROM products;

-- Si 0, réexécuter l'insertion
-- Copier la section "DONNÉES INITIALES" de SETUP_COMPLET_SAFEM.sql
```

---

## 📞 Support

### Liens Utiles

- **Supabase Dashboard**: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz
- **SQL Editor**: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
- **Table Editor**: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/editor

### Logs et Debugging

```bash
# Logs frontend
# Vérifier la console du terminal où npm run dev tourne

# Logs Supabase
# Ouvrir: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/logs

# Console navigateur
# F12 → Console (pour voir les erreurs frontend)
```

---

## ✅ Checklist de Vérification

Avant de commencer à utiliser le système:

- [ ] Base de données: Script SQL exécuté avec succès
- [ ] Base de données: 5 tables créées (clients, products, sales, sale_items, harvests)
- [ ] Base de données: 20 produits chargés
- [ ] Frontend: `npm install` terminé sans erreur
- [ ] Frontend: `npm run dev` fonctionne
- [ ] Frontend: Dashboard accessible sur http://localhost:3001
- [ ] Frontend: Module "Clients" visible dans la navigation
- [ ] Test: Récolte → Stock fonctionne
- [ ] Test: Vente → Stock fonctionne
- [ ] Test: Vente → Client fonctionne

---

## 🎉 C'est Parti !

Votre système SAFEM est maintenant opérationnel avec:

✅ **Gestion complète des clients**
✅ **Synchronisation automatique stock/ventes/récoltes**
✅ **20 produits pré-configurés**
✅ **Interface moderne et intuitive**
✅ **Statistiques en temps réel**

**Accédez au dashboard**: `http://localhost:3001/dashboard`

**Cliquez sur "Clients"** pour commencer ! 🚀
