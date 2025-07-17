# 🚀 Guide de Configuration Supabase pour SAFEM

## 📋 Étapes de Configuration

### 1. Accéder à l'Interface Supabase

1. Ouvrez votre navigateur et allez sur : https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz
2. Connectez-vous à votre compte Supabase
3. Allez dans l'onglet **SQL Editor** (icône de base de données)

### 2. Exécuter le Schéma SQL

1. Dans le SQL Editor, copiez et collez le contenu du fichier `complete_schema.sql`
2. Cliquez sur **Run** pour exécuter le script
3. Vérifiez qu'il n'y a pas d'erreurs dans la console

### 3. Vérifier les Tables Créées

Allez dans l'onglet **Table Editor** pour vérifier que les tables suivantes ont été créées :

- ✅ `clients` - Gestion des clients
- ✅ `product_categories` - Catégories de produits
- ✅ `products` - Catalogue des produits
- ✅ `sales` - Enregistrement des ventes
- ✅ `sale_items` - Détails des articles vendus
- ✅ `inventory` - Gestion des stocks
- ✅ `team_members` - Équipe SAFEM
- ✅ `harvests` - Enregistrement des récoltes
- ✅ `suppliers` - Fournisseurs
- ✅ `purchases` - Achats/Approvisionnements
- ✅ `purchase_items` - Détails des achats
- ✅ `alerts` - Système d'alertes
- ✅ `financial_reports` - Rapports financiers
- ✅ `system_settings` - Paramètres système

### 4. Configurer les Politiques RLS

Les politiques de sécurité Row Level Security (RLS) sont automatiquement configurées pour permettre :
- ✅ Lecture publique sur toutes les tables
- ✅ Insertion/Modification pour les ventes et clients
- ✅ Sécurité des données sensibles

### 5. Vérifier les Données Initiales

Les données suivantes devraient être automatiquement insérées :

#### Catégories de Produits
- Légumes Feuilles
- Légumes Fruits  
- Légumes Racines
- Épices
- Fruits

#### Produits SAFEM (21 produits)
- Poivron De conti, Tomate Padma, Piment Demon, etc.
- Avec prix, stock, et catégories associées

#### Paramètres Système
- Nom de l'entreprise : SAFEM
- Devise : FCFA
- Seuils d'alerte stock

## 🔧 Configuration de l'Application

### Fichier .env.local

Le fichier `.env.local` a été créé avec vos identifiants :

```env
NEXT_PUBLIC_SUPABASE_URL=https://iwwgbmukenmxumfxibsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test de Connexion

Après avoir configuré la base de données, testez la connexion :

```bash
cd src/frontend
npm run dev
```

Puis allez sur http://localhost:3001 et vérifiez :
- ✅ Dashboard affiche les vraies données
- ✅ Caisse peut enregistrer des ventes
- ✅ Synchronisation temps réel fonctionne

## 🎯 Fonctionnalités Activées

### Dashboard
- 📊 KPIs en temps réel
- 📈 Statistiques de ventes
- 🔔 Alertes automatiques
- 📱 Synchronisation temps réel

### Caisse
- 💰 Enregistrement des ventes
- 👥 Gestion des clients
- 📦 Gestion des stocks
- 🧾 Génération de tickets

### Synchronisation
- ⚡ Temps réel via Supabase Realtime
- 🔄 Rafraîchissement automatique
- 💾 Persistance des données
- 🔒 Sécurité RLS

## 🚨 Dépannage

### Erreur de Connexion
1. Vérifiez que les variables d'environnement sont correctes
2. Assurez-vous que le projet Supabase est actif
3. Vérifiez les politiques RLS

### Tables Manquantes
1. Exécutez à nouveau le script `complete_schema.sql`
2. Vérifiez les erreurs dans le SQL Editor
3. Contactez le support si nécessaire

### Données Manquantes
1. Vérifiez que les données initiales ont été insérées
2. Exécutez les INSERT manuellement si nécessaire
3. Utilisez le Table Editor pour ajouter des données

## 📞 Support

En cas de problème, vérifiez :
1. Les logs de la console navigateur
2. Les logs Supabase dans le dashboard
3. La documentation Supabase : https://supabase.com/docs

---

**🎉 Une fois configuré, votre application SAFEM sera entièrement fonctionnelle avec synchronisation temps réel !**
