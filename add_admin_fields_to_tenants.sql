-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR TO UPDATE YOUR DATABASE FOR THE NEW DASHBOARD

-- This script adds the necessary admin columns to the existing 'tenants' table 
-- without deleting any of your existing data.

ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS party text,
ADD COLUMN IF NOT EXISTS mahanagarPalika text,
ADD COLUMN IF NOT EXISTS ward text,
ADD COLUMN IF NOT EXISTS prabhag text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS representativeName text,
ADD COLUMN IF NOT EXISTS representativeContact text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS lastActive text DEFAULT 'Just now',
ADD COLUMN IF NOT EXISTS citizenCount text DEFAULT '0',
ADD COLUMN IF NOT EXISTS workerCount integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'Nagarsevak',
ADD COLUMN IF NOT EXISTS endDate text,
ADD COLUMN IF NOT EXISTS version text DEFAULT 'v2.1.0';

-- Force reload schema cache just in case
NOTIFY pgrst, 'reload schema';
