export interface Card {
  id: string;
  column_id: string;
  title: string;
  details: string;
  position: number;
  created_at?: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
}

export const DEFAULT_BOARD_ID = "00000000-0000-0000-0000-000000000001";

export const INITIAL_DUMMY_COLUMNS: Column[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    board_id: DEFAULT_BOARD_ID,
    title: "Backlog",
    position: 0,
    cards: [
      {
        id: "20000000-0000-0000-0000-000000000001",
        column_id: "10000000-0000-0000-0000-000000000001",
        title: "API Rate Limiting",
        details: "Evaluate Redis token bucket approach for public endpoints",
        position: 0,
      },
      {
        id: "20000000-0000-0000-0000-000000000002",
        column_id: "10000000-0000-0000-0000-000000000001",
        title: "Accessibility Audit",
        details: "Ensure all interactive elements meet WCAG AA standards",
        position: 1,
      },
    ],
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    board_id: DEFAULT_BOARD_ID,
    title: "To Do",
    position: 1,
    cards: [
      {
        id: "20000000-0000-0000-0000-000000000003",
        column_id: "10000000-0000-0000-0000-000000000002",
        title: "Supabase Auth Setup",
        details: "Configure email and password authentication with session cookies",
        position: 0,
      },
      {
        id: "20000000-0000-0000-0000-000000000004",
        column_id: "10000000-0000-0000-0000-000000000002",
        title: "Design System Tokens",
        details: "Verify brand hex codes for primary, secondary, and accent colors",
        position: 1,
      },
    ],
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    board_id: DEFAULT_BOARD_ID,
    title: "In Progress",
    position: 2,
    cards: [
      {
        id: "20000000-0000-0000-0000-000000000005",
        column_id: "10000000-0000-0000-0000-000000000003",
        title: "Kanban Board Drag and Drop",
        details: "Implement smooth card reordering and cross-column movement",
        position: 0,
      },
    ],
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    board_id: DEFAULT_BOARD_ID,
    title: "In Review",
    position: 3,
    cards: [
      {
        id: "20000000-0000-0000-0000-000000000006",
        column_id: "10000000-0000-0000-0000-000000000004",
        title: "Column Rename Workflow",
        details: "Enable inline renaming with immediate UI update and persistence",
        position: 0,
      },
    ],
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    board_id: DEFAULT_BOARD_ID,
    title: "Done",
    position: 4,
    cards: [
      {
        id: "20000000-0000-0000-0000-000000000007",
        column_id: "10000000-0000-0000-0000-000000000005",
        title: "Project Scaffolding",
        details: "Initialize Next.js project with App Router and TypeScript",
        position: 0,
      },
    ],
  },
];
