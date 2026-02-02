-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create table for Translations (Texts)
create table if not exists public.translations (
  id uuid default gen_random_uuid() primary key,
  key text not null,
  lang text not null default 'ru',
  value text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(key, lang)
);

-- 2. Create table for Sections (Blocks visibility)
create table if not exists public.sections (
  id text primary key, -- e.g. 'hero', 'showcase'
  is_visible boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Enable RLS
alter table public.translations enable row level security;
alter table public.sections enable row level security;

-- 4. Create Policies
-- Allow public read access
create policy "Public read translations" on public.translations for select using (true);
create policy "Public read sections" on public.sections for select using (true);

-- Allow authenticated users (admins) to do everything
create policy "Admin all translations" on public.translations for all using (auth.role() = 'authenticated');
create policy "Admin all sections" on public.sections for all using (auth.role() = 'authenticated');

-- 5. Insert Default Sections
insert into public.sections (id, is_visible, display_order) values
('hero', true, 10),
('showcase', true, 20),
('bento', true, 30),
('cta', true, 40),
('about', true, 50),
('help', true, 60)
on conflict (id) do nothing;

-- 6. Insert Default Translations (Russian)
insert into public.translations (key, lang, value) values
('header.home', 'ru', 'Главная'),
('header.about', 'ru', 'Обо мне'),
('header.help', 'ru', 'Помощь'),
('header.try', 'ru', 'Попробовать'),

('hero.tag', 'ru', 'VEO 3.1 & KLING 1.5 PRO'),
('hero.title_start', 'ru', 'Sinemagic'),
('hero.title_end', 'ru', 'Studio'),
('hero.subtitle', 'ru', 'Создавай виральный контент на топовых моделях. Видео с голосом, липсингом и спецэффектами за считанные минуты.'),
('hero.placeholder', 'ru', 'Опишите ваше видео (например: Неоновый кот на скейте в Токио)...'),
('hero.generate', 'ru', 'Создать'),
('hero.generating', 'ru', 'Генерация...'),

('showcase.tag', 'ru', 'Галерея работ'),
('showcase.title_start', 'ru', 'Создано'),
('showcase.title_end', 'ru', 'нейросетью'),
('showcase.subtitle', 'ru', 'Почувствуйте мощь современных алгоритмов. Каждый ролик — это результат точного промпта и магии AI.'),
('showcase.view_all', 'ru', 'Смотреть все работы'),
('showcase.preview', 'ru', 'AI Preview'),

('about.years', 'ru', 'Лет в IT'),
('about.projects', 'ru', 'Проектов'),
('about.reach', 'ru', 'Виральных охватов'),
('about.models', 'ru', 'AI-моделей в стеке'),
('about.role', 'ru', 'The Architect'),
('about.name', 'ru', 'Кригер Евгений'),
('about.h1_1', 'ru', 'Вайб-кодинг.'),
('about.h1_2', 'ru', 'AI-креатор.'),
('about.h1_3', 'ru', 'Генератор видео и фото.'),
('about.p1', 'ru', 'Мне 40 лет. 20 лет я в цифровой среде — от эпохи dial-up до нейросетей, которые сегодня создают видео, эффекты и визуальные миры.'),
('about.p2', 'ru', 'Мой основной фокус — генерация видео, визуальных эффектов и анимаций с помощью AI. Я работаю с нейросетями, которые превращают изображения и идеи в динамичные сцены: движение камеры, свет, эффекты, кинематографичный стиль, вирусные форматы для TikTok и Reels.'),
('about.p3', 'ru', 'Я создаю AI-видео — от реалистичных клипов до креативных и мемных сцен, собираю генеративные пайплайны и визуальные эффекты, которые цепляют внимание с первых секунд.'),
('about.p4', 'ru', 'Помимо этого, я занимаюсь веб-кодингом и созданием сайтов — от лендингов до сложных веб-проектов, где AI и визуальный контент становятся частью продукта.'),
('about.p5', 'ru', 'Моя миссия — показать, что современные видео, эффекты и сайты можно создавать быстрее и мощнее, если уметь оркестровать искусственный интеллект, а не делать всё вручную.'),
('about.stack', 'ru', 'Технологический стек'),
('about.stack_1_name', 'ru', 'AI Video Synthesis'),
('about.stack_1_desc', 'ru', 'Kling, Veo, Luma'),
('about.stack_2_name', 'ru', 'Neural Architectures'),
('about.stack_2_desc', 'ru', 'LLM & Custom Models'),
('about.stack_3_name', 'ru', 'Viral Automation'),
('about.stack_3_desc', 'ru', 'Content Multiplier'),
('about.stack_4_name', 'ru', 'Bot Development'),
('about.stack_4_desc', 'ru', 'Telegram & Web SDK'),
('about.quote', 'ru', 'В 2026 году код — это лишь фундамент. Настоящая архитектура строится на умении направлять нейронные связи в нужное русло.'),
('about.discuss', 'ru', 'Обсудить проект'),
('about.download_cv', 'ru', 'Скачать CV'),

('help.tag', 'ru', 'Инструкция'),
('help.title', 'ru', 'Как создавать'),
('help.title_highlight', 'ru', 'шедевры'),
('help.subtitle', 'ru', 'Полное руководство по использованию нейросетей для генерации видео через сервис Kie.ai'),
('help.step1_title', 'ru', 'Регистрация в сервисе'),
('help.step1_desc', 'ru', 'Для начала работы вам необходимо перейти на платформу Kie.ai и пройти простую регистрацию. Используйте нашу специальную ссылку для доступа.'),
('help.step1_btn', 'ru', 'Перейти на Kie.ai'),
('help.step2_title', 'ru', 'Создание контента'),
('help.step2_intro', 'ru', 'После входа в систему у вас есть несколько путей создания контента:'),
('help.step2_li1_title', 'ru', 'Генерация изображений через Gemini'),
('help.step2_li1_desc', 'ru', 'Используйте модель Gemini для создания уникальных изображений по вашему описанию. Это станет отличной основой для будущего видео.'),
('help.step2_li2_title', 'ru', 'Загрузка своих фото'),
('help.step2_li2_desc', 'ru', 'Вы также можете загрузить собственные фотографии, чтобы оживить их.'),
('help.step3_title', 'ru', 'Анимация (Видео)', 'ru', 'Самый магический этап — превращение статики в динамику. Выберите одну из передовых моделей:'),
('help.step3_veo_desc', 'ru', 'Идеально подходит для реалистичных движений и кинематографичных сцен.'),
('help.step3_kling_desc', 'ru', 'Отличный выбор для креативных и стилизованных анимаций с высокой детализацией.'),
('help.step3_outro', 'ru', 'Просто выберите модель, настройте параметры (если нужно) и нажмите кнопку генерации. Через несколько минут ваше видео будет готово!'),
('help.ready', 'ru', 'Готовы попробовать?'),
('help.start_btn', 'ru', 'Начать творить'),

('footer.desc', 'ru', 'Профессиональная автоматизация контента через нейросети нового поколения. Будущее уже здесь.'),
('footer.home', 'ru', 'Главная'),
('footer.about', 'ru', 'Обо мне'),
('footer.help', 'ru', 'Помощь'),
('footer.cases', 'ru', 'Кейсы'),
('footer.telegram', 'ru', 'Telegram'),
('footer.copyright', 'ru', '© 2026 Разработано Кригером Евгением')
on conflict (key, lang) do nothing;
