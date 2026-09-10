import { describe, it, expect } from 'vitest';
import { kanbanReducer } from '../reducers/kanbanReducer';
import { BoardState } from '../types/kanban';

const createSampleState = (): BoardState => ({
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Backlog',
      cardIds: ['card-1', 'card-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'Ready',
      cardIds: ['card-3'],
    },
  },
  columnOrder: ['col-1', 'col-2'],
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Task One',
      details: 'Details for task one',
      createdAt: '2026-09-01',
    },
    'card-2': {
      id: 'card-2',
      title: 'Task Two',
      details: 'Details for task two',
      createdAt: '2026-09-02',
    },
    'card-3': {
      id: 'card-3',
      title: 'Task Three',
      details: 'Details for task three',
      createdAt: '2026-09-03',
    },
  },
});

describe('kanbanReducer', () => {
  it('should rename an existing column with valid title', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'RENAME_COLUMN',
      payload: { columnId: 'col-1', newTitle: 'Icebox' },
    });

    expect(updated.columns['col-1'].title).toBe('Icebox');
  });

  it('should trim whitespace when renaming a column', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'RENAME_COLUMN',
      payload: { columnId: 'col-1', newTitle: '   Sprint Backlog   ' },
    });

    expect(updated.columns['col-1'].title).toBe('Sprint Backlog');
  });

  it('should not rename a column if title is empty or only whitespace', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'RENAME_COLUMN',
      payload: { columnId: 'col-1', newTitle: '   ' },
    });

    expect(updated.columns['col-1'].title).toBe('Backlog');
  });

  it('should add a new card to a specified column', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'ADD_CARD',
      payload: {
        columnId: 'col-1',
        title: 'New Feature Work',
        details: 'Implement frontend logic',
      },
    });

    expect(updated.columns['col-1'].cardIds).toHaveLength(3);
    const newCardId = updated.columns['col-1'].cardIds[2];
    expect(updated.cards[newCardId]).toBeDefined();
    expect(updated.cards[newCardId].title).toBe('New Feature Work');
    expect(updated.cards[newCardId].details).toBe('Implement frontend logic');
  });

  it('should not add a card if title is empty', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'ADD_CARD',
      payload: {
        columnId: 'col-1',
        title: '   ',
        details: 'Some details',
      },
    });

    expect(updated.columns['col-1'].cardIds).toHaveLength(2);
  });

  it('should delete an existing card from a column and cards store', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'DELETE_CARD',
      payload: {
        columnId: 'col-1',
        cardId: 'card-1',
      },
    });

    expect(updated.columns['col-1'].cardIds).toEqual(['card-2']);
    expect(updated.cards['card-1']).toBeUndefined();
    expect(updated.cards['card-2']).toBeDefined();
  });

  it('should reorder cards within the same column', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'MOVE_CARD',
      payload: {
        sourceColId: 'col-1',
        destColId: 'col-1',
        sourceIndex: 0,
        destIndex: 1,
      },
    });

    expect(updated.columns['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('should move a card from one column to another', () => {
    const state = createSampleState();
    const updated = kanbanReducer(state, {
      type: 'MOVE_CARD',
      payload: {
        sourceColId: 'col-1',
        destColId: 'col-2',
        sourceIndex: 0,
        destIndex: 0,
      },
    });

    expect(updated.columns['col-1'].cardIds).toEqual(['card-2']);
    expect(updated.columns['col-2'].cardIds).toEqual(['card-1', 'card-3']);
  });
});
