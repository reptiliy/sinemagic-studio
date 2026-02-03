-- 1. Сбрасываем кэш схемы API (обязательно после изменения структуры таблиц)
NOTIFY pgrst, 'reload config';

-- 2. Гарантируем, что у авторизованных пользователей есть права на чтение обновленной таблицы
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 3. Проверяем, что данные на месте (просто для вывода в консоль Supabase)
SELECT count(*) as total_users, count(email) as users_with_email FROM public.profiles;
