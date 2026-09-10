import { BoardState } from '../types/kanban';

export const initialBoardData: BoardState = {
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Backlog',
      cardIds: ['card-1', 'card-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'Ready',
      cardIds: ['card-3', 'card-4'],
    },
    'col-3': {
      id: 'col-3',
      title: 'In Progress',
      cardIds: ['card-5'],
    },
    'col-4': {
      id: 'col-4',
      title: 'In Review',
      cardIds: ['card-6', 'card-7'],
    },
    'col-5': {
      id: 'col-5',
      title: 'Done',
      cardIds: ['card-8'],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Research vector indexing benchmarks',
      details: 'Analyze memory footprint and recall rate across HNSW and IVF algorithms for large dataset query retrieval.',
      createdAt: '2026-09-01',
    },
    'card-2': {
      id: 'card-2',
      title: 'Draft API specification for workspace sync',
      details: 'Define REST and WebSocket schemas for bi-directional state synchronization between client and server nodes.',
      createdAt: '2026-09-02',
    },
    'card-3': {
      id: 'card-3',
      title: 'Implement design tokens and typography',
      details: 'Configure core theme variables: Accent Yellow, Blue Primary, Purple Secondary, Dark Navy, and Gray Text.',
      createdAt: '2026-09-03',
    },
    'card-4': {
      id: 'card-4',
      title: 'Setup integration testing with Playwright',
      details: 'Automate browser verification runs targeting chrome engine without external browser bundle downloads.',
      createdAt: '2026-09-03',
    },
    'card-5': {
      id: 'card-5',
      title: 'Develop drag and drop board layout',
      details: 'Build accessible column containers and draggable card items with smooth physics animations.',
      createdAt: '2026-09-04',
    },
    'card-6': {
      id: 'card-6',
      title: 'Audit state updates for column reordering',
      details: 'Verify pure reducer functions when moving cards between columns to ensure zero mutation leaks.',
      createdAt: '2026-09-05',
    },
    'card-7': {
      id: 'card-7',
      title: 'Inspect responsive layout behavior',
      details: 'Check horizontal scroll container and column widths on laptop and mobile screen resolutions.',
      createdAt: '2026-09-05',
    },
    'card-8': {
      id: 'card-8',
      title: 'Configure Next.js project structure',
      details: 'Scaffold App Router architecture with TypeScript, ESLint, and modular component hierarchy.',
      createdAt: '2026-09-06',
    },
  },
};
