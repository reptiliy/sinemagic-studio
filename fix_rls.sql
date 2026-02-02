
-- Enable RLS (just in case)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- 1. PRODUCTS
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Allow public insert" ON products;
DROP POLICY IF EXISTS "Allow public update" ON products;
DROP POLICY IF EXISTS "Allow public delete" ON products;

CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);

-- 2. ORDERS
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Allow public read" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON orders;
DROP POLICY IF EXISTS "Allow public update" ON orders;

CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON orders FOR UPDATE USING (true);

-- 3. SECTIONS
DROP POLICY IF EXISTS "Enable read access for all users" ON sections;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON sections;
DROP POLICY IF EXISTS "Allow public read" ON sections;
DROP POLICY IF EXISTS "Allow public update" ON sections;

CREATE POLICY "Allow public read" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON sections FOR UPDATE USING (true);
CREATE POLICY "Allow public insert" ON sections FOR INSERT WITH CHECK (true);

-- 4. TRANSLATIONS
DROP POLICY IF EXISTS "Enable read access for all users" ON translations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON translations;
DROP POLICY IF EXISTS "Allow public read" ON translations;
DROP POLICY IF EXISTS "Allow public update" ON translations;

CREATE POLICY "Allow public read" ON translations FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON translations FOR UPDATE USING (true);
CREATE POLICY "Allow public insert" ON translations FOR INSERT WITH CHECK (true);
