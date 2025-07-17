-- =====================================================
-- SCHÉMA COMPLET SUPABASE POUR DASHBOARD SAFEM
-- =====================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: CLIENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    client_type VARCHAR(50) DEFAULT 'particulier' CHECK (client_type IN ('particulier', 'restaurant', 'distributeur')),
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    total_purchases DECIMAL(12,2) DEFAULT 0.00,
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: CATEGORIES DE PRODUITS
-- =====================================================
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#10B981',
    icon VARCHAR(50) DEFAULT 'leaf',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: PRODUITS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES product_categories(id),
    description TEXT,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity DECIMAL(10,2) DEFAULT 0.00,
    min_stock_level DECIMAL(10,2) DEFAULT 5.00,
    max_stock_level DECIMAL(10,2) DEFAULT 100.00,
    quality_grade VARCHAR(10) DEFAULT 'A' CHECK (quality_grade IN ('A', 'B', 'C')),
    is_active BOOLEAN DEFAULT TRUE,
    supplier VARCHAR(255),
    harvest_season VARCHAR(50),
    storage_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: VENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'mobile_money', 'bank_transfer', 'check', 'credit')),
    payment_status VARCHAR(20) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'partial', 'cancelled')),
    delivery_address TEXT,
    delivery_date TIMESTAMP WITH TIME ZONE,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'cancelled', 'refunded')),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ARTICLES DE VENTE
-- =====================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    quality_grade VARCHAR(10) DEFAULT 'A',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: STOCK / INVENTAIRE
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    quantity_in DECIMAL(10,2) DEFAULT 0.00,
    quantity_out DECIMAL(10,2) DEFAULT 0.00,
    current_stock DECIMAL(10,2) NOT NULL,
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'waste', 'harvest', 'transfer')),
    reference_id UUID, -- ID de la vente, achat, etc.
    reference_type VARCHAR(50), -- 'sale', 'purchase', 'adjustment'
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(12,2),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ÉQUIPE / EMPLOYÉS
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'sales', 'harvest', 'delivery', 'accountant')),
    department VARCHAR(50) CHECK (department IN ('sales', 'production', 'logistics', 'administration')),
    hire_date DATE,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: RÉCOLTES
-- =====================================================
CREATE TABLE IF NOT EXISTS harvests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity_harvested DECIMAL(10,2) NOT NULL,
    quality_grade VARCHAR(10) DEFAULT 'A' CHECK (quality_grade IN ('A', 'B', 'C')),
    harvest_date DATE NOT NULL,
    field_location VARCHAR(255),
    weather_conditions VARCHAR(100),
    harvested_by UUID REFERENCES team_members(id),
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    expected_shelf_life INTEGER, -- en jours
    storage_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: FOURNISSEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    supplier_type VARCHAR(50) CHECK (supplier_type IN ('seeds', 'fertilizer', 'equipment', 'packaging')),
    payment_terms VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    total_purchases DECIMAL(12,2) DEFAULT 0.00,
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ACHATS / APPROVISIONNEMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id),
    supplier_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
    delivery_date DATE,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_number VARCHAR(100),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ARTICLES D'ACHAT
-- =====================================================
CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    expiry_date DATE,
    batch_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ALERTES SYSTÈME
-- =====================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('low_stock', 'expiry', 'no_sales', 'high_demand', 'system', 'payment_due')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    entity_type VARCHAR(50), -- 'product', 'sale', 'client', etc.
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(type, entity_type, entity_id) -- Contrainte unique pour éviter les doublons
);

