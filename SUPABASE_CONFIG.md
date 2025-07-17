# Configuration Supabase pour SAFEM

## 🔧 Configuration requise

Pour corriger les erreurs de connexion Supabase, vous devez créer le fichier `.env.local` :

### 1. Créer le fichier de configuration

```bash
cd /Users/a/Downloads/safem-main/src/frontend
cp .env.example .env.local
```

### 2. Remplir les valeurs Supabase

Éditez le fichier `.env.local` avec vos vraies valeurs :

```env
# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://iwwgbmukenmxumfxibsz.supabase.co

# Clé API anonyme de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme-ici
```

### 3. Obtenir les valeurs Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Redémarrer le serveur

```bash
npm run dev
```

## 🔍 Vérification

Les erreurs suivantes devraient disparaître :
- `GET https://iwwgbmukenmxumfxibsz.supabase.co/rest/v1/sales... net::ERR_CONNECTION_CLOSED`
- `TypeError: Failed to fetch`

## 📝 Note

Le fichier `.env.local` est dans `.gitignore` pour des raisons de sécurité.
Ne jamais commiter les clés API dans le code source.
