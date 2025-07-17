-- =====================================================
-- CORRECTION DES IDs PRODUITS : UUID -> INTEGER
-- =====================================================

-- 1. Supprimer les contraintes de clé étrangère
ALTER TABLE sale_items DROP CONSTRAINT IF EXISTS sale_items_product_id_fkey;

-- 2. Modifier le type de product_id dans products
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE products ALTER COLUMN id TYPE INTEGER USING (CASE WHEN id ~ '^[0-9]+$' THEN id::INTEGER ELSE ROW_NUMBER() OVER() END);
ALTER TABLE products ADD PRIMARY KEY (id);

-- 3. Modifier le type de product_id dans sale_items
ALTER TABLE sale_items ALTER COLUMN product_id TYPE INTEGER USING (CASE WHEN product_id ~ '^[0-9]+$' THEN product_id::INTEGER ELSE NULL END);

-- 4. Recréer la contrainte de clé étrangère
ALTER TABLE sale_items ADD CONSTRAINT sale_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id);

-- 5. Supprimer les données existantes et réinsérer avec les bons IDs
DELETE FROM sale_items;
DELETE FROM sales;
DELETE FROM products;

-- 6. Réinsérer les produits avec IDs numériques
INSERT INTO products (id, name, variety, price, unit, category_id, description, stock_quantity, min_stock_level, status) VALUES
-- PIMENTS 🌶️
(1, 'Demon', 'Demon', 2000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'PIMENTS'), 'Piment Demon - Variété productive', 50.00, 10.00, 'active'),
(2, 'Shamsi', 'Shamsi', 2000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'PIMENTS'), 'Piment Shamsi - Variété résistante', 45.00, 10.00, 'active'),
(3, 'Avenir', 'Avenir', 4000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'PIMENTS'), 'Piment Avenir - Variété premium', 30.00, 5.00, 'active'),
(4, 'The King', 'The King', 4000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'PIMENTS'), 'Piment The King - Variété haut de gamme', 25.00, 5.00, 'active'),

-- POIVRONS 🫑
(5, 'Yolo Wander', 'Yolo Wander', 2000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'POIVRONS'), 'Poivron Yolo Wander - Variété jaune', 40.00, 8.00, 'active'),
(6, 'De Conti', 'De Conti', 2500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'POIVRONS'), 'Poivron De Conti - Variété rouge', 35.00, 8.00, 'active'),
(7, 'Nobili', 'Nobili', 2500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'POIVRONS'), 'Poivron Nobili - Variété premium', 30.00, 8.00, 'active'),

-- TOMATES 🍅
(8, 'Padma', 'Padma', 1500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'TOMATES'), 'Tomate Padma - Variété précoce', 60.00, 15.00, 'active'),
(9, 'Anita', 'Anita', 1500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'TOMATES'), 'Tomate Anita - Variété productive', 55.00, 15.00, 'active'),

-- AUBERGINES 🍆
(10, 'Black Beauty', 'Black Beauty', 2500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'AUBERGINES'), 'Aubergine Black Beauty - Variété classique', 35.00, 8.00, 'active'),
(11, 'Violette de Barbentane', 'Violette de Barbentane', 3000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'AUBERGINES'), 'Aubergine Violette - Variété française', 25.00, 5.00, 'active'),

-- CONCOMBRES 🥒
(12, 'Marketmore', 'Marketmore', 1800.00, 'kg', (SELECT id FROM product_categories WHERE name = 'CONCOMBRES'), 'Concombre Marketmore - Variété résistante', 40.00, 10.00, 'active'),
(13, 'Suyo Long', 'Suyo Long', 2000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'CONCOMBRES'), 'Concombre Suyo Long - Variété asiatique', 35.00, 10.00, 'active'),

-- COURGETTES 🥒
(14, 'Black Beauty Zucchini', 'Black Beauty', 1800.00, 'kg', (SELECT id FROM product_categories WHERE name = 'COURGETTES'), 'Courgette Black Beauty - Variété productive', 45.00, 10.00, 'active'),
(15, 'Eight Ball', 'Eight Ball', 2200.00, 'kg', (SELECT id FROM product_categories WHERE name = 'COURGETTES'), 'Courgette Eight Ball - Variété ronde', 30.00, 8.00, 'active'),

-- HARICOTS VERTS 🫘
(16, 'Provider', 'Provider', 3500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'HARICOTS'), 'Haricot Provider - Variété naine', 25.00, 5.00, 'active'),
(17, 'Cherokee Trail of Tears', 'Cherokee', 4000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'HARICOTS'), 'Haricot Cherokee - Variété ancienne', 20.00, 5.00, 'active'),

-- LAITUES 🥬
(18, 'Buttercrunch', 'Buttercrunch', 1200.00, 'kg', (SELECT id FROM product_categories WHERE name = 'LAITUES'), 'Laitue Buttercrunch - Variété croquante', 50.00, 12.00, 'active'),
(19, 'Red Sails', 'Red Sails', 1500.00, 'kg', (SELECT id FROM product_categories WHERE name = 'LAITUES'), 'Laitue Red Sails - Variété rouge', 40.00, 12.00, 'active'),

-- RADIS 🔴
(20, 'Cherry Belle', 'Cherry Belle', 800.00, 'kg', (SELECT id FROM product_categories WHERE name = 'RADIS'), 'Radis Cherry Belle - Variété ronde', 60.00, 15.00, 'active'),
(21, 'French Breakfast', 'French Breakfast', 1000.00, 'kg', (SELECT id FROM product_categories WHERE name = 'RADIS'), 'Radis French Breakfast - Variété allongée', 55.00, 15.00, 'active');

-- 7. Réinitialiser la séquence pour les prochains IDs
SELECT setval(pg_get_serial_sequence('products', 'id'), 21, true);

COMMIT;
