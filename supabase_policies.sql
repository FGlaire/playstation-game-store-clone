-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items with proper access" ON public.order_items;

-- Make sure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders table policies
CREATE POLICY "Users can create orders"
ON public.orders
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Order items table policies
CREATE POLICY "Users can create order items with proper access"
ON public.order_items
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id 
    AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role = 'admin'
      )
    )
  )
); 