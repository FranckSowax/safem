-- =====================================================
-- TESTS D'INSTALLATION SAFEM
-- À exécuter APRÈS le SETUP_COMPLET_SAFEM.sql
-- =====================================================

-- =====================================================
-- TEST 1: Vérifier les tables
-- =====================================================
SELECT 
    'TEST 1: Tables' as test_name,
    COUNT(*) as tables_count,
    CASE WHEN COUNT(*) = 5 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clients', 'products', 'sales', 'sale_items', 'harvests');

-- =====================================================
-- TEST 2: Vérifier les produits initiaux
-- =====================================================
SELECT 
    'TEST 2: Produits' as test_name,
    COUNT(*) as products_count,
    CASE WHEN COUNT(*) >= 20 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM products;

-- =====================================================
-- TEST 3: Vérifier les triggers
-- =====================================================
SELECT 
    'TEST 3: Triggers' as test_name,
    COUNT(*) as triggers_count,
    CASE WHEN COUNT(*) >= 8 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
AND event_object_table IN ('clients', 'products', 'sales', 'sale_items', 'harvests');

-- =====================================================
-- TEST 4: Vérifier les vues
-- =====================================================
SELECT 
    'TEST 4: Vues' as test_name,
    COUNT(*) as views_count,
    CASE WHEN COUNT(*) >= 2 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('products_stock_movements', 'clients_stats');

-- =====================================================
-- TEST 5: Synchronisation Récolte → Stock
-- =====================================================
-- Sauvegarder le stock initial
DO $$
DECLARE
    v_initial_stock DECIMAL;
    v_new_stock DECIMAL;
    v_harvest_id UUID;
BEGIN
    -- Récupérer stock initial de 'Padma'
    SELECT stock_quantity INTO v_initial_stock FROM products WHERE name = 'Padma';
    
    -- Ajouter une récolte de test
    INSERT INTO harvests (product_name, quantity, harvest_date, quality, notes)
    VALUES ('Padma', 10, CURRENT_DATE, 'test', 'Test automatique')
    RETURNING id INTO v_harvest_id;
    
    -- Vérifier le nouveau stock
    SELECT stock_quantity INTO v_new_stock FROM products WHERE name = 'Padma';
    
    -- Afficher le résultat
    RAISE NOTICE 'TEST 5: Récolte → Stock';
    RAISE NOTICE 'Stock initial: % kg', v_initial_stock;
    RAISE NOTICE 'Récolte ajoutée: 10 kg';
    RAISE NOTICE 'Nouveau stock: % kg', v_new_stock;
    RAISE NOTICE 'Différence: % kg', (v_new_stock - v_initial_stock);
    
    IF (v_new_stock - v_initial_stock) = 10 THEN
        RAISE NOTICE 'Status: ✅ PASS';
    ELSE
        RAISE NOTICE 'Status: ❌ FAIL';
    END IF;
    
    -- Nettoyer
    DELETE FROM harvests WHERE id = v_harvest_id;
    UPDATE products SET stock_quantity = v_initial_stock WHERE name = 'Padma';
END $$;

-- =====================================================
-- TEST 6: Synchronisation Vente → Stock
-- =====================================================
DO $$
DECLARE
    v_initial_stock DECIMAL;
    v_new_stock DECIMAL;
    v_sale_id UUID;
    v_sale_item_id UUID;
BEGIN
    -- Récupérer stock initial de 'Demon'
    SELECT stock_quantity INTO v_initial_stock FROM products WHERE name = 'Demon';
    
    -- Créer une vente de test
    INSERT INTO sales (client_name, client_phone, total_amount, payment_method)
    VALUES ('Test Client', '+241000000', 10000, 'test')
    RETURNING id INTO v_sale_id;
    
    -- Ajouter un article
    INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
    VALUES (v_sale_id, 'Demon', 5, 2000, 10000)
    RETURNING id INTO v_sale_item_id;
    
    -- Vérifier le nouveau stock
    SELECT stock_quantity INTO v_new_stock FROM products WHERE name = 'Demon';
    
    -- Afficher le résultat
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 6: Vente → Stock';
    RAISE NOTICE 'Stock initial: % kg', v_initial_stock;
    RAISE NOTICE 'Vente: 5 kg';
    RAISE NOTICE 'Nouveau stock: % kg', v_new_stock;
    RAISE NOTICE 'Différence: % kg', (v_initial_stock - v_new_stock);
    
    IF (v_initial_stock - v_new_stock) = 5 THEN
        RAISE NOTICE 'Status: ✅ PASS';
    ELSE
        RAISE NOTICE 'Status: ❌ FAIL';
    END IF;
    
    -- Nettoyer
    DELETE FROM sale_items WHERE id = v_sale_item_id;
    DELETE FROM sales WHERE id = v_sale_id;
    UPDATE products SET stock_quantity = v_initial_stock WHERE name = 'Demon';
