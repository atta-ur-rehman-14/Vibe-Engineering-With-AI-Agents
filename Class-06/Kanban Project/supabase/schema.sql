-- Supabase Schema for Kanban MVP
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> Run)

-- 1. Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Project Board',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create columns table (fixed 5 columns per board)
CREATE TABLE IF NOT EXISTS public.columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create cards table (title and details only)
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '',
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- 5. Policies for authenticated users
CREATE POLICY "Authenticated users can select boards" ON public.boards
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update boards" ON public.boards
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can select columns" ON public.columns
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update columns" ON public.columns
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can select cards" ON public.cards
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert cards" ON public.cards
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update cards" ON public.cards
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete cards" ON public.cards
    FOR DELETE TO authenticated USING (true);

-- 6. Initial Seed Data (Single shared board, 5 columns, and sample cards)
-- Note: Uses a fixed UUID for the single board to ensure idempotence
INSERT INTO public.boards (id, title)
VALUES ('00000000-0000-0000-0000-000000000001', 'Project Board')
ON CONFLICT (id) DO NOTHING;

-- 5 Columns
INSERT INTO public.columns (id, board_id, title, position)
VALUES 
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Backlog', 0),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'To Do', 1),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'In Progress', 2),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'In Review', 3),
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Done', 4)
ON CONFLICT (id) DO NOTHING;

-- Sample Cards
INSERT INTO public.cards (id, column_id, title, details, position)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'API Rate Limiting', 'Evaluate Redis token bucket approach for public endpoints', 0),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Accessibility Audit', 'Ensure all interactive elements meet WCAG AA standards', 1),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Setup Supabase Auth', 'Configure email and password provider with secure session handling', 0),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Design System Tokens', 'Verify brand hex codes for primary, secondary, and accent colors', 1),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Kanban Board DND', 'Implement drag and drop reordering between columns with optimistic UI', 0),
    ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'Column Rename Workflow', 'Persist updated column titles to Supabase with inline validation', 0),
    ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000005', 'Project Scaffolding', 'Initialize Next.js project with App Router and TypeScript', 0)
ON CONFLICT (id) DO NOTHING;
