-- ========================================================
-- WEB OF DOOM (Round 01: DOOMBOTS) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SESSIONS TABLE (1 Device = 1 Active Session Lock & JSONB answers)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT UNIQUE REFERENCES public.teams(team_id) ON DELETE CASCADE,
  device_token TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  score INT DEFAULT 0,
  current_question_idx INT DEFAULT 0,
  answers JSONB DEFAULT '{}'::jsonb,
  hints_used JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. QUESTIONS TABLE (Optional Cloud Question Bank)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  type TEXT NOT NULL, -- 'mcq' | 'output' | 'debugging'
  difficulty TEXT NOT NULL, -- 'easy' | 'medium' | 'hard'
  question TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  hint TEXT,
  points INT DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies (Public Read/Write for Event)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert on teams" ON public.teams FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sessions" ON public.sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public select on questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on questions" ON public.questions FOR ALL USING (true);

-- Enable Supabase Realtime for live Admin Leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
