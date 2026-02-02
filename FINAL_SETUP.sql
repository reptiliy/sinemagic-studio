/* 
   FULL PROJECT RESET (CLEAN SETUP)
   This script will reset your database tables and RLS policies.
*/

-- 1. Reset Tables
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.translations CASCADE;

-- 2. Create Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    description TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    colors TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    comment TEXT,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
);

-- 4. Create Helper Tables
CREATE TABLE public.sections (
    id TEXT PRIMARY KEY,
    is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    lang TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(key, lang)
);

-- 5. Setup Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public select products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public all sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public all translations" ON public.translations FOR ALL USING (true) WITH CHECK (true);

-- 6. Seed Data
INSERT INTO public.sections (id, is_visible) VALUES 
('hero', true), ('showcase', true), ('store', true), 
('video', true), ('bento', true), ('cta', true), 
('about', true), ('help', true), ('header', true), ('footer', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (name, price, category, image, description, is_visible, colors) VALUES
('Интерактивная игрушка', '1500', 'Игрушки', '', 'Умная игрушка для активных кошек. Автоматически дразнит кота лазером и перьями.', true, ARRAY['#FF0000', '#00FF00', '#0000FF']),
('Уютный домик', '3500', 'Домики', '', 'Мягкий домик с когтеточкой. Идеальное укрытие для отдыха.', true, ARRAY['#8B4513', '#D2691E']),
('Когтеточка-столбик', '2000', 'Аксессуары', '', 'Прочная сизалевая когтеточка. Спасает вашу мебель.', true, ARRAY[]::TEXT[]),
('Миска керамическая', '800', 'Посуда', '', 'Стильная миска, легко моется. Подходит для воды и корма.', true, ARRAY[]::TEXT[]),
('Ошейник с GPS', '5000', 'Аксессуары', '', 'Всегда знайте, где ваш питомец. Работает через приложение.', true, ARRAY[]::TEXT[]),
('Мягкая лежанка', '2500', 'Мебель', '', 'Ортопедическая лежанка для сна. Снимает нагрузку с суставов.', true, ARRAY[]::TEXT[]),
('Лазерная указка', '500', 'Игрушки', '', 'Автоматический лазерный луч. 5 режимов работы.', true, ARRAY[]::TEXT[]),
('Переноска-рюкзак', '4500', 'Аксессуары', '', 'Удобная переноска с окном. Вентиляция и комфорт.', true, ARRAY[]::TEXT[]),
('Набор витаминов', '1200', 'Здоровье', '', 'Комплекс для шерсти и когтей. 100 таблеток.', true, ARRAY[]::TEXT[]);
