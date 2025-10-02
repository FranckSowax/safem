-- Migration pour les tables de ventes SAFEM
-- À exécuter dans Supabase SQL Editor

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    variety VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'kg',
    category VARCHAR(100),
    icon VARCHAR(10),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(8,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_name);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des produits SAFEM
INSERT INTO products (id, name, variety, price, unit, category, icon, color) VALUES
-- PIMENTS 🌶️
(1, 'Demon', 'Demon', 2000, 'kg', 'PIMENTS', '🌶️', 'yellow'),
(2, 'Shamsi', 'Shamsi', 2000, 'kg', 'PIMENTS', '🌶️', 'yellow'),
(3, 'Avenir', 'Avenir', 4000, 'kg', 'PIMENTS', '🌶️', 'red'),
(4, 'The King', 'The King', 4000, 'kg', 'PIMENTS', '🌶️', 'red'),

-- POIVRONS 🫑
(5, 'Yolo Wander', 'Yolo Wander', 2000, 'kg', 'POIVRONS', '🫑', 'yellow'),
(6, 'De Conti', 'De Conti', 2500, 'kg', 'POIVRONS', '🫑', 'red'),
(7, 'Nobili', 'Nobili', 2500, 'kg', 'POIVRONS', '🫑', 'red'),

-- TOMATES 🍅
(8, 'Padma', 'Padma', 1500, 'kg', 'TOMATES', '🍅', 'yellow'),
(9, 'Anita', 'Anita', 1500, 'kg', 'TOMATES', '🍅', 'yellow'),

-- AUBERGINES 🍆
(10, 'Africaine', 'Africaine (Blanche)', 1000, 'kg', 'AUBERGINES', '🍆', 'green'),
(11, 'Bonika', 'Bonika (Violette)', 1000, 'kg', 'AUBERGINES', '🍆', 'green'),
(12, 'Ping Tung', 'Ping Tung (Chinoise)', 2000, 'kg', 'AUBERGINES', '🍆', 'yellow'),

-- AUTRES LÉGUMES 🥬
(13, 'Chou Aventy', 'Aventy', 1000, 'kg', 'AUTRES', '🥬', 'green'),
(14, 'Gombo Kirikou', 'Kirikou', 2000, 'kg', 'AUTRES', '🫘', 'yellow'),
(15, 'Concombre Murano', 'Murano', 1000, 'kg', 'AUTRES', '🥒', 'green'),
(16, 'Ciboulette', '-', 600, 'kg', 'AUTRES', '🌿', 'green'),

-- BANANES 🍌
(17, 'Plantain Ebanga', 'Ebanga', 1000, 'kg', 'BANANES', '🍌', 'green'),
(18, 'Banane Douce', '-', 1500, 'kg', 'BANANES', '🍌', 'yellow'),

-- TAROS 🍠
(20, 'Taro Blanc', '-', 1000, 'kg', 'TAROS', '🍠', 'green'),
(21, 'Taro Rouge', '-', 1500, 'kg', 'TAROS', '🍠', 'yellow')

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    variety = EXCLUDED.variety,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    updated_at = NOW();

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour permettre l'accès aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read clients" ON clients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert clients" ON clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update clients" ON clients
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read products" ON products
    FOR SELECT USING (true); -- Produits lisibles par tous

CREATE POLICY "Allow authenticated users to manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage sales" ON sales
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage sale_items" ON sale_items
    FOR ALL USING (auth.role() = 'authenticated');
