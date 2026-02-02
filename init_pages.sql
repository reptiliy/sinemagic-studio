CREATE TABLE IF NOT EXISTS public.custom_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    is_visible BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Enable public access for now (demo mode)
DROP POLICY IF EXISTS "Public select pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Public insert pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Public update pages" ON public.custom_pages;
DROP POLICY IF EXISTS "Public delete pages" ON public.custom_pages;

CREATE POLICY "Public select pages" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "Public insert pages" ON public.custom_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pages" ON public.custom_pages FOR UPDATE USING (true);
CREATE POLICY "Public delete pages" ON public.custom_pages FOR DELETE USING (true);
