-- Add new columns to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE;

-- Update RLS policies to allow admins to update these fields
-- (Existing policies might already cover update for admins, but let's be sure)
-- Assuming we have a policy for admins to update everything, or we can just rely on the fact that we are using Supabase client which respects RLS.
-- If RLS for UPDATE is "users can update own profile", we need to ensure admins can update ANY profile.

-- Create a policy for admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON profiles 
FOR UPDATE 
TO authenticated 
USING (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
)
WITH CHECK (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Allow admins to delete any profile
CREATE POLICY "Admins can delete any profile"
ON profiles
FOR DELETE
TO authenticated
USING (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);
