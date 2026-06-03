-- Supabase / Postgres Database Schema for NextGen SaaS Intelligence
-- Includes Row Level Security (RLS) for true Multi-Tenancy

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------
-- 1. ENUMS
-----------------------------------------------------
CREATE TYPE onboarding_status_enum AS ENUM ('pending', 'completed');
CREATE TYPE comp_status_enum AS ENUM ('active', 'archived');
CREATE TYPE url_type_enum AS ENUM ('homepage', 'pricing', 'blog', 'features', 'changelog');
CREATE TYPE signal_type_enum AS ENUM ('pricing_change', 'feature_launch', 'hiring_trend', 'security_update', 'marketing_shift');
CREATE TYPE report_type_enum AS ENUM ('market', 'competitor');
CREATE TYPE report_source_enum AS ENUM ('manual', 'scheduled', 'onboarding');
CREATE TYPE plan_status_enum AS ENUM ('pending', 'in_progress', 'completed', 'dismissed');
CREATE TYPE plan_priority_enum AS ENUM ('high', 'medium', 'low');
CREATE TYPE scrape_job_status_enum AS ENUM ('queued', 'running', 'completed', 'failed');

-----------------------------------------------------
-- 2. TABLES
-----------------------------------------------------

-- USERS
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'founder',
    onboarding_status onboarding_status_enum DEFAULT 'pending',
    onboarding_step INTEGER DEFAULT 1,
    timezone TEXT DEFAULT 'UTC',
    appearance TEXT DEFAULT 'system',
    notification_preferences TEXT DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COMPANIES
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    product_description TEXT,
    key_features TEXT[],
    target_audience TEXT,
    pricing TEXT,
    positioning_statement TEXT,
    company_stage TEXT,
    primary_competitor_category TEXT,
    strategic_goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COMPETITORS
CREATE TABLE public.competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    category TEXT DEFAULT 'Uncategorized',
    status comp_status_enum DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- TRACKED URLS
CREATE TABLE public.tracked_urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_type url_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SCRAPE JOBS (NEW)
CREATE TABLE public.scrape_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
    tracked_url_id UUID NOT NULL REFERENCES public.tracked_urls(id) ON DELETE CASCADE,
    status scrape_job_status_enum DEFAULT 'queued',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RAW SIGNALS
CREATE TABLE public.raw_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    signal_type signal_type_enum NOT NULL,
    detected_change TEXT NOT NULL,
    previous_value TEXT,
    current_value TEXT,
    change_hash TEXT UNIQUE NOT NULL, -- prevents duplicate scraper logs
    confidence_score NUMERIC(3, 2), -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SYNTHESIZED INSIGHTS
CREATE TABLE public.synthesized_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    what_changed TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    strategic_narrative TEXT,
    recommended_action TEXT,
    impact_score INTEGER NOT NULL CHECK (impact_score >= 1 AND impact_score <= 10),
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 1 AND confidence_score <= 10),
    change_categories TEXT[],
    affected_urls TEXT[],
    evidence_signals JSONB, -- stores exactly what raw signals birthed this insight
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INTELLIGENCE REPORTS
CREATE TABLE public.intelligence_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type report_type_enum NOT NULL,
    generation_source report_source_enum DEFAULT 'manual',
    report_version INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    markdown_body TEXT NOT NULL,
    structured_data JSONB NOT NULL,
    competitor_snapshot JSONB NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EXECUTION PLANS
CREATE TABLE public.execution_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES public.intelligence_reports(id) ON DELETE SET NULL,
    insight_id UUID REFERENCES public.synthesized_insights(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    status plan_status_enum DEFAULT 'pending',
    priority plan_priority_enum DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT LOGS (NEW)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- e.g., 'competitor', 'report', 'company'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- e.g., 'archived', 'generated', 'completed'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-----------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-----------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synthesized_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users Policy
CREATE POLICY "Users can manage their own profile" 
ON public.users FOR ALL USING (auth.uid() = id);

-- Companies Policy
CREATE POLICY "Users can manage their own company" 
ON public.companies FOR ALL USING (auth.uid() = user_id);

-- Competitors Policy
CREATE POLICY "Users can manage their own competitors" 
ON public.competitors FOR ALL USING (auth.uid() = user_id);

-- Tracked URLs Policy
CREATE POLICY "Users can manage their own URLs" 
ON public.tracked_urls FOR ALL USING (auth.uid() = user_id);

-- Scrape Jobs Policy
CREATE POLICY "Users can view their scrape jobs" 
ON public.scrape_jobs FOR ALL USING (auth.uid() = user_id);

-- Raw Signals Policy
CREATE POLICY "Users can view their raw signals" 
ON public.raw_signals FOR ALL USING (auth.uid() = user_id);

-- Synthesized Insights Policy
CREATE POLICY "Users can view their synthesized insights" 
ON public.synthesized_insights FOR ALL USING (auth.uid() = user_id);

-- Reports Policy
CREATE POLICY "Users can view their reports" 
ON public.intelligence_reports FOR ALL USING (auth.uid() = user_id);

-- Execution Plans Policy (Allow access if owner OR assigned)
CREATE POLICY "Users can view and edit assigned plans" 
ON public.execution_plans FOR ALL 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Audit Logs Policy
CREATE POLICY "Users can view their audit logs" 
ON public.audit_logs FOR ALL USING (auth.uid() = user_id);
