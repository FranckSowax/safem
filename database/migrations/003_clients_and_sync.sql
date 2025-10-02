-- Migration 003: Gestion des clients et synchronisation produits/ventes/récoltes
-- À exécuter dans Supabase SQL Editor après les migrations 001 et 002

-- =====================================================
-- TABLE: CLIENTS (mise à jour si existe déjà)
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    client_type VARCHAR(20) DEFAULT 'particulier' CHECK (client_type IN ('particulier', 'pro')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des colonnes si elles n'existent pas déjà
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='client_type') THEN
        ALTER TABLE clients ADD COLUMN client_type VARCHAR(20) DEFAULT 'particulier';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='notes') THEN
        ALTER TABLE clients ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(client_type);

-- =====================================================
-- MISE À JOUR TABLE SALES: Lien avec clients
-- =====================================================
-- S'assurer que client_id existe dans sales
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sales' AND column_name='client_id') THEN
        ALTER TABLE sales ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);

-- =====================================================
-- TABLE: PRODUCTS (base produits caisse)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    icon VARCHAR(10),
    unit VARCHAR(20) DEFAULT 'kg',
    price DECIMAL(10,2),
    stock_quantity DECIMAL(10,3) DEFAULT 0,
    min_stock_level DECIMAL(10,3) DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les colonnes manquantes si nécessaire
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity DECIMAL(10,3) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='min_stock_level') THEN
        ALTER TABLE products ADD COLUMN min_stock_level DECIMAL(10,3) DEFAULT 5;
    END IF;
END $$;

-- Index
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- =====================================================
-- TABLE: HARVESTS (Récoltes)
-- =====================================================
CREATE TABLE IF NOT EXISTS harvests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    harvest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quality VARCHAR(50) DEFAULT 'good',
    notes TEXT,
    added_to_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_harvests_date ON harvests(harvest_date);
CREATE INDEX IF NOT EXISTS idx_harvests_product_id ON harvests(product_id);
CREATE INDEX IF NOT EXISTS idx_harvests_added_to_stock ON harvests(added_to_stock);

-- =====================================================
-- TRIGGER: Mise à jour automatique updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_harvests_updated_at ON harvests;
CREATE TRIGGER update_harvests_updated_at 
    BEFORE UPDATE ON harvests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FONCTION: Synchroniser stock avec récoltes
-- =====================================================
CREATE OR REPLACE FUNCTION sync_harvest_to_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Ajouter la quantité récoltée au stock du produit
    IF NEW.added_to_stock = FALSE AND NEW.product_id IS NOT NULL THEN
        UPDATE products
        SET stock_quantity = stock_quantity + NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id;
        
        NEW.added_to_stock = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour ajout automatique au stock
DROP TRIGGER IF EXISTS trigger_sync_harvest_to_stock ON harvests;
CREATE TRIGGER trigger_sync_harvest_to_stock
    BEFORE INSERT OR UPDATE ON harvests
    FOR EACH ROW
    EXECUTE FUNCTION sync_harvest_to_stock();

-- =====================================================
-- FONCTION: Décrémenter stock lors d'une vente
-- =====================================================
CREATE OR REPLACE FUNCTION decrement_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id INTEGER;
BEGIN
    -- Récupérer le product_id depuis le nom du produit
    SELECT id INTO v_product_id
    FROM products
    WHERE name = NEW.product_name
    LIMIT 1;
    
    -- Si le produit existe, décrémenter le stock
    IF v_product_id IS NOT NULL THEN
        UPDATE products
        SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity),
            updated_at = NOW()
        WHERE id = v_product_id;
        
        -- Mettre à jour product_id dans sale_items si NULL
        IF NEW.product_id IS NULL THEN
            NEW.product_id = v_product_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour décrémentation automatique du stock
DROP TRIGGER IF EXISTS trigger_decrement_stock_on_sale ON sale_items;
CREATE TRIGGER trigger_decrement_stock_on_sale
    BEFORE INSERT ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION decrement_stock_on_sale();

-- =====================================================
-- FONCTION: Restaurer stock si vente annulée
-- =====================================================
CREATE OR REPLACE FUNCTION restore_stock_on_sale_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id INTEGER;
BEGIN
    -- Récupérer le product_id
    v_product_id := OLD.product_id;
    
    IF v_product_id IS NULL THEN
        SELECT id INTO v_product_id
        FROM products
        WHERE name = OLD.product_name
        LIMIT 1;
    END IF;
    
    -- Restaurer le stock
    IF v_product_id IS NOT NULL THEN
        UPDATE products
        SET stock_quantity = stock_quantity + OLD.quantity,
            updated_at = NOW()
        WHERE id = v_product_id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour restauration du stock
