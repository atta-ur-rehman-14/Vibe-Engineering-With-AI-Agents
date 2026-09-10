'use client';

import { useReducer, useCallback } from 'react';
import { initialBoardData } from '../data/initialData';
import { kanbanReducer } from '../reducers/kanbanReducer';
import { BoardState } from '../types/kanban';

export function useKanbanBoard(initialData: BoardState = initialBoardData) {
  const [board, dispatch] = useReducer(kanbanReducer, initialData);

  const moveCard = useCallback(
    (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => {
      dispatch({
        type: 'MOVE_CARD',
        payload: { sourceColId, destColId, sourceIndex, destIndex },
      });
    },
    []
  );

  const renameColumn = useCallback((columnId: string, newTitle: string) => {
    dispatch({
      type: 'RENAME_COLUMN',
      payload: { columnId, newTitle },
    });
  }, []);

  const addCard = useCallback((columnId: string, title: string, details: string) => {
    dispatch({
      type: 'ADD_CARD',
      payload: { columnId, title, details },
    });
  }, []);

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    dispatch({
      type: 'DELETE_CARD',
      payload: { columnId, cardId },
    });
  }, []);

  return {
    board,
    moveCard,
    renameColumn,
    addCard,
    deleteCard,
  };
}
