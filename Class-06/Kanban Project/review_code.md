# Kanban Project - Code Review Report

**Date:** 2026-09-07  
**Reviewer:** AI Code Review  
**Project:** Kanban MVP - Single Board Project Management App

---

## Executive Summary

The project implements a functional Kanban board MVP with Next.js 16 (App Router), Supabase Auth/PostgreSQL, and @hello-pangea/dnd. While the core features work, there are **critical security issues**, **architectural inconsistencies**, and **code quality concerns** that must be addressed before production use.

---

## ðŸ”´ Critical Issues (Must Fix)

### 1. Exposed Credentials in Repository
**Files:** `frontend/.env.local`, `frontend/scripts/run-migrations.mjs`, `frontend/scripts/check-or-create-user.mjs`

```javascript
// frontend/.env.local - COMMITTED TO REPO
NEXT_PUBLIC_SUPABASE_URL=https://hzhqmzsdcunbbqsitzfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[REDACTED_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[REDACTED_SERVICE_ROLE_KEY]
```

```javascript
// frontend/scripts/run-migrations.mjs - HARDCODED SECRETS
const projectRef = "hzhqmzsdcunbbqsitzfw";
const user = `postgres.${projectRef}`;
const password = "REDACTED_PASSWORD";  // DATABASE PASSWORD IN PLAIN TEXT
```

```javascript
// frontend/scripts/check-or-create-user.mjs - HARDCODED SECRETS
const supabaseUrl = "https://hzhqmzsdcunbbqsitzfw.supabase.co";
const supabaseSecretKey = "[REDACTED_SERVICE_ROLE_KEY]";  // SERVICE ROLE KEY
```

**Impact:** Full database access, auth admin access, ability to delete all data, create users, bypass RLS.

**Fix:** 
- Add `.env.local` to `.gitignore` immediately
- Remove hardcoded credentials from scripts; use environment variables
- Rotate all exposed keys in Supabase dashboard
- Use `dotenv` package in scripts to load from `.env.local`

---

### 2. Missing `.gitignore`
**File:** Root and `frontend/` directory

No `.gitignore` exists. This caused the credential leak above and will commit `node_modules`, `.next`, build artifacts, and test results.