DROP TRIGGER IF EXISTS trigger_restore_stock_on_sale_delete ON sale_items;
CREATE TRIGGER trigger_restore_stock_on_sale_delete
    AFTER DELETE ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION restore_stock_on_sale_delete();

-- =====================================================
-- FONCTION: Créer client automatiquement depuis vente
-- =====================================================
CREATE OR REPLACE FUNCTION auto_create_client_from_sale()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id UUID;
BEGIN
    -- Si pas de client_id mais un nom et téléphone fournis
    IF NEW.client_id IS NULL AND NEW.client_name IS NOT NULL THEN
        
        -- Vérifier si un client existe déjà avec ce téléphone
        IF NEW.client_phone IS NOT NULL THEN
            SELECT id INTO v_client_id
            FROM clients
            WHERE phone = NEW.client_phone
            LIMIT 1;
        END IF;
        
        -- Si pas trouvé par téléphone, chercher par nom
        IF v_client_id IS NULL THEN
            SELECT id INTO v_client_id
            FROM clients
            WHERE name = NEW.client_name
            LIMIT 1;
        END IF;
        
        -- Si toujours pas de client, en créer un nouveau
        IF v_client_id IS NULL THEN
            INSERT INTO clients (name, phone, client_type, created_at)
            VALUES (NEW.client_name, NEW.client_phone, 'particulier', NOW())
            RETURNING id INTO v_client_id;
        END IF;
        
        -- Associer le client à la vente
        NEW.client_id = v_client_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour création automatique de client
DROP TRIGGER IF EXISTS trigger_auto_create_client_from_sale ON sales;
CREATE TRIGGER trigger_auto_create_client_from_sale
    BEFORE INSERT ON sales
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_client_from_sale();

-- =====================================================
-- VUE: Stock et mouvements
-- =====================================================
CREATE OR REPLACE VIEW products_stock_movements AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    p.stock_quantity AS current_stock,
    p.min_stock_level,
    COALESCE(h.total_harvested, 0) AS total_harvested,
    COALESCE(s.total_sold, 0) AS total_sold,
    CASE 
        WHEN p.stock_quantity <= p.min_stock_level THEN 'low'
        WHEN p.stock_quantity <= p.min_stock_level * 1.5 THEN 'warning'
        ELSE 'ok'
    END AS stock_status
FROM products p
LEFT JOIN (
    SELECT product_id, SUM(quantity) AS total_harvested
    FROM harvests
    WHERE added_to_stock = TRUE
    GROUP BY product_id
) h ON p.id = h.product_id
LEFT JOIN (
    SELECT product_id, SUM(quantity) AS total_sold
    FROM sale_items
    WHERE product_id IS NOT NULL
    GROUP BY product_id
) s ON p.id = s.product_id;

-- =====================================================
-- VUE: Statistiques clients
-- =====================================================
CREATE OR REPLACE VIEW clients_stats AS
SELECT 
    c.id,
    c.name,
    c.phone,
    c.email,
    c.client_type,
    COUNT(DISTINCT s.id) AS total_purchases,
    COALESCE(SUM(s.total_amount), 0) AS total_spent,
    COALESCE(AVG(s.total_amount), 0) AS average_purchase,
    MAX(s.sale_date) AS last_purchase_date,
    MIN(s.sale_date) AS first_purchase_date
FROM clients c
LEFT JOIN sales s ON c.id = s.client_id
GROUP BY c.id, c.name, c.phone, c.email, c.client_type;

