-- =====================================================
-- FONCTIONS RPC POUR STATISTIQUES DE VENTES
-- =====================================================

-- Fonction pour récupérer les produits les plus vendus
CREATE OR REPLACE FUNCTION get_best_selling_products(
    p_limit INTEGER DEFAULT 10,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR,
    total_quantity DECIMAL,
    total_sales BIGINT,
    total_revenue DECIMAL,
    avg_price DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.product_id,
        si.product_name,
        SUM(si.quantity) as total_quantity,
        COUNT(*)::BIGINT as total_sales,
        SUM(si.total_price) as total_revenue,
        AVG(si.unit_price) as avg_price
    FROM sale_items si
    INNER JOIN sales s ON si.sale_id = s.id
    WHERE s.status = 'completed'
        AND (p_days IS NULL OR s.sale_date >= NOW() - INTERVAL '1 day' * p_days)
    GROUP BY si.product_id, si.product_name
    ORDER BY total_quantity DESC
    LIMIT p_limit;
END;
$$;

-- Fonction pour récupérer les statistiques générales de ventes
CREATE OR REPLACE FUNCTION get_sales_statistics(
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_sales BIGINT,
    total_revenue DECIMAL,
    total_items_sold DECIMAL,
    avg_order_value DECIMAL,
    period_days INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(s.id)::BIGINT as total_sales,
        COALESCE(SUM(s.total_amount), 0) as total_revenue,
        COALESCE(SUM(si.quantity), 0) as total_items_sold,
        CASE 
            WHEN COUNT(s.id) > 0 THEN COALESCE(SUM(s.total_amount), 0) / COUNT(s.id)
            ELSE 0
        END as avg_order_value,
        p_days as period_days
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    WHERE s.status = 'completed'
        AND (p_days IS NULL OR s.sale_date >= NOW() - INTERVAL '1 day' * p_days);
END;
$$;

-- Fonction pour récupérer les ventes par catégorie
CREATE OR REPLACE FUNCTION get_sales_by_category(
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    category_name VARCHAR,
    category_color VARCHAR,
    total_quantity DECIMAL,
    total_revenue DECIMAL,
    total_sales BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(pc.name, 'Non catégorisé') as category_name,
        COALESCE(pc.color, '#10B981') as category_color,
        SUM(si.quantity) as total_quantity,
        SUM(si.total_price) as total_revenue,
        COUNT(*)::BIGINT as total_sales
    FROM sale_items si
    INNER JOIN sales s ON si.sale_id = s.id
    LEFT JOIN products p ON si.product_id = p.id
    LEFT JOIN product_categories pc ON p.category_id = pc.id
    WHERE s.status = 'completed'
        AND (p_days IS NULL OR s.sale_date >= NOW() - INTERVAL '1 day' * p_days)
    GROUP BY pc.name, pc.color
    ORDER BY total_revenue DESC;
END;
$$;

-- Fonction pour récupérer les tendances de ventes quotidiennes
CREATE OR REPLACE FUNCTION get_daily_sales_trends(
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    sale_date DATE,
    total_sales BIGINT,
    total_revenue DECIMAL,
    total_items DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.sale_date::DATE as sale_date,
        COUNT(s.id)::BIGINT as total_sales,
        COALESCE(SUM(s.total_amount), 0) as total_revenue,
        COALESCE(SUM(si.quantity), 0) as total_items
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    WHERE s.status = 'completed'
        AND s.sale_date >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY s.sale_date::DATE
    ORDER BY sale_date ASC;
END;
$$;

-- Fonction pour récupérer le top des clients
CREATE OR REPLACE FUNCTION get_top_customers(
    p_limit INTEGER DEFAULT 10,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    client_name VARCHAR,
    client_phone VARCHAR,
    total_orders BIGINT,
    total_spent DECIMAL,
    avg_order_value DECIMAL,
    last_order_date TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.client_name,
        s.client_phone,
        COUNT(s.id)::BIGINT as total_orders,
        SUM(s.total_amount) as total_spent,
        AVG(s.total_amount) as avg_order_value,
        MAX(s.sale_date) as last_order_date
    FROM sales s
    WHERE s.status = 'completed'
        AND (p_days IS NULL OR s.sale_date >= NOW() - INTERVAL '1 day' * p_days)
    GROUP BY s.client_name, s.client_phone
    ORDER BY total_spent DESC
    LIMIT p_limit;
END;
$$;

-- Fonction pour récupérer les statistiques de performance mensuelle
CREATE OR REPLACE FUNCTION get_monthly_performance(
    p_months INTEGER DEFAULT 12
)
RETURNS TABLE (
    year_month TEXT,
    total_sales BIGINT,
    total_revenue DECIMAL,
    total_items DECIMAL,
    unique_customers BIGINT,
    avg_order_value DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(s.sale_date, 'YYYY-MM') as year_month,
        COUNT(s.id)::BIGINT as total_sales,
        COALESCE(SUM(s.total_amount), 0) as total_revenue,
        COALESCE(SUM(si.quantity), 0) as total_items,
        COUNT(DISTINCT s.client_name)::BIGINT as unique_customers,
        CASE 
            WHEN COUNT(s.id) > 0 THEN COALESCE(SUM(s.total_amount), 0) / COUNT(s.id)
            ELSE 0
        END as avg_order_value
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    WHERE s.status = 'completed'
        AND s.sale_date >= NOW() - INTERVAL '1 month' * p_months
    GROUP BY TO_CHAR(s.sale_date, 'YYYY-MM')
    ORDER BY year_month DESC;
END;
$$;

-- Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_best_selling_products TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_sales_statistics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_sales_by_category TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_daily_sales_trends TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_customers TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_performance TO anon, authenticated;
