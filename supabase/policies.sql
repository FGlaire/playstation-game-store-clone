-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read their own records" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own records" ON public.users;
DROP POLICY IF EXISTS "Users can update their own records" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own records" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all user records" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all records" ON public.users;
DROP POLICY IF EXISTS "Public read access" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can read" ON public.users;

-- Temporarily disable RLS for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Ensure the users table has the correct structure
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'buyer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'can_buy'
  ) THEN
    ALTER TABLE public.users ADD COLUMN can_buy BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add cascade delete trigger
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_deleted_user(); 