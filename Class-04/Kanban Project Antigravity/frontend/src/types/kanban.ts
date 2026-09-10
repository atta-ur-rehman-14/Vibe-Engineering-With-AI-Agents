export interface Card {
  id: string;
  title: string;
  details: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columns: Record<string, Column>;
  columnOrder: string[];
  cards: Record<string, Card>;
}

export type BoardAction =
  | {
      type: 'MOVE_CARD';
      payload: {
        sourceColId: string;
        destColId: string;
        sourceIndex: number;
        destIndex: number;
      };
    }
  | {
      type: 'RENAME_COLUMN';
      payload: {
        columnId: string;
        newTitle: string;
      };
    }
  | {
      type: 'ADD_CARD';
      payload: {
        columnId: string;
        title: string;
        details: string;
      };
    }
  | {
      type: 'DELETE_CARD';
      payload: {
        columnId: string;
        cardId: string;
      };
    };
