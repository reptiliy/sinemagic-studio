
-- Создание таблицы sections, если она не существует
CREATE TABLE IF NOT EXISTS public.sections (
    id TEXT PRIMARY KEY,
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Включение RLS
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (все могут читать)
CREATE POLICY "Allow public read access" ON public.sections
    FOR SELECT USING (true);

-- Политика для записи (все могут писать - для демо режима)
CREATE POLICY "Allow public update access" ON public.sections
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON public.sections
    FOR INSERT WITH CHECK (true);

-- Вставка дефолтных значений (включаем все секции)
INSERT INTO public.sections (id, is_visible) VALUES
('header', true),
('home', true),
('hero_marquee', true),
('showcase', true),
('video', true),
('store', true),
('bento', true),
('cta', true),
('about', true),
('help', true),
('price', true),
('footer', true)
ON CONFLICT (id) DO UPDATE SET is_visible = true;