**Fix:** Create `.gitignore` with standard Next.js exclusions:
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea/
.vscode/
```

---

### 3. Inconsistent Data Synchronization Strategy
**File:** `frontend/src/lib/supabase.ts`

The code has three conflicting persistence layers:
1. **Supabase (primary)** - PostgreSQL with RLS
2. **localStorage (fallback)** - Client-side only
3. **In-memory React state** - UI source of truth

**Problems:**
- `getBoardData()`: On Supabase failure, silently falls back to localStorage without user notification
- `syncColumnsState()`: Sends ALL cards to Supabase on every drag operation (inefficient)
- `deleteCard()`: Passes stale `columns` to Supabase delete instead of updated state
- Race conditions: Optimistic UI updates + async Supabase calls without rollback on failure

**Example - Line 166 (`supabase.ts`):**
```typescript
await deleteCard(cardId, columns);  // BUG: passes OLD columns, not updated
```

**Fix:** 
- Choose one source of truth (Supabase with localStorage as offline cache only)
- Implement proper conflict resolution
- Add rollback mechanism for failed mutations
- Use React Query or SWR for server state management

---

### 4. Supabase Client Created at Module Level
**File:** `frontend/src/lib/supabase.ts` (lines 23-25)

```typescript
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
```

**Problem:** Module-level initialization runs during build/SSR. If env vars missing at build time, client is permanently `null` even if added later.

**Fix:** Create client lazily in a getter function or use `@supabase/ssr` properly with `createBrowserClient`/`createServerClient`.

---

### 5. Playwright Tests Use Hardcoded Production Credentials
**File:** `frontend/tests/kanban.spec.ts` (lines 108-111)

```typescript
await emailInput.fill("mrarehman703@gmail.com");
await page.locator("#auth-password").fill("Password123!");
```

**Impact:** Tests depend on specific production user; exposes credentials in CI logs.

**Fix:** Use test-specific credentials from environment variables; create/cleanup test users in `beforeAll`/`afterAll`.

---

## ðŸŸ  High Priority Issues

### 6. Duplicate Column Definitions
**Files:** `frontend/src/types/kanban.ts` (lines 25-115) AND `supabase/schema.sql` (lines 67-74)

The initial 5 columns are defined in **both** places with identical UUIDs. This violates DRY and creates maintenance burden.

**Fix:** Single source of truth - either generate TypeScript types from SQL schema or use a shared config file.

---

### 7. Inefficient `syncColumnsState` - Full Upsert on Every Drag
**File:** `frontend/src/lib/supabase.ts` (lines 241-264)

```typescript
const updates = columns.flatMap((col) =>
  col.cards.map((card, index) => ({
    id: card.id,
    column_id: col.id,
    position: index,
    title: card.title,
    details: card.details,
  }))
);
await supabase.from("cards").upsert(updates);
```

**Problem:** On every drag end (even reorder within same column), ALL cards in ALL columns are upserted. With 50+ cards, this is 50+ DB writes per drag.

**Fix:** Track dirty cards only; send minimal updates. Use `position` and `column_id` changes only.

---

### 8. No Error Boundaries or User-Facing Error Handling
**Files:** All components

- Supabase errors only logged to console (`console.warn`, `console.error`)
- No toast notifications, error banners, or retry mechanisms
- Silent failures leave UI out of sync with database

**Fix:** Add error boundary component; implement toast notification system; show user-friendly errors with retry.

---

### 9. `page.module.css` Unused / Dead Code
**File:** `frontend/src/app/page.module.css`

Contains default Next.js template styles (Geist font, dark mode vars) that conflict with `globals.css` design system. Not imported anywhere.

**Fix:** Delete the file.

---

### 10. `StatusBanner` Component Created But Never Used
**File:** `frontend/src/components/StatusBanner.tsx`

Component exists with Supabase connection status UI but is not rendered in `page.tsx` or layout.

**Fix:** Either integrate into navbar/board header or remove.

---

### 11. `deleteCard` Passes Wrong State to Supabase
**File:** `frontend/src/components/KanbanBoard.tsx` (line 166)

```typescript
const handleDeleteCard = async (cardId: string) => {
  const updated = columns.map((col) => ({
    ...col,
    cards: col.cards.filter((c) => c.id !== cardId),
  }));
  setColumns(updated);
  await deleteCard(cardId, columns);  // BUG: should pass 'updated'
};
```

**Fix:** Pass `updated` instead of `columns`.

---

### 12. Next.js 16.3.4 and React 19.2.8 - Unstable Versions
**File:** `frontend/package.json`

```json
"next": "16.3.4",
"react": "19.2.8",
"react-dom": "19.2.8"
```

**Problem:** Next.js 16 and React 19 are not stable releases as of 2026. Using canary/rc versions in production MVP is risky.

**Fix:** Pin to latest stable: Next.js 14.x or 15.x, React 18.x.

---

### 13. TypeScript `any` Implicit in Catch Clauses
**File:** `frontend/src/lib/supabase.ts` (lines 152, 261, 272)

```typescript
} catch (error) {  // implicit any
  console.warn("Supabase fetch failed...", error);
}
```

```typescript
} catch (err: unknown) {  // good
  const error = err as { message?: string };  // unsafe cast
```

**Fix:** Enable `noImplicitAny` in tsconfig (already strict), properly type catch variables.

---

## ðŸŸ¡ Medium Priority Issues

### 14. Drag-and-Drop Accessibility Incomplete
**File:** `frontend/tests/kanban.spec.ts` (lines 91-95)

```typescript
await card.focus();
await page.keyboard.press("Space");
await page.keyboard.press("ArrowRight");
await page.keyboard.press("Space");
```

**Problem:** Keyboard DnD test is fragile; `@hello-pangea/dnd` keyboard support requires specific setup (Droppable `mode="keyboard"`). No ARIA live regions for drag announcements.

**Fix:** Verify keyboard DnD works; add `aria-live` announcements; test with screen readers.

---

### 15. Column Title Edit Loses Focus on Blur Save
**File:** `frontend/src/components/KanbanColumn.tsx` (line 67)

```tsx
<input
  ...
  onBlur={handleSaveTitle}
/>
```

**Problem:** Clicking the save button (Check icon) triggers `onBlur` first, then `onClick` - but both call `handleSaveTitle`. Double-save race condition.

**Fix:** Use `onKeyDown` for Enter/Escape only; remove `onBlur` handler; let Save button handle click.

---

### 16. No Card Detail View / Expand
**Requirements:** "Each card has a title and details only"

**Problem:** Details are shown inline on card (truncated by card height). No way to view full details if long.

**Fix:** Add click-to-expand modal or side panel for card details.

---

### 17. Board Title Not Editable
**Requirements:** "The board has fixed 5 columns that can be renamed"

Board title is hardcoded ("Project Board") with no edit capability. Only columns are renameable.

**Fix:** Add inline edit for board title (consistent with column rename UX).

---

### 18. Inconsistent Color Usage
**File:** `frontend/src/app/globals.css`

- Accent Yellow (`#ecad0a`) used for: navbar border, status indicator, auth card top border âœ“
- Blue Primary (`#209dd7`) used for: links, focus rings, card left border, drag-over highlight âœ“
- Purple Secondary (`#753991`) used for: primary buttons âœ“
- **Missing:** Blue Primary for "key sections" per spec
- **Extra:** Green (`#10b981`) for connected status, Red (`#ef4444`) for delete hover - not in palette

**Fix:** Use palette colors for all semantic states; define semantic tokens (success, error, warning) mapped to palette.

---

### 19. No Loading/Skeleton States for Async Operations
**Files:** `KanbanBoard.tsx`, `AddCardModal.tsx`, `AuthGate.tsx`

- Card creation: No loading state on submit button
- Column rename: No saving indicator
- Auth: Has loading but no disabled state on inputs during submit

**Fix:** Add loading spinners/disabled states for all async actions.

---

### 20. Supabase Schema Missing Indexes
**File:** `supabase/schema.sql`

No indexes on frequently queried columns:
- `columns.board_id` (FK, but no explicit index)
- `cards.column_id` (FK, but no explicit index)
- `cards.position` (used in ORDER BY)

**Fix:** Add indexes:
```sql
CREATE INDEX idx_columns_board_id ON public.columns(board_id);
CREATE INDEX idx_cards_column_id ON public.cards(column_id);
CREATE INDEX idx_cards_position ON public.cards(column_id, position);
```

---

### 21. RLS Policies Too Permissive
**File:** `supabase/schema.sql` (lines 36-58)

```sql
CREATE POLICY "Authenticated users can select boards" ON public.boards
    FOR SELECT TO authenticated USING (true);
-- ... all policies use USING (true)
```

**Problem:** Any authenticated user can read/write ALL boards, columns, cards. No ownership or team isolation.

**Fix:** Since MVP is single shared board, this is acceptable but document clearly. For multi-board future, add `board_id` checks.

---

### 22. No Input Validation/Sanitization
**Files:** `AddCardModal.tsx`, `KanbanColumn.tsx`

- Title: `maxLength={40}` on column only; no limit on card title
- Details: No length limit
- No XSS protection (React escapes by default but `dangerouslySetInnerHTML` not used - OK)

**Fix:** Add max lengths; validate on server (Supabase CHECK constraints).

---

### 23. No Unique Constraint on Column Position per Board
**File:** `supabase/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS public.columns (
    ...
    position INT NOT NULL,
    ...
);
```

**Problem:** Duplicate positions possible, breaking sort order.

**Fix:** Add unique constraint:
```sql
UNIQUE (board_id, position)
```

---

### 24. Card Position Not Unique Per Column
**File:** `supabase/schema.sql`

Same issue for cards - multiple cards can have same position in same column.

**Fix:** Add unique constraint:
```sql
UNIQUE (column_id, position)
```

---

### 25. AuthGate `onBypassLocal` Creates Inconsistent State
**File:** `frontend/src/app/page.tsx` (lines 26, 116)

```tsx
const [bypassAuth, setBypassAuth] = useState<boolean>(false);
...
<AuthGate onBypassLocal={() => setBypassAuth(true)} />
```

**Problem:** Bypassing auth sets `bypassAuth=true` but doesn't clear `supabaseActive`. Navbar still shows "Local Mode" but user could have valid session.

**Fix:** On bypass, set `supabaseActive=false` or handle session properly.

---

## ðŸŸ¢ Low Priority / Nice to Have

### 26. Unused Dependency: `@types/pg`
**File:** `frontend/package.json`

```json
"@types/pg": "^8.23.1",
```

**Problem:** `pg` is only used in migration script (Node.js), not in Next.js app. Types not needed in frontend.

**Fix:** Move `pg` and `@types/pg` to devDependencies or separate migration package.json.

---

### 27. Unused Dependency: `pg` in Frontend
**File:** `frontend/package.json`

Same as above - `pg` only used in `scripts/run-migrations.mjs`.

**Fix:** Move to root `package.json` or separate migration tool.

---

### 28. Missing `.editorconfig` / Consistent Formatting
No editorconfig found. Mixed quote styles, indentation may vary.

**Fix:** Add `.editorconfig` with project standards.

---

### 29. No CI/CD Configuration
No GitHub Actions, GitLab CI, or similar for automated testing/linting.

**Fix:** Add CI workflow running `lint`, `test`, `test:e2e`, `build`.

---

### 30. Test Coverage Minimal
- Unit tests (`kanban.test.mjs`): Only check file contents, no logic testing
- E2E tests: Happy path only; no error cases, no drag-drop edge cases

**Fix:** Add unit tests for `supabase.ts` functions (with mocked Supabase); add E2E for error states.

---

### 31. `AuthGate` Creates User But Doesn't Auto-Sign-In After Email Confirm
**File:** `frontend/src/components/AuthGate.tsx` (lines 30-34)

```typescript
if (data.session) {
  onSuccess();
} else {
  setSuccessMsg("Registration successful. Check your email for a confirmation link if email confirmation is enabled, or sign in now.");
}
```

**Problem:** If email confirmation disabled, user gets session immediately. If enabled, user must manually sign in after clicking email link. No auto-detection.

**Fix:** Listen for auth state change after signup; or redirect to login with message.

---

### 32. Column Header Actions Not Keyboard Accessible
**File:** `frontend/src/components/KanbanColumn.tsx`

Edit (pencil) and Save (check) buttons are `<button>` but no `tabIndex` management when not editing. Screen reader labels could be improved.

**Fix:** Ensure focus management; add `aria-expanded` on column title.

---

### 33. No "Empty Column" Placeholder UI
**File:** `frontend/src/components/KanbanColumn.tsx`

When column has 0 cards, just shows empty space with dashed "Add Card" button at bottom. No visual drop target indication.

**Fix:** Add empty state message: "Drop cards here or click Add Card".

---

### 34. Card Delete Uses `window.confirm` - Not Accessible
**File:** `frontend/src/components/KanbanCard.tsx` (line 29)

```typescript
if (window.confirm(`Delete card "${card.title}"?`)) {
```

**Problem:** Blocks main thread; not styleable; not accessible (no focus trap, no screen reader context).

**Fix:** Use modal confirmation dialog (reusing `AddCardModal` pattern).

---

### 35. Hardcoded Board ID in Multiple Places
**Files:** `types/kanban.ts` (line 23), `supabase.ts` (lines 72, 78, 155), `schema.sql` (line 63)

```typescript
export const DEFAULT_BOARD_ID = "00000000-0000-0000-0000-000000000001";
```

**Problem:** If schema changes or multi-board added, must update 4+ files.

**Fix:** Single constant export; fetch board ID from DB on init.

---

### 36. `INITIAL_DUMMY_COLUMNS` Duplicates Schema Seed Data
**Files:** `types/kanban.ts` vs `schema.sql`

Both define the same 5 columns and 7 cards with same UUIDs. If one changes, other becomes stale.

**Fix:** Single source - either remove from TypeScript (fetch from DB) or generate TypeScript from SQL.

---

### 37. No Refresh/Re-sync Button
If Supabase sync fails or user wants to pull latest, no manual refresh.

**Fix:** Add refresh button in navbar or board header.

---

### 38. No Visual Drag Preview / Ghost Card
**File:** `globals.css` / `KanbanCard.tsx`

`@hello-pangea/dnd` supports `dragHandleProps` but no custom drag preview configured. Card just rotates 1deg.

**Fix:** Implement custom drag preview with opacity/shadow.

---

### 39. Column Width Fixed at 310px - Not Responsive
**File:** `globals.css` (line 221)

```css
.kanban-column {
  flex: 0 0 310px;
  width: 310px;
}
```

**Problem:** On mobile/tablet, horizontal scroll only. No stacked layout.

**Fix:** Add responsive breakpoint: stack columns vertically on < 768px.

---

### 40. Missing Favicon / PWA Manifest
**Files:** `frontend/public/` has only default Next.js SVGs.

**Fix:** Add branded favicon, apple-touch-icon, manifest.json.

---

## ðŸ“‹ Summary by Category

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Security | 3 | 0 | 0 | 0 | 3 |
| Architecture | 1 | 3 | 2 | 1 | 7 |
| Code Quality | 0 | 3 | 4 | 5 | 12 |
| UX/UI | 0 | 1 | 4 | 5 | 10 |
| Testing | 1 | 0 | 1 | 1 | 3 |
| Database | 0 | 1 | 2 | 2 | 5 |
| Dependencies | 1 | 0 | 0 | 2 | 3 |
| **Total** | **6** | **8** | **13** | **16** | **43** |

---

## âœ… Immediate Action Items (Priority Order)

1. **Rotate all exposed Supabase credentials** - Do this FIRST
2. **Add `.gitignore`** to prevent future leaks
3. **Remove hardcoded credentials** from migration scripts
4. **Fix `deleteCard` bug** - pass `updated` not `columns`
5. **Remove `page.module.css`** dead code
6. **Integrate or remove `StatusBanner`** component
7. **Pin stable Next.js/React versions**
8. **Add database indexes and unique constraints**
9. **Implement efficient sync** (dirty tracking only)
10. **Add error boundaries and user-facing error handling**

---

## ðŸ“ Notes on Requirements Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| Single board | âœ… | Implemented |
| Fixed 5 columns | âœ… | Backlog, To Do, In Progress, In Review, Done |
| Columns renameable | âœ… | Inline edit with click/Enter |
| Cards: title + details | âœ… | Implemented |
| Drag and drop | âœ… | @hello-pangea/dnd |
| Add card | âœ… | Modal with title + details |
| Delete card | âœ… | With confirmation |
| No archive/search/filter | âœ… | Not implemented (per req) |
| Slick/professional UI | âš ï¸ | Good base, needs polish (responsive, loading states) |
| Dummy data on open | âœ… | Seeded from DB or localStorage |
| Supabase Auth | âœ… | Email/password |
| Supabase Persistence | âš ï¸ | Works but sync issues |
| Zero emojis | âœ… | Verified by tests |
| Custom color palette | âš ï¸ | Mostly compliant, some extra colors |

---

## ðŸŽ¯ Recommended Next Steps

1. **Security Sprint** (Day 1): Rotate keys, add .gitignore, remove hardcoded secrets
2. **Stability Sprint** (Day 2-3): Fix sync logic, add error handling, fix delete bug
3. **Quality Sprint** (Day 4): Remove dead code, add indexes, improve accessibility
4. **Polish Sprint** (Day 5): Responsive design, loading states, drag preview, refresh button
5. **Testing Sprint** (Day 6): Expand unit/E2E coverage, add CI
6. **Deploy & Verify** (Day 7): Production deploy, smoke test, monitor

---

*End of Review*
