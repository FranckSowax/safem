-- =====================================================
-- SETUP COMPLET SAFEM - Gestion Clients & Synchronisation
-- Projet: iwwgbmukenmxumfxibsz.supabase.co
-- À exécuter dans: https://supabase.com/dashboard/project/iwwgbmukenmxumfxibsz/sql
-- =====================================================

-- =====================================================
-- 1️⃣ TABLE: CLIENTS
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

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(client_type);

COMMENT ON TABLE clients IS 'Clients SAFEM (particuliers et professionnels)';

-- =====================================================
-- 2️⃣ TABLE: PRODUCTS (Base produits caisse)
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

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

COMMENT ON TABLE products IS 'Base produits caisse SAFEM avec stock automatique';

-- =====================================================
-- 3️⃣ TABLE: SALES (Ventes)
-- =====================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_phone VARCHAR(20),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_client_name ON sales(client_name);

COMMENT ON TABLE sales IS 'Enregistrement des ventes SAFEM';

-- =====================================================
-- 4️⃣ TABLE: SALE_ITEMS (Articles vendus)
-- =====================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

COMMENT ON TABLE sale_items IS 'Détails des articles par vente';

-- =====================================================
-- 5️⃣ TABLE: HARVESTS (Récoltes)
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

CREATE INDEX IF NOT EXISTS idx_harvests_date ON harvests(harvest_date);
CREATE INDEX IF NOT EXISTS idx_harvests_product_id ON harvests(product_id);
CREATE INDEX IF NOT EXISTS idx_harvests_added_to_stock ON harvests(added_to_stock);

COMMENT ON TABLE harvests IS 'Enregistrement des récoltes avec sync stock automatique';

-- =====================================================
-- 6️⃣ FONCTION: Mise à jour automatique updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
CREATE TRIGGER update_sales_updated_at 
    BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_harvests_updated_at ON harvests;
CREATE TRIGGER update_harvests_updated_at 
    BEFORE UPDATE ON harvests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7️⃣ TRIGGER: Récolte → Stock (Ajout automatique)
-- =====================================================
CREATE OR REPLACE FUNCTION sync_harvest_to_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Ajouter la quantité récoltée au stock
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

DROP TRIGGER IF EXISTS trigger_sync_harvest_to_stock ON harvests;
CREATE TRIGGER trigger_sync_harvest_to_stock
    BEFORE INSERT OR UPDATE ON harvests
    FOR EACH ROW
    EXECUTE FUNCTION sync_harvest_to_stock();

-- =====================================================
-- 8️⃣ TRIGGER: Vente → Stock (Décrémentation automatique)
-- =====================================================
CREATE OR REPLACE FUNCTION decrement_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id INTEGER;
BEGIN
    -- Récupérer product_id depuis le nom
    SELECT id INTO v_product_id
    FROM products
    WHERE name = NEW.product_name
    LIMIT 1;
    
    -- Décrémenter le stock
    IF v_product_id IS NOT NULL THEN
        UPDATE products
        SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity),
            updated_at = NOW()
        WHERE id = v_product_id;
        
        -- Mettre à jour product_id si NULL
        IF NEW.product_id IS NULL THEN
            NEW.product_id = v_product_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decrement_stock_on_sale ON sale_items;
CREATE TRIGGER trigger_decrement_stock_on_sale
    BEFORE INSERT ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION decrement_stock_on_sale();

-- =====================================================
-- 9️⃣ TRIGGER: Annulation vente → Stock (Restauration)
-- =====================================================
CREATE OR REPLACE FUNCTION restore_stock_on_sale_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id INTEGER;
BEGIN
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

DROP TRIGGER IF EXISTS trigger_restore_stock_on_sale_delete ON sale_items;
CREATE TRIGGER trigger_restore_stock_on_sale_delete
    AFTER DELETE ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION restore_stock_on_sale_delete();

-- =====================================================
-- 🔟 TRIGGER: Vente → Client (Création automatique)
-- =====================================================
CREATE OR REPLACE FUNCTION auto_create_client_from_sale()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id UUID;
BEGIN
    -- Si pas de client_id mais un nom fourni
    IF NEW.client_id IS NULL AND NEW.client_name IS NOT NULL THEN
        
        -- Chercher client par téléphone
        IF NEW.client_phone IS NOT NULL THEN
            SELECT id INTO v_client_id
            FROM clients
            WHERE phone = NEW.client_phone
            LIMIT 1;
        END IF;
        
        -- Si pas trouvé, chercher par nom
        IF v_client_id IS NULL THEN
            SELECT id INTO v_client_id
            FROM clients
            WHERE name = NEW.client_name
            LIMIT 1;
        END IF;
        
        -- Si toujours pas trouvé, créer nouveau client
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

DROP TRIGGER IF EXISTS trigger_auto_create_client_from_sale ON sales;
CREATE TRIGGER trigger_auto_create_client_from_sale
    BEFORE INSERT ON sales
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_client_from_sale();

-- =====================================================
-- 📊 VUE: Stock et mouvements produits
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
-- 📊 VUE: Statistiques clients
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
-- 📊 FONCTION: Rapport de synchronisation
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
        'Total Récoltes (30j)'::VARCHAR AS metric,
        COALESCE(SUM(quantity), 0)::DECIMAL AS value,
        'kg'::VARCHAR AS unit,
        'info'::VARCHAR AS status
    FROM harvests
    WHERE harvest_date >= CURRENT_DATE - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'Total Ventes (30j)'::VARCHAR,
        COALESCE(SUM(si.quantity), 0)::DECIMAL,
        'kg'::VARCHAR,
        'info'::VARCHAR
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'Stock Total Actuel'::VARCHAR,
        COALESCE(SUM(stock_quantity), 0)::DECIMAL,
        'kg'::VARCHAR,
        CASE 
            WHEN COALESCE(SUM(stock_quantity), 0) < COALESCE(SUM(min_stock_level), 0) THEN 'warning'
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
-- 🔐 ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

-- Politiques pour clients
DROP POLICY IF EXISTS "Allow all to read clients" ON clients;
CREATE POLICY "Allow all to read clients" ON clients
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all to insert clients" ON clients;
CREATE POLICY "Allow all to insert clients" ON clients
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all to update clients" ON clients;
CREATE POLICY "Allow all to update clients" ON clients
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all to delete clients" ON clients;
CREATE POLICY "Allow all to delete clients" ON clients
    FOR DELETE USING (true);

-- Politiques pour products
DROP POLICY IF EXISTS "Allow all to manage products" ON products;
CREATE POLICY "Allow all to manage products" ON products
    FOR ALL USING (true);

-- Politiques pour sales
DROP POLICY IF EXISTS "Allow all to manage sales" ON sales;
CREATE POLICY "Allow all to manage sales" ON sales
    FOR ALL USING (true);

-- Politiques pour sale_items
DROP POLICY IF EXISTS "Allow all to manage sale_items" ON sale_items;
CREATE POLICY "Allow all to manage sale_items" ON sale_items
    FOR ALL USING (true);

-- Politiques pour harvests
DROP POLICY IF EXISTS "Allow all to manage harvests" ON harvests;
CREATE POLICY "Allow all to manage harvests" ON harvests
    FOR ALL USING (true);

-- =====================================================
-- 📦 DONNÉES INITIALES: 20 Produits SAFEM
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
-- ✅ VÉRIFICATION ET MESSAGE FINAL
-- =====================================================
DO $$
DECLARE
    v_tables_count INTEGER;
    v_triggers_count INTEGER;
    v_products_count INTEGER;
BEGIN
    -- Compter les tables créées
    SELECT COUNT(*) INTO v_tables_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('clients', 'products', 'sales', 'sale_items', 'harvests');
    
    -- Compter les triggers
    SELECT COUNT(*) INTO v_triggers_count
    FROM information_schema.triggers 
    WHERE event_object_table IN ('clients', 'products', 'sales', 'sale_items', 'harvests');
    
    -- Compter les produits
    SELECT COUNT(*) INTO v_products_count FROM products;
    
    RAISE NOTICE '====================================================';
    RAISE NOTICE '✅ SETUP SAFEM TERMINÉ AVEC SUCCÈS!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tables créées: % / 5', v_tables_count;
    RAISE NOTICE '   - clients (gestion clients)';
    RAISE NOTICE '   - products (base produits caisse)';
    RAISE NOTICE '   - sales (ventes)';
    RAISE NOTICE '   - sale_items (détails ventes)';
    RAISE NOTICE '   - harvests (récoltes)';
    RAISE NOTICE '';
    RAISE NOTICE '⚡ Triggers activés: %', v_triggers_count;
    RAISE NOTICE '   - Récolte → Stock (ajout auto)';
    RAISE NOTICE '   - Vente → Stock (décrémentation auto)';
    RAISE NOTICE '   - Annulation → Stock (restauration)';
    RAISE NOTICE '   - Vente → Client (création auto)';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Produits chargés: % / 20', v_products_count;
    RAISE NOTICE '';
    RAISE NOTICE '📊 Vues créées:';
    RAISE NOTICE '   - products_stock_movements';
    RAISE NOTICE '   - clients_stats';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 RLS activé sur toutes les tables';
    RAISE NOTICE '';
    RAISE NOTICE '====================================================';
    RAISE NOTICE '🚀 Prêt à utiliser! Accédez au dashboard:';
    RAISE NOTICE '   http://localhost:3001/dashboard → Clients';
    RAISE NOTICE '====================================================';
END $$;
