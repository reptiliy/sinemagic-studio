-- FORCE RELOAD SCHEMA CACHE
-- Run this if you see "Could not find the '...' column in the schema cache" errors

-- 1. Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload config';

-- 2. Double check the products table definition (just to be sure)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    description TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    colors TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 3. Verify columns exist (Add if missing)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name') THEN
        ALTER TABLE products ADD COLUMN name TEXT;
    END IF;
END $$;
