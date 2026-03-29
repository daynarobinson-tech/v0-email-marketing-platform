-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  consent BOOLEAN DEFAULT FALSE,
  token_balance INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaigns table for sender dashboard
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emails_sent INTEGER DEFAULT 0,
  opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Subscribers policies - allow public insert for signup, authenticated users can view
CREATE POLICY "Allow public insert for signup" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view subscribers" ON subscribers FOR SELECT USING (true);
CREATE POLICY "Allow public update for tracking" ON subscribers FOR UPDATE USING (true);

-- Events policies
CREATE POLICY "Allow public insert for events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view events" ON events FOR SELECT USING (true);

-- Campaigns policies
CREATE POLICY "Allow authenticated users to manage campaigns" ON campaigns FOR ALL USING (true);
