-- ================================================================
-- RecoverAI PostgreSQL Schema, Relationships, RLS & Seed Script
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Owner',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  monthly_transaction_volume TEXT,
  currency TEXT DEFAULT 'INR',
  primary_provider TEXT DEFAULT 'Stripe + Razorpay',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Organization Members Table
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- 5. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  customer_since TIMESTAMPTZ DEFAULT now(),
  lifetime_value NUMERIC(12, 2) DEFAULT 0,
  engagement_score INT DEFAULT 50,
  risk_score INT DEFAULT 50,
  risk_level TEXT DEFAULT 'Low',
  churn_probability NUMERIC(5, 2) DEFAULT 0,
  recovery_probability NUMERIC(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  revenue_at_risk NUMERIC(12, 2) DEFAULT 0,
  total_successful_payments INT DEFAULT 0,
  total_failed_payments INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'Monthly',
  status TEXT DEFAULT 'Active',
  start_date TIMESTAMPTZ DEFAULT now(),
  renewal_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  status TEXT DEFAULT 'FAILED',
  failure_reason TEXT NOT NULL,
  failure_code TEXT,
  gateway_response TEXT,
  attempt_number INT DEFAULT 1,
  recovery_probability NUMERIC(5, 2) DEFAULT 0,
  risk_level TEXT DEFAULT 'Low',
  recommended_action TEXT,
  expected_recovery_value NUMERIC(12, 2) DEFAULT 0,
  ai_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  failed_at TIMESTAMPTZ DEFAULT now(),
  recovered_at TIMESTAMPTZ
);

-- 8. Create Recovery Predictions Log Table
CREATE TABLE IF NOT EXISTS public.recovery_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  recovery_probability NUMERIC(5, 2) NOT NULL,
  risk_score INT NOT NULL,
  expected_recovery NUMERIC(12, 2) NOT NULL,
  recommended_action TEXT NOT NULL,
  recommended_time TEXT,
  ai_explanation TEXT,
  model_version TEXT DEFAULT 'RandomForest-v1.0',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Create Recovery Actions Log Table
CREATE TABLE IF NOT EXISTS public.recovery_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  executed_at TIMESTAMPTZ,
  result TEXT,
  recovered_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_segment TEXT,
  status TEXT DEFAULT 'Active',
  customers_targeted INT DEFAULT 0,
  revenue_at_risk NUMERIC(12, 2) DEFAULT 0,
  predicted_recovery NUMERIC(12, 2) DEFAULT 0,
  actual_recovered NUMERIC(12, 2) DEFAULT 0,
  success_rate NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Create Automation Rules Table
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  condition_reason TEXT,
  min_probability INT DEFAULT 70,
  action TEXT NOT NULL,
  wait_hours INT DEFAULT 24,
  is_active BOOLEAN DEFAULT true,
  trigger_count INT DEFAULT 0,
  recovered_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

-- Customers RLS Policy
CREATE POLICY "Users access own organization customers" ON public.customers
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- Payments RLS Policy
CREATE POLICY "Users access own organization payments" ON public.payments
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- Campaigns RLS Policy
CREATE POLICY "Users access own organization campaigns" ON public.campaigns
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- ================================================================
-- PERFORMANCE INDEXES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_payments_org ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txn ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_customers_org ON public.customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_risk ON public.customers(risk_level);
