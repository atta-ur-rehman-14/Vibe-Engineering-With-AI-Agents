# Kanban Project MVP

A streamlined Kanban-style Project Management web application built with Next.js and client-side state management.

## Features
- Single board with 5 fixed, renamable columns: Backlog, Ready, In Progress, In Review, and Done.
- Initial realistic dummy data pre-populated.
- Smooth drag-and-drop interface to move cards between columns and reorder within columns.
- Add new tasks (title and details) via modal dialog.
- Delete existing tasks.
- Sleek design matching the required palette (Accent Yellow, Blue Primary, Purple Secondary, Dark Navy, Gray Text).
- Zero emojis across the entire project.

## Project Structure
- `frontend/`: Next.js App Router project
  - `src/app/`: Layout and root entry point
  - `src/components/`: Modular React components (Header, KanbanBoard, Column, CardItem, AddCardModal)
  - `src/types/`: TypeScript definitions
  - `src/reducers/`: Pure state reducer for board manipulation
  - `src/hooks/`: React state management hook
  - `src/__tests__/`: Vitest unit tests
  - `tests/e2e/`: Playwright end-to-end integration tests

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
cd frontend
npm run dev
```
Open http://localhost:3000 in your browser.

### 3. Run Tests
- Unit tests:
  ```bash
  npm run test:unit
  ```
- End-to-end integration tests:
  ```bash
  npm run test:e2e
  ```

## Deployment to Vercel

The application is built with Next.js in the `frontend` folder and includes a tailored `frontend/vercel.json` configuration.

### Method 1: Vercel Web Dashboard (Recommended)

When importing the GitHub repository (`atta-ur-rehman-14/Vibe-Engineering`) into Vercel:

1. In the Vercel Dashboard, click **Add New...** > **Project** and select your repository.
2. In the **Configure Project** screen, locate **Root Directory** and click **Edit**.
3. Select or enter:
   ```text
   Class-04/Kanban Project Antigravity/frontend
   ```
4. Vercel will automatically detect:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (or default)
   - **Output Directory**: Next.js default (`.next`)
   - **Install Command**: `npm install`
5. Click **Deploy**.

> Note: Do not leave the Root Directory as `./` because the repository contains multiple project folders and Vercel needs to know where the Next.js application lives.

### Method 2: Vercel CLI

You can also deploy directly from your local terminal:

1. Open your terminal and navigate to the `frontend` directory:
   ```bash
   cd "Class-04/Kanban Project Antigravity/frontend"
   ```
2. Run the deployment command:
   ```bash
   npx vercel
   ```
3. For production release:
   ```bash
   npx vercel --prod
   ```