END $$;

-- =====================================================
-- TEST 7: Création automatique Client depuis Vente
-- =====================================================
DO $$
DECLARE
    v_sale_id UUID;
    v_client_id UUID;
    v_client_count INTEGER;
BEGIN
    -- Compter les clients avant
    SELECT COUNT(*) INTO v_client_count FROM clients;
    
    -- Créer une vente sans client_id
    INSERT INTO sales (client_name, client_phone, total_amount, payment_method)
    VALUES ('Jean Test', '+241111111', 5000, 'test')
    RETURNING id, client_id INTO v_sale_id, v_client_id;
    
    -- Vérifier qu'un client a été créé
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 7: Vente → Client (création auto)';
    RAISE NOTICE 'Clients avant: %', v_client_count;
    RAISE NOTICE 'Client ID assigné: %', v_client_id;
    
    IF v_client_id IS NOT NULL THEN
        RAISE NOTICE 'Status: ✅ PASS - Client créé automatiquement';
    ELSE
        RAISE NOTICE 'Status: ❌ FAIL - Client non créé';
    END IF;
    
    -- Nettoyer
    DELETE FROM sales WHERE id = v_sale_id;
    DELETE FROM clients WHERE id = v_client_id;
END $$;

-- =====================================================
-- TEST 8: Rapport de synchronisation
-- =====================================================
SELECT 
    'TEST 8: Fonction Rapport' as test_name,
    CASE WHEN COUNT(*) >= 4 THEN '✅ PASS' ELSE '❌ FAIL' END as status,
    COUNT(*) as metrics_count
FROM get_sync_report();

-- Afficher le rapport
SELECT * FROM get_sync_report();

-- =====================================================
-- TEST 9: Vue Stock Movements
-- =====================================================
SELECT 
    'TEST 9: Vue Stock Movements' as test_name,
    CASE WHEN COUNT(*) >= 20 THEN '✅ PASS' ELSE '❌ FAIL' END as status,
    COUNT(*) as products_count
FROM products_stock_movements;

-- Afficher quelques produits avec leur statut
SELECT 
    product_name,
    current_stock,
    min_stock_level,
    stock_status
FROM products_stock_movements
ORDER BY stock_status DESC, current_stock ASC
LIMIT 5;

-- =====================================================
-- TEST 10: Politiques RLS
-- =====================================================
SELECT 
    'TEST 10: Politiques RLS' as test_name,
    COUNT(*) as policies_count,
    CASE WHEN COUNT(*) >= 10 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('clients', 'products', 'sales', 'sale_items', 'harvests');

