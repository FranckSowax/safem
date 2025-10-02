-- =====================================================
-- SCHÉMA SIMPLIFIÉ SUPABASE POUR SAFEM
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
    client_type VARCHAR(50) DEFAULT 'particulier',
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
    name VARCHAR(255) NOT NULL UNIQUE,
    category_id UUID REFERENCES product_categories(id),
    description TEXT,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity DECIMAL(10,2) DEFAULT 0.00,
    min_stock_level DECIMAL(10,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE,
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
    payment_method VARCHAR(50) DEFAULT 'cash',
    payment_status VARCHAR(20) DEFAULT 'paid',
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'completed',
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: INVENTAIRE
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    quantity_in DECIMAL(10,2) DEFAULT 0.00,
    quantity_out DECIMAL(10,2) DEFAULT 0.00,
    current_stock DECIMAL(10,2) NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: ALERTES SYSTÈME
-- =====================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(type, entity_type, entity_id)
);

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
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Politiques pour accès public (pour l'application)
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

CREATE POLICY "Public read access" ON alerts FOR SELECT USING (true);

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
    p.price * 0.6,
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

-- =====================================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);

-- =====================================================
-- FIN DU SCHÉMA SIMPLIFIÉ
-- =====================================================
