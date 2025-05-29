-- Check current users and their roles
SELECT au.id, au.email, u.role, u.can_buy
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id;

-- Force update the admin role for your user
INSERT INTO public.users (id, role, can_buy)
VALUES ('6c1cd341-02c8-4308-a282-75e265ed676a', 'admin', true)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', can_buy = true;

-- Verify the update
SELECT au.email, u.role, u.can_buy
FROM auth.users au
JOIN public.users u ON au.id = u.id
WHERE au.id = '6c1cd341-02c8-4308-a282-75e265ed676a'; 