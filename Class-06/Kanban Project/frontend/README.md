# Kanban Project

Minimalist, elegant single-board Kanban project management application built with Next.js (App Router) and Supabase.

## Requirements Checklist

- Single shared board with fixed 5 columns
- Column title inline renaming
- Cards with title and details only
- Drag and drop interface to reorder cards and move between columns
- Card addition and deletion
- Supabase Auth and PostgreSQL persistence
- Strict zero-emoji standard and custom color palette

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase (Optional for local demo preview):
Create `.env.local` inside `frontend/` and add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Initialize Database Schema:
Run `supabase/schema.sql` in your Supabase SQL Editor.

4. Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run unit tests:
```bash
npm test
```

Run Playwright integration tests:
```bash
npm run test:e2e
```
