-- FIX SUPABASE SCHEMA FINAL
-- Run this script in the Supabase SQL Editor to fix all issues with products, orders, and permissions.

-- 1. Ensure 'products' table has all required columns
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

-- Add columns if they are missing (for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_visible') THEN
        ALTER TABLE products ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'colors') THEN
        ALTER TABLE products ADD COLUMN colors TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description') THEN
        ALTER TABLE products ADD COLUMN description TEXT;
    END IF;
END $$;

-- 2. Ensure 'orders' table exists
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    comment TEXT,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ensure 'translations' table exists
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    lang TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(key, lang)
);

-- 4. Ensure 'sections' table exists
CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    is_visible BOOLEAN DEFAULT TRUE
);

-- 5. Fix RLS Policies (Permissions)
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for all users" ON products;
DROP POLICY IF EXISTS "Enable all access for all users" ON orders;
DROP POLICY IF EXISTS "Enable all access for all users" ON translations;
DROP POLICY IF EXISTS "Enable all access for all users" ON sections;

-- Create permissive policies (for development/demo)
-- Note: In a real production app, you would restrict WRITE access to authenticated users only.
CREATE POLICY "Enable all access for all users" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON sections FOR ALL USING (true) WITH CHECK (true);

-- 6. Verify setup
INSERT INTO sections (id, is_visible) VALUES ('store', true) ON CONFLICT (id) DO UPDATE SET is_visible = true;
