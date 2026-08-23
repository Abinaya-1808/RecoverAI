import { createClient } from '@supabase/supabase-js';

// Read env vars or fallback gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-supabase-id.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * PostgreSQL Schema DDL reference for Supabase deployment
 */
export const SUPABASE_SQL_SCHEMA = `
-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  monthly_transaction_volume TEXT,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  customer_since TIMESTAMPTZ DEFAULT now(),
  lifetime_value NUMERIC(12, 2) DEFAULT 0,
  engagement_score INT DEFAULT 50,
  risk_score INT DEFAULT 50,
  churn_probability NUMERIC(5, 2) DEFAULT 0,
  recovery_probability NUMERIC(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  revenue_at_risk NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'Monthly',
  status TEXT DEFAULT 'Active',
  start_date TIMESTAMPTZ DEFAULT now(),
  renewal_date TIMESTAMPTZ
);

-- 6. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  transaction_id TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  status TEXT DEFAULT 'FAILED',
  failure_reason TEXT,
  failure_code TEXT,
  gateway_response TEXT,
  attempt_number INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  failed_at TIMESTAMPTZ DEFAULT now(),
  recovered_at TIMESTAMPTZ
);

-- 7. Create recovery_predictions table
CREATE TABLE IF NOT EXISTS public.recovery_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  recovery_probability NUMERIC(5, 2) NOT NULL,
  risk_score INT NOT NULL,
  expected_recovery NUMERIC(12, 2) NOT NULL,
  recommended_action TEXT NOT NULL,
  recommended_time TEXT,
  ai_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create recovery_actions table
CREATE TABLE IF NOT EXISTS public.recovery_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  executed_at TIMESTAMPTZ,
  result TEXT,
  recovered_amount NUMERIC(12, 2)
);

-- Row Level Security (RLS) policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access org customers" ON public.customers
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );
`;