-- =====================================================
-- RÉSUMÉ FINAL
-- =====================================================
DO $$
DECLARE
    v_tables INTEGER;
    v_triggers INTEGER;
    v_products INTEGER;
    v_views INTEGER;
    v_policies INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_tables FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('clients', 'products', 'sales', 'sale_items', 'harvests');
    
    SELECT COUNT(*) INTO v_triggers FROM information_schema.triggers 
    WHERE event_object_schema = 'public' 
    AND event_object_table IN ('clients', 'products', 'sales', 'sale_items', 'harvests');
    
    SELECT COUNT(*) INTO v_products FROM products;
    
    SELECT COUNT(*) INTO v_views FROM information_schema.views 
    WHERE table_schema = 'public' 
    AND table_name IN ('products_stock_movements', 'clients_stats');
    
    SELECT COUNT(*) INTO v_policies FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN ('clients', 'products', 'sales', 'sale_items', 'harvests');
    
    RAISE NOTICE '';
    RAISE NOTICE '====================================================';
    RAISE NOTICE '📊 RÉSUMÉ DES TESTS';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Tables créées: % / 5 %', v_tables, CASE WHEN v_tables = 5 THEN '✅' ELSE '❌' END;
    RAISE NOTICE 'Triggers actifs: % / 8+ %', v_triggers, CASE WHEN v_triggers >= 8 THEN '✅' ELSE '❌' END;
    RAISE NOTICE 'Produits chargés: % / 20 %', v_products, CASE WHEN v_products >= 20 THEN '✅' ELSE '❌' END;
    RAISE NOTICE 'Vues créées: % / 2 %', v_views, CASE WHEN v_views >= 2 THEN '✅' ELSE '❌' END;
    RAISE NOTICE 'Politiques RLS: % / 10+ %', v_policies, CASE WHEN v_policies >= 10 THEN '✅' ELSE '❌' END;
    RAISE NOTICE '';
    
    IF v_tables = 5 AND v_triggers >= 8 AND v_products >= 20 AND v_views >= 2 AND v_policies >= 10 THEN
        RAISE NOTICE '✅ TOUS LES TESTS RÉUSSIS!';
        RAISE NOTICE '🚀 Système SAFEM opérationnel';
    ELSE
        RAISE NOTICE '⚠️ Certains tests ont échoué';
        RAISE NOTICE '📋 Vérifier les détails ci-dessus';
    END IF;
    
    RAISE NOTICE '====================================================';
END $$;

-- =====================================================
-- DONNÉES DE DÉMONSTRATION (Optionnel)
-- =====================================================
-- Décommenter pour créer des données de test

/*
-- Créer quelques clients de démonstration
INSERT INTO clients (name, phone, email, client_type, address)
VALUES
    ('Marie Leblanc', '+241 01 23 45 67', 'marie@email.com', 'particulier', 'Libreville, Quartier Batterie IV'),
    ('Restaurant Le Palmier', '+241 02 34 56 78', 'palmier@resto.ga', 'pro', 'Libreville, Boulevard Triomphal'),
    ('Jean Nguema', '+241 03 45 67 89', NULL, 'particulier', 'Port-Gentil'),
    ('Supermarché BonPrix', '+241 04 56 78 90', 'contact@bonprix.ga', 'pro', 'Libreville, Akébé');

-- Créer quelques récoltes
INSERT INTO harvests (product_name, quantity, harvest_date, quality, notes)
VALUES
    ('Padma', 35.5, CURRENT_DATE, 'excellent', 'Belle récolte de tomates'),
    ('Demon', 20.0, CURRENT_DATE, 'good', 'Piments bien mûrs'),
    ('Plantain Ebanga', 50.0, CURRENT_DATE - INTERVAL '1 day', 'excellent', 'Gros plantains'),
    ('Africaine', 15.5, CURRENT_DATE - INTERVAL '2 days', 'good', 'Aubergines de qualité');

-- Créer quelques ventes
DO $$
DECLARE
    v_sale_id UUID;
    v_client_id UUID;
BEGIN
    -- Vente 1: Marie Leblanc
    SELECT id INTO v_client_id FROM clients WHERE name = 'Marie Leblanc';
    
    INSERT INTO sales (client_id, client_name, total_amount, payment_method, sale_date)
    VALUES (v_client_id, 'Marie Leblanc', 11500, 'cash', CURRENT_DATE)
    RETURNING id INTO v_sale_id;
    
    INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
    VALUES
        (v_sale_id, 'Padma', 5, 1500, 7500),
        (v_sale_id, 'Demon', 2, 2000, 4000);
    
    -- Vente 2: Restaurant Le Palmier
    SELECT id INTO v_client_id FROM clients WHERE name = 'Restaurant Le Palmier';
    
    INSERT INTO sales (client_id, client_name, total_amount, payment_method, sale_date)
    VALUES (v_client_id, 'Restaurant Le Palmier', 28000, 'mobile_money', CURRENT_DATE)
    RETURNING id INTO v_sale_id;
    
    INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, total_price)
    VALUES
        (v_sale_id, 'Padma', 10, 1500, 15000),
        (v_sale_id, 'Plantain Ebanga', 10, 1000, 10000),
        (v_sale_id, 'Africaine', 1.5, 2000, 3000);
END $$;

RAISE NOTICE '✅ Données de démonstration créées';
RAISE NOTICE '   - 4 clients';
RAISE NOTICE '   - 4 récoltes';
RAISE NOTICE '   - 2 ventes avec 5 articles';
*/
