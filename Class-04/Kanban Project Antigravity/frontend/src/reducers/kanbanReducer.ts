import { BoardState, BoardAction, Card } from '../types/kanban';

export function kanbanReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'MOVE_CARD': {
      const { sourceColId, destColId, sourceIndex, destIndex } = action.payload;
      const sourceCol = state.columns[sourceColId];
      const destCol = state.columns[destColId];

      if (!sourceCol || !destCol) return state;

      // Reordering within the same column
      if (sourceColId === destColId) {
        const newCardIds = Array.from(sourceCol.cardIds);
        const [movedCardId] = newCardIds.splice(sourceIndex, 1);
        if (!movedCardId) return state;
        newCardIds.splice(destIndex, 0, movedCardId);

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColId]: {
              ...sourceCol,
              cardIds: newCardIds,
            },
          },
        };
      }

      // Moving from one column to another
      const sourceCardIds = Array.from(sourceCol.cardIds);
      const [movedCardId] = sourceCardIds.splice(sourceIndex, 1);
      if (!movedCardId) return state;

      const destCardIds = Array.from(destCol.cardIds);
      destCardIds.splice(destIndex, 0, movedCardId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColId]: {
            ...sourceCol,
            cardIds: sourceCardIds,
          },
          [destColId]: {
            ...destCol,
            cardIds: destCardIds,
          },
        },
      };
    }

    case 'RENAME_COLUMN': {
      const { columnId, newTitle } = action.payload;
      const trimmedTitle = newTitle.trim();
      const col = state.columns[columnId];
      if (!col || !trimmedTitle) return state;

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...col,
            title: trimmedTitle,
          },
        },
      };
    }

    case 'ADD_CARD': {
      const { columnId, title, details } = action.payload;
      const col = state.columns[columnId];
      const trimmedTitle = title.trim();
      if (!col || !trimmedTitle) return state;

      const newCardId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newCard: Card = {
        id: newCardId,
        title: trimmedTitle,
        details: details.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      };

      return {
        ...state,
        cards: {
          ...state.cards,
          [newCardId]: newCard,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...col,
            cardIds: [...col.cardIds, newCardId],
          },
        },
      };
    }

    case 'DELETE_CARD': {
      const { columnId, cardId } = action.payload;
      const col = state.columns[columnId];
      if (!col) return state;

      const updatedCardIds = col.cardIds.filter((id) => id !== cardId);
      const updatedCards = { ...state.cards };
      delete updatedCards[cardId];

      return {
        ...state,
        cards: updatedCards,
        columns: {
          ...state.columns,
          [columnId]: {
            ...col,
            cardIds: updatedCardIds,
          },
        },
      };
    }

    default:
      return state;
  }
}
