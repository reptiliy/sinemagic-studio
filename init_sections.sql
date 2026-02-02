-- INIT SECTIONS VISIBILITY
-- Run this to ensure all sections are visible on the site

INSERT INTO sections (id, is_visible) VALUES
('header', true),
('footer', true),
('home', true),
('hero_marquee', true),
('showcase', true),
('video', true),
('bento', true),
('cta', true),
('about', true),
('help', true),
('price', true),
('store', true)
ON CONFLICT (id) DO UPDATE SET is_visible = true;

-- Ensure public access (just in case)
DROP POLICY IF EXISTS "Allow public read" ON sections;
CREATE POLICY "Allow public read" ON sections FOR SELECT USING (true);
