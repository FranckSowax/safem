-- =====================================================
-- SCHÉMA ABONNEMENTS SAFEM - LIVRAISONS RÉCURRENTES
-- =====================================================

-- =====================================================
-- TABLE: ABONNEMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    client_email VARCHAR(255),
    client_type VARCHAR(50) DEFAULT 'particulier' CHECK (client_type IN ('particulier', 'pro')),
    
    -- Détails de l'abonnement
    subscription_name VARCHAR(255) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'pending')),
    
    -- Dates
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    next_delivery_date DATE NOT NULL,
    last_delivery_date DATE,
    
    -- Livraison
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    preferred_delivery_time VARCHAR(50),
    
    -- Financier
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    
    -- Index pour les requêtes fréquentes
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- =====================================================
-- TABLE: ARTICLES D'ABONNEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(255),
    
    -- Quantité et prix
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Disponibilité
    is_available BOOLEAN DEFAULT true,
    substitute_product_id UUID REFERENCES products(id),
    substitute_notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_price CHECK (unit_price >= 0 AND total_price >= 0)
);

-- =====================================================
-- TABLE: LIVRAISONS D'ABONNEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    
    -- Détails de la livraison
    delivery_date DATE NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'preparing', 'out_for_delivery', 'delivered', 'failed', 'cancelled')),
    
    -- Contenu de la livraison
    total_items INTEGER DEFAULT 0,
    total_weight DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    
    -- Livraison
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    delivered_by VARCHAR(255),
    delivery_proof TEXT, -- URL photo ou signature
    
    -- Feedback client
    client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
    client_feedback TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: ARTICLES DE LIVRAISON
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_delivery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID REFERENCES subscription_deliveries(id) ON DELETE CASCADE,
    subscription_item_id UUID REFERENCES subscription_items(id),
    product_id UUID REFERENCES products(id),
    
    -- Détails du produit livré
    product_name VARCHAR(255) NOT NULL,
    quantity_ordered DECIMAL(10,2) NOT NULL,
    quantity_delivered DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Substitutions
    is_substitute BOOLEAN DEFAULT false,
    original_product_id UUID REFERENCES products(id),
    substitute_reason TEXT,
    
    -- Qualité
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    quality_notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEX POUR PERFORMANCE
-- =====================================================

-- Index pour les abonnements
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_frequency ON subscriptions(frequency);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_type ON subscriptions(client_type);

-- Index pour les articles d'abonnement
CREATE INDEX IF NOT EXISTS idx_subscription_items_subscription_id ON subscription_items(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_items_product_id ON subscription_items(product_id);

-- Index pour les livraisons
CREATE INDEX IF NOT EXISTS idx_subscription_deliveries_subscription_id ON subscription_deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_deliveries_status ON subscription_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_subscription_deliveries_date ON subscription_deliveries(delivery_date);

-- Index pour les articles de livraison
CREATE INDEX IF NOT EXISTS idx_subscription_delivery_items_delivery_id ON subscription_delivery_items(delivery_id);
CREATE INDEX IF NOT EXISTS idx_subscription_delivery_items_product_id ON subscription_delivery_items(product_id);

-- =====================================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_items_updated_at 
    BEFORE UPDATE ON subscription_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_deliveries_updated_at 
    BEFORE UPDATE ON subscription_deliveries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour calculer la prochaine date de livraison
CREATE OR REPLACE FUNCTION calculate_next_delivery_date(
    base_date DATE,
    frequency VARCHAR(20)
) RETURNS DATE AS $$
BEGIN
    CASE frequency
        WHEN 'weekly' THEN
            RETURN base_date + INTERVAL '7 days';
        WHEN 'biweekly' THEN
            RETURN base_date + INTERVAL '14 days';
        WHEN 'monthly' THEN
            RETURN base_date + INTERVAL '1 month';
        ELSE
            RETURN base_date + INTERVAL '7 days'; -- Par défaut hebdomadaire
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le statut d'un abonnement
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Si une livraison est complétée, mettre à jour la date de dernière livraison
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE subscriptions 
        SET 
            last_delivery_date = NEW.delivery_date,
            next_delivery_date = calculate_next_delivery_date(NEW.delivery_date, 
                (SELECT frequency FROM subscriptions WHERE id = NEW.subscription_id))
        WHERE id = NEW.subscription_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger
CREATE TRIGGER subscription_delivery_status_update
    AFTER UPDATE ON subscription_deliveries
    FOR EACH ROW EXECUTE FUNCTION update_subscription_status();

-- =====================================================
-- POLITIQUES DE SÉCURITÉ RLS
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_delivery_items ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès public pour le développement (à ajuster en production)
CREATE POLICY "Public read access" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON subscriptions FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON subscriptions FOR DELETE USING (true);

CREATE POLICY "Public read access" ON subscription_items FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON subscription_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON subscription_items FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON subscription_items FOR DELETE USING (true);

CREATE POLICY "Public read access" ON subscription_deliveries FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON subscription_deliveries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON subscription_deliveries FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON subscription_deliveries FOR DELETE USING (true);

CREATE POLICY "Public read access" ON subscription_delivery_items FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON subscription_delivery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON subscription_delivery_items FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON subscription_delivery_items FOR DELETE USING (true);

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer quelques abonnements de test
INSERT INTO subscriptions (
    client_name, client_phone, client_email, client_type,
    subscription_name, frequency, delivery_address, total_amount, final_amount
) VALUES 
(
    'Restaurant Le Jardin', '+241 01 23 45 67', 'contact@lejardin.ga', 'pro',
    'Panier Légumes Pro', 'weekly', '123 Avenue de la République, Libreville',
    25000, 22500
),
(
    'Marie Dubois', '+241 07 89 12 34', 'marie.dubois@email.com', 'particulier',
    'Panier Familial', 'biweekly', '456 Rue des Palmiers, Port-Gentil',
    15000, 15000
) ON CONFLICT DO NOTHING;

-- Message de confirmation
SELECT 'Schéma des abonnements SAFEM créé avec succès!' as message;
