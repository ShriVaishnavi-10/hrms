-- HRMS Core Schema
-- Run this in your Supabase SQL Editor

-- 1. Create Roles Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_admin', 'hr_manager', 'dept_manager', 'employee');
    END IF;
END $$;

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role user_role DEFAULT 'employee'::user_role,
    department TEXT,
    designation TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Users view own profile
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- 5. Auto-Create Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'employee');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    clock_in TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    clock_out TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'on_time', -- 'on_time', 'late', 'early_out'
    location TEXT, -- Simple text location for now
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Leave Table
CREATE TABLE IF NOT EXISTS public.leaves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'sick', 'casual', 'earned', 'unpaid'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for Attendance
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attendance" ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins/Managers can view all attendance" ON public.attendance FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'hr_manager', 'dept_manager'))
);

-- 10. RLS Policies for Leaves
CREATE POLICY "Users can view own leaves" ON public.leaves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leaves" ON public.leaves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Managers can update leave status" ON public.leaves FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'hr_manager', 'dept_manager'))
);
