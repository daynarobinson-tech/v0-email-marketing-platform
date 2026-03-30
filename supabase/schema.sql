-- Supabase Setup Schema for v0-email-marketing-platform

-- 1. Create Subscribers Table
CREATE TABLE public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    token_balance INTEGER DEFAULT 0,
    flow_address TEXT,
    world_id_nullifier TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Events Table (for loyalty points tracking)
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'joined', 'email_opened', 'link_clicked', 'redeemed'
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Redemptions Table (for claiming rewards)
CREATE TABLE public.redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    reward_name TEXT NOT NULL,
    tokens_spent INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Campaigns Table (for sender dashboard)
CREATE TABLE public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    content TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set Row Level Security (RLS) to false temporarily for rapid prototyping
-- Make sure to enable RLS and write policies before going to production!
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
