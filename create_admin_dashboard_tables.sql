-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR

-- 1. Create Support Tickets Table
CREATE TABLE IF NOT EXISTS admin_support_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer text NOT NULL,
    issue text NOT NULL,
    priority text DEFAULT 'Medium',
    status text DEFAULT 'Open',
    time text DEFAULT 'Just now',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Platform Updates (Feature Requests) Table
CREATE TABLE IF NOT EXISTS admin_updates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subject text NOT NULL,
    customer text NOT NULL,
    date text NOT NULL,
    priority text DEFAULT 'Low',
    status text DEFAULT 'Under Review',
    category text DEFAULT 'Feature',
    votes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Billing Records Table
CREATE TABLE IF NOT EXISTS admin_billing (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer text NOT NULL,
    plan text NOT NULL,
    amount text NOT NULL,
    status text DEFAULT 'Paid',
    nextBilling text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) and set to allow all operations for the dashboard
ALTER TABLE admin_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_billing ENABLE ROW LEVEL SECURITY;

-- Note: In a production app, you would lock these down to Admin roles.
-- For the dashboard integration, we are enabling public access to sync instantly.
DROP POLICY IF EXISTS "Enable all operations for admin_support_tickets" ON admin_support_tickets;
CREATE POLICY "Enable all operations for admin_support_tickets" ON admin_support_tickets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for admin_updates" ON admin_updates;
CREATE POLICY "Enable all operations for admin_updates" ON admin_updates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for admin_billing" ON admin_billing;
CREATE POLICY "Enable all operations for admin_billing" ON admin_billing FOR ALL USING (true) WITH CHECK (true);

-- Notify schema cache
NOTIFY pgrst, 'reload schema';

-- 4. Alter existing tenants table to add dashboard-specific tracking columns
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS party text,
ADD COLUMN IF NOT EXISTS "mahanagarPalika" text,
ADD COLUMN IF NOT EXISTS ward text,
ADD COLUMN IF NOT EXISTS prabhag text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS plan text,
ADD COLUMN IF NOT EXISTS "endDate" text,
ADD COLUMN IF NOT EXISTS "representativeName" text,
ADD COLUMN IF NOT EXISTS "representativeContact" text,
ADD COLUMN IF NOT EXISTS status text,
ADD COLUMN IF NOT EXISTS "lastActive" text,
ADD COLUMN IF NOT EXISTS "citizenCount" text,
ADD COLUMN IF NOT EXISTS "workerCount" integer;