-- =====================================================
-- TABLE: RAPPORTS FINANCIERS
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    total_costs DECIMAL(12,2) DEFAULT 0.00,
    gross_profit DECIMAL(12,2) DEFAULT 0.00,
    net_profit DECIMAL(12,2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    average_sale_value DECIMAL(10,2) DEFAULT 0.00,
    top_selling_products JSONB DEFAULT '[]',
    report_data JSONB DEFAULT '{}',
    generated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: PARAMÈTRES SYSTÈME
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VUES POUR LES STATISTIQUES
-- =====================================================

-- Vue pour les statistiques de ventes quotidiennes
CREATE OR REPLACE VIEW daily_sales_stats AS
SELECT 
    DATE(sale_date) as sale_date,
    COUNT(*) as total_sales,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_sale,
    COUNT(DISTINCT client_id) as unique_customers
FROM sales 
WHERE status = 'completed'
GROUP BY DATE(sale_date)
ORDER BY sale_date DESC;

-- Vue pour les produits les plus vendus
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
    p.name,
    p.category_id,
    SUM(si.quantity) as total_quantity_sold,
    SUM(si.total_price) as total_revenue,
    COUNT(DISTINCT si.sale_id) as number_of_sales,
    AVG(si.unit_price) as average_price
FROM sale_items si
JOIN products p ON si.product_id = p.id
JOIN sales s ON si.sale_id = s.id
WHERE s.status = 'completed'
GROUP BY p.id, p.name, p.category_id
ORDER BY total_revenue DESC;

-- Vue pour les alertes de stock faible
CREATE OR REPLACE VIEW low_stock_alerts AS
SELECT 
    p.id,
    p.name,
    p.stock_quantity,
    p.min_stock_level,
    pc.name as category_name,
    (p.min_stock_level - p.stock_quantity) as shortage_amount
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE p.stock_quantity <= p.min_stock_level 
AND p.is_active = TRUE;

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour mettre à jour le stock après une vente
CREATE OR REPLACE FUNCTION update_stock_after_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Diminuer le stock du produit
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    -- Enregistrer le mouvement de stock
    INSERT INTO inventory (
        product_id, 
        quantity_out, 
        current_stock, 
        movement_type, 
        reference_id, 
        reference_type,
        unit_cost,
        total_value
    )
    SELECT 
        NEW.product_id,
        NEW.quantity,
        p.stock_quantity,
        'sale',
        NEW.sale_id,
        'sale',
        NEW.unit_price,
        NEW.total_price
    FROM products p WHERE p.id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le stock après un achat
CREATE OR REPLACE FUNCTION update_stock_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- Augmenter le stock du produit
    UPDATE products 
    SET stock_quantity = stock_quantity + NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    -- Enregistrer le mouvement de stock
    INSERT INTO inventory (
        product_id, 
        quantity_in, 
        current_stock, 
        movement_type, 
        reference_id, 
        reference_type,
        unit_cost,
        total_value
    )
    SELECT 
        NEW.product_id,
        NEW.quantity,
        p.stock_quantity,
        'purchase',
        NEW.purchase_id,
        'purchase',
        NEW.unit_price,
        NEW.total_price
    FROM products p WHERE p.id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer des alertes automatiques
CREATE OR REPLACE FUNCTION create_low_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
    -- Créer une alerte si le stock est faible
    IF NEW.stock_quantity <= NEW.min_stock_level THEN
        INSERT INTO alerts (
            type, 
            title, 
            message, 
            severity, 
            entity_type, 
            entity_id
        )
        VALUES (
            'low_stock',
            'Stock faible: ' || NEW.name,
            'Le produit ' || NEW.name || ' a un stock de ' || NEW.stock_quantity || ' ' || NEW.unit || ', en dessous du seuil minimum de ' || NEW.min_stock_level,
            CASE 
                WHEN NEW.stock_quantity <= (NEW.min_stock_level * 0.5) THEN 'critical'
                WHEN NEW.stock_quantity <= (NEW.min_stock_level * 0.8) THEN 'high'
                ELSE 'medium'
            END,
            'product',
            NEW.id
        )
        ON CONFLICT (type, entity_type, entity_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger pour mettre à jour le stock après une vente
CREATE TRIGGER trigger_update_stock_after_sale
    AFTER INSERT ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_sale();

-- Trigger pour mettre à jour le stock après un achat
CREATE TRIGGER trigger_update_stock_after_purchase
    AFTER INSERT ON purchase_items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_purchase();

-- Trigger pour créer des alertes de stock faible
CREATE TRIGGER trigger_create_low_stock_alert
    AFTER UPDATE OF stock_quantity ON products
    FOR EACH ROW
    EXECUTE FUNCTION create_low_stock_alert();

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_purchases_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public read access" ON clients;
DROP POLICY IF EXISTS "Public insert access" ON clients;
DROP POLICY IF EXISTS "Public update access" ON clients;
DROP POLICY IF EXISTS "Public read access" ON product_categories;
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read access" ON sales;
DROP POLICY IF EXISTS "Public insert access" ON sales;
DROP POLICY IF EXISTS "Public update access" ON sales;
DROP POLICY IF EXISTS "Public read access" ON sale_items;
DROP POLICY IF EXISTS "Public insert access" ON sale_items;
DROP POLICY IF EXISTS "Public read access" ON inventory;
DROP POLICY IF EXISTS "Public insert access" ON inventory;
DROP POLICY IF EXISTS "Public read access" ON team_members;
DROP POLICY IF EXISTS "Public read access" ON harvests;
DROP POLICY IF EXISTS "Public read access" ON suppliers;
DROP POLICY IF EXISTS "Public read access" ON purchases;
DROP POLICY IF EXISTS "Public read access" ON purchase_items;
DROP POLICY IF EXISTS "Public read access" ON alerts;
DROP POLICY IF EXISTS "Public read access" ON financial_reports;
DROP POLICY IF EXISTS "Public read access" ON system_settings;

-- Créer les politiques pour accès public (pour l'application)
CREATE POLICY "Public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON clients FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

CREATE POLICY "Public read access" ON sales FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON sales FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON sale_items FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON sale_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON inventory FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON harvests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON purchases FOR SELECT USING (true);
CREATE POLICY "Public read access" ON purchase_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON financial_reports FOR SELECT USING (true);
CREATE POLICY "Public read access" ON system_settings FOR SELECT USING (true);

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Insérer les catégories de produits
INSERT INTO product_categories (name, description, color, icon) VALUES
('Légumes Feuilles', 'Légumes à feuilles vertes', '#10B981', 'leaf'),
('Légumes Fruits', 'Légumes fruits comme tomates, poivrons', '#F59E0B', 'fruit'),
('Légumes Racines', 'Légumes racines et tubercules', '#8B5CF6', 'root'),
('Épices', 'Épices et aromates', '#EF4444', 'spice'),
('Fruits', 'Fruits tropicaux', '#F97316', 'apple')
ON CONFLICT (name) DO NOTHING;

-- Insérer les produits SAFEM
INSERT INTO products (name, category_id, description, unit, price, cost_price, stock_quantity, min_stock_level) 
SELECT 
    p.name,
    pc.id,
    p.description,
    p.unit,
    p.price,
    p.price * 0.6, -- Coût estimé à 60% du prix de vente
    p.stock,
    p.min_stock
FROM (VALUES
    ('Poivron De conti', 'Légumes Fruits', 'Poivron rouge de qualité premium', 'kg', 2250, 50, 10),
    ('Tomate Padma', 'Légumes Fruits', 'Tomate rouge ferme et savoureuse', 'kg', 1500, 80, 15),
    ('Piment Demon', 'Épices', 'Piment très fort pour assaisonnement', 'kg', 3000, 12, 5),
    ('Chou Aventy', 'Légumes Feuilles', 'Chou blanc croquant', 'kg', 1000, 30, 8),
    ('Gombo Kirikou', 'Légumes Fruits', 'Gombo frais et tendre', 'kg', 2000, 25, 10),
    ('Concombre Murano', 'Légumes Fruits', 'Concombre frais et croquant', 'kg', 1000, 40, 12),
    ('Aubergine Africaine', 'Légumes Fruits', 'Aubergine locale violette', 'kg', 1500, 35, 10),
    ('Banane plantain Ebanga', 'Fruits', 'Banane plantain mûre', 'kg', 1000, 120, 20),
    ('Taro blanc', 'Légumes Racines', 'Tubercule de taro blanc', 'kg', 1000, 45, 15),
    ('Manioc Mvondo', 'Légumes Racines', 'Manioc frais pelé', 'kg', 800, 60, 20),
    ('Igname Essingang', 'Légumes Racines', 'Igname blanche de qualité', 'kg', 1200, 40, 12),
    ('Patate douce Mbanga', 'Légumes Racines', 'Patate douce orange', 'kg', 900, 35, 15),
    ('Épinard Fom', 'Légumes Feuilles', 'Épinard local frais', 'botte', 500, 25, 8),
    ('Oseille Kelen', 'Légumes Feuilles', 'Oseille fraîche', 'botte', 600, 20, 6),
    ('Persil Ndolé', 'Légumes Feuilles', 'Persil frais aromatique', 'botte', 400, 30, 10),
    ('Céleri Akpi', 'Légumes Feuilles', 'Céleri frais', 'botte', 700, 15, 5),
    ('Carotte Bikutsi', 'Légumes Racines', 'Carotte orange croquante', 'kg', 1100, 40, 12),
    ('Betterave Makossa', 'Légumes Racines', 'Betterave rouge sucrée', 'kg', 1300, 25, 8),
    ('Radis Assiko', 'Légumes Racines', 'Radis blanc piquant', 'kg', 800, 20, 6),
    ('Gingembre Bikutsi', 'Épices', 'Gingembre frais', 'kg', 2500, 15, 5),
    ('Ail Benskin', 'Épices', 'Ail frais en gousses', 'kg', 3500, 10, 3)
) AS p(name, category, description, unit, price, stock, min_stock)
JOIN product_categories pc ON pc.name = p.category
ON CONFLICT (name) DO NOTHING;

-- Insérer quelques paramètres système
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('company_name', 'SAFEM', 'string', 'Nom de l''entreprise', true),
('currency', 'FCFA', 'string', 'Devise utilisée', true),
('tax_rate', '0.00', 'number', 'Taux de taxe par défaut', false),
('low_stock_threshold', '10', 'number', 'Seuil d''alerte stock faible', false),
('dashboard_refresh_interval', '30', 'number', 'Intervalle de rafraîchissement dashboard (secondes)', true)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- =====================================================

-- Index sur les ventes
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

-- Index sur les articles de vente
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);

-- Index sur les produits
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- Index sur l'inventaire
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory(movement_type);

-- Index sur les alertes
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON alerts(entity_type, entity_id);

-- =====================================================
-- COMMENTAIRES POUR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE clients IS 'Table des clients avec informations de contact et historique d''achats';
COMMENT ON TABLE products IS 'Catalogue des produits SAFEM avec prix et stock';
COMMENT ON TABLE sales IS 'Enregistrement de toutes les ventes effectuées';
COMMENT ON TABLE sale_items IS 'Détail des articles vendus dans chaque vente';
COMMENT ON TABLE inventory IS 'Historique des mouvements de stock';
COMMENT ON TABLE team_members IS 'Équipe et employés de SAFEM';
COMMENT ON TABLE harvests IS 'Enregistrement des récoltes';
COMMENT ON TABLE alerts IS 'Système d''alertes automatiques';
COMMENT ON TABLE financial_reports IS 'Rapports financiers générés automatiquement';

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================
