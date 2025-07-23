-- Migration pour les commandes produits SAFEM avec géolocalisation
-- À exécuter dans Supabase SQL Editor

-- Ajouter les colonnes de géolocalisation à la table sales existante
ALTER TABLE sales ADD COLUMN IF NOT EXISTS quartier VARCHAR(255);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS address_formatted TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS order_type VARCHAR(50) DEFAULT 'caisse';

-- Créer des index pour optimiser les requêtes géographiques
CREATE INDEX IF NOT EXISTS idx_sales_location ON sales(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_sales_quartier ON sales(quartier);
CREATE INDEX IF NOT EXISTS idx_sales_order_type ON sales(order_type);

-- Table pour les commandes produits (distincte des ventes caisse)
CREATE TABLE IF NOT EXISTS product_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    quartier VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address_formatted TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande produits
-- Note: product_id peut être NULL si le produit est supprimé de la base
CREATE TABLE IF NOT EXISTS product_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES product_orders(id) ON DELETE CASCADE,
    product_id INTEGER, -- Référence optionnelle vers products(id)
    product_name VARCHAR(255) NOT NULL,
    product_icon VARCHAR(10),
    product_category VARCHAR(100),
    quantity DECIMAL(8,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances des commandes produits
CREATE INDEX IF NOT EXISTS idx_product_orders_date ON product_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_product_orders_client ON product_orders(client_name);
CREATE INDEX IF NOT EXISTS idx_product_orders_status ON product_orders(status);
CREATE INDEX IF NOT EXISTS idx_product_orders_location ON product_orders(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_product_orders_quartier ON product_orders(quartier);
CREATE INDEX IF NOT EXISTS idx_product_order_items_order_id ON product_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_order_items_product_id ON product_order_items(product_id) WHERE product_id IS NOT NULL;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_product_orders_updated_at BEFORE UPDATE ON product_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les statistiques combinées (ventes caisse + commandes produits)
-- Note: Cette vue sera créée après l'ajout des colonnes manquantes à la table sales
CREATE OR REPLACE VIEW combined_sales_stats AS
SELECT 
    'caisse' as source,
    id,
    client_name,
    client_phone,
    COALESCE(quartier, '') as quartier,
    latitude,
    longitude,
    COALESCE(address_formatted, '') as address_formatted,
    total_amount,
    sale_date as order_date,
    COALESCE(status, 'completed') as status,
    '' as notes, -- Colonne notes non disponible dans sales existante
    created_at,
    updated_at
FROM sales

UNION ALL

SELECT 
    'produits' as source,
    id,
    client_name,
    client_phone,
    quartier,
    latitude,
    longitude,
    COALESCE(address_formatted, '') as address_formatted,
    total_amount,
    order_date,
    status,
    COALESCE(notes, '') as notes,
    created_at,
    updated_at
FROM product_orders;

-- Supprimer la vue existante si elle existe
DROP VIEW IF EXISTS combined_order_items;

-- Vue pour les articles combinés (version corrigée)
CREATE VIEW combined_order_items AS
SELECT 
    'caisse' as source,
    si.id,
    si.sale_id as order_id,
    CAST(si.product_id AS TEXT) as product_id, -- Conversion explicite INTEGER vers TEXT
    si.product_name,
    '🌱' as product_icon, -- Icône par défaut pour ventes caisse
    'Légumes' as product_category, -- Catégorie par défaut pour ventes caisse
    si.quantity,
    si.unit_price,
    si.total_price,
    si.created_at
FROM sale_items si

UNION ALL

SELECT 
    'produits' as source,
    poi.id,
    poi.order_id,
    CAST(poi.product_id AS TEXT) as product_id, -- Conversion explicite INTEGER vers TEXT
    poi.product_name,
    COALESCE(poi.product_icon, '🌱') as product_icon,
    COALESCE(poi.product_category, 'Légumes') as product_category,
    poi.quantity,
    poi.unit_price,
    poi.total_price,
    poi.created_at
FROM product_order_items poi;

-- Fonction pour calculer la distance entre deux points GPS (en km)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL(10,8),
    lon1 DECIMAL(11,8),
    lat2 DECIMAL(10,8),
    lon2 DECIMAL(11,8)
) RETURNS DECIMAL(10,3) AS $$
DECLARE
    earth_radius DECIMAL := 6371; -- Rayon de la Terre en km
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les commandes dans un rayon donné
CREATE OR REPLACE FUNCTION get_orders_in_radius(
    center_lat DECIMAL(10,8),
    center_lon DECIMAL(11,8),
    radius_km DECIMAL(10,3) DEFAULT 10
) RETURNS TABLE (
    source TEXT,
    id UUID,
    client_name VARCHAR(255),
    quartier VARCHAR(255),
    distance_km DECIMAL(10,3),
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        css.source,
        css.id,
        css.client_name,
        css.quartier,
        calculate_distance(center_lat, center_lon, css.latitude, css.longitude) as distance_km,
        css.total_amount,
        css.order_date
    FROM combined_sales_stats css
    WHERE css.latitude IS NOT NULL 
      AND css.longitude IS NOT NULL
      AND calculate_distance(center_lat, center_lon, css.latitude, css.longitude) <= radius_km
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS (Row Level Security)
ALTER TABLE product_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_order_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour permettre l'accès aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read product_orders" ON product_orders
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert product_orders" ON product_orders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update product_orders" ON product_orders
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read product_order_items" ON product_order_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert product_order_items" ON product_order_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Commentaires pour documentation
COMMENT ON TABLE product_orders IS 'Commandes passées via la page produits avec géolocalisation';
COMMENT ON TABLE product_order_items IS 'Articles des commandes produits';
COMMENT ON COLUMN product_orders.quartier IS 'Quartier de livraison saisi par le client';
COMMENT ON COLUMN product_orders.latitude IS 'Latitude GPS du client (8 décimales de précision)';
COMMENT ON COLUMN product_orders.longitude IS 'Longitude GPS du client (8 décimales de précision)';
COMMENT ON COLUMN product_orders.address_formatted IS 'Adresse formatée obtenue par géocodage inverse';
COMMENT ON FUNCTION calculate_distance IS 'Calcule la distance entre deux points GPS en utilisant la formule de Haversine';
COMMENT ON FUNCTION get_orders_in_radius IS 'Retourne toutes les commandes dans un rayon donné autour d''un point GPS';
