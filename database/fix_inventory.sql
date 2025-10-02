-- Correction de la table inventory pour ajouter les colonnes manquantes
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(10,2);
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS total_value DECIMAL(12,2);