-- =====================================================
-- FONCTION: Rapport de synchronisation
-- =====================================================
CREATE OR REPLACE FUNCTION get_sync_report()
RETURNS TABLE (
    metric VARCHAR,
    value DECIMAL,
    unit VARCHAR,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Total Récoltes'::VARCHAR AS metric,
        SUM(quantity)::DECIMAL AS value,
        'kg'::VARCHAR AS unit,
        'info'::VARCHAR AS status
    FROM harvests
    WHERE harvest_date >= CURRENT_DATE - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'Total Ventes'::VARCHAR,
        SUM(si.quantity)::DECIMAL,
        'kg'::VARCHAR,
        'info'::VARCHAR
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'Stock Actuel'::VARCHAR,
        SUM(stock_quantity)::DECIMAL,
        'kg'::VARCHAR,
        CASE 
            WHEN SUM(stock_quantity) < SUM(min_stock_level) THEN 'warning'
            ELSE 'ok'
        END::VARCHAR
    FROM products
    
    UNION ALL
    
    SELECT 
        'Produits Stock Faible'::VARCHAR,
        COUNT(*)::DECIMAL,
        'items'::VARCHAR,
        CASE 
            WHEN COUNT(*) > 0 THEN 'warning'
            ELSE 'ok'
        END::VARCHAR
    FROM products
    WHERE stock_quantity <= min_stock_level;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

-- Autoriser lecture pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read clients" ON clients
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow authenticated users to insert clients" ON clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow authenticated users to update clients" ON clients
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow authenticated users to delete clients" ON clients
    FOR DELETE USING (auth.role() = 'authenticated');

-- Produits
CREATE POLICY "Allow all users to read products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to modify products" ON products
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Récoltes
CREATE POLICY "Allow authenticated users to manage harvests" ON harvests
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- =====================================================
-- DONNÉES INITIALES: Produits caisse SAFEM
-- =====================================================
INSERT INTO products (name, category, icon, unit, price, stock_quantity, min_stock_level)
VALUES
    ('Demon', 'Piments', '🌶️', 'FCFA/kg', 2000, 50, 10),
    ('Shamsi', 'Piments', '🌶️', 'FCFA/kg', 2500, 30, 10),
    ('Avenir', 'Piments', '🌶️', 'FCFA/kg', 1800, 40, 10),
    ('The King', 'Piments', '🌶️', 'FCFA/kg', 3000, 20, 8),
    ('Yolo Wander', 'Poivrons', '🫑', 'FCFA/kg', 2000, 35, 10),
    ('De Conti', 'Poivrons', '🫑', 'FCFA/kg', 2500, 28, 8),
    ('Nobili', 'Poivrons', '🫑', 'FCFA/kg', 2200, 32, 10),
    ('Padma', 'Tomates', '🍅', 'FCFA/kg', 1500, 45, 15),
    ('Anita', 'Tomates', '🍅', 'FCFA/kg', 1200, 38, 15),
    ('Africaine', 'Aubergines', '🍆', 'FCFA/kg', 1800, 25, 8),
    ('Bonita', 'Aubergines', '🍆', 'FCFA/kg', 1600, 30, 10),
    ('Ping Tung', 'Aubergines', '🍆', 'FCFA/kg', 2000, 22, 8),
    ('Plantain Ebanga', 'Bananes', '🍌', 'FCFA/kg', 1000, 40, 15),
    ('Banane Douce', 'Bananes', '🍌', 'FCFA/kg', 1200, 35, 12),
    ('Taro Blanc', 'Taros', '🥔', 'FCFA/kg', 1000, 28, 10),
    ('Taro Rouge', 'Taros', '🥔', 'FCFA/kg', 1500, 25, 8),
    ('Chou Averty', 'Autres', '🥬', 'FCFA/kg', 1000, 20, 8),
    ('Gombo Kirikou', 'Autres', '🌿', 'FCFA/kg', 2000, 15, 5),
    ('Concombre Mureino', 'Autres', '🥒', 'FCFA/kg', 1000, 30, 10),
    ('Ciboulette', 'Autres', '🌿', 'FCFA/botte', 500, 25, 10)
ON CONFLICT (name) DO UPDATE SET
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    unit = EXCLUDED.unit,
    price = EXCLUDED.price;

-- =====================================================
-- COMMENTAIRES
-- =====================================================
COMMENT ON TABLE clients IS 'Table des clients (particuliers et professionnels)';
COMMENT ON TABLE products IS 'Base produits caisse SAFEM avec gestion de stock';
COMMENT ON TABLE harvests IS 'Enregistrement des récoltes avec synchronisation automatique du stock';
COMMENT ON COLUMN products.stock_quantity IS 'Quantité en stock (synchronisée avec récoltes et ventes)';
COMMENT ON FUNCTION sync_harvest_to_stock IS 'Ajoute automatiquement les récoltes au stock produits';
COMMENT ON FUNCTION decrement_stock_on_sale IS 'Décrémente le stock lors d''une vente';
COMMENT ON FUNCTION auto_create_client_from_sale IS 'Crée automatiquement un client lors d''une vente si nécessaire';
COMMENT ON VIEW products_stock_movements IS 'Vue consolidée: stock actuel, récoltes et ventes par produit';
COMMENT ON VIEW clients_stats IS 'Vue statistiques clients: achats, montants, dates';

-- =====================================================
-- MESSAGE DE CONFIRMATION
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 003 terminée avec succès!';
    RAISE NOTICE '📋 Tables créées/mises à jour: clients, products, harvests';
    RAISE NOTICE '🔄 Triggers installés: synchronisation automatique stock/ventes/récoltes';
    RAISE NOTICE '👥 Trigger clients: création automatique depuis ventes';
    RAISE NOTICE '📊 Vues créées: products_stock_movements, clients_stats';
    RAISE NOTICE '🔐 RLS activé sur toutes les tables';
END $$;
