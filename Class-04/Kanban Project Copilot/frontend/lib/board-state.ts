import type { Board, Card } from "./types";

export type BoardAction =
  | { type: "rename-column"; columnId: string; title: string }
  | { type: "add-card"; columnId: string; title: string; details: string }
  | { type: "delete-card"; columnId: string; cardId: string }
  | {
      type: "move-card";
      sourceColumnId: string;
      destinationColumnId: string;
      cardId: string;
      destinationIndex: number;
    };

export function cleanTitle(value: string) {
  return value.trim();
}

export function canSubmitTitle(value: string) {
  return cleanTitle(value).length > 0;
}

function createCard(title: string, details: string): Card {
  return {
    id: `card-${crypto.randomUUID()}`,
    title: cleanTitle(title),
    details: details.trim(),
  };
}

export function boardReducer(board: Board, action: BoardAction): Board {
  if (action.type === "rename-column") {
    const title = cleanTitle(action.title);
    if (!title) return board;

    return {
      ...board,
      columns: board.columns.map((column) =>
        column.id === action.columnId ? { ...column, title } : column,
      ),
    };
  }

  if (action.type === "add-card") {
    if (!canSubmitTitle(action.title)) return board;

    return {
      ...board,
      columns: board.columns.map((column) =>
        column.id === action.columnId
          ? { ...column, cards: [...column.cards, createCard(action.title, action.details)] }
          : column,
      ),
    };
  }

  if (action.type === "delete-card") {
    return {
      ...board,
      columns: board.columns.map((column) =>
        column.id === action.columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== action.cardId) }
          : column,
      ),
    };
  }

  const sourceColumn = board.columns.find((column) => column.id === action.sourceColumnId);
  const destinationColumn = board.columns.find(
    (column) => column.id === action.destinationColumnId,
  );
  const card = sourceColumn?.cards.find((item) => item.id === action.cardId);

  if (!sourceColumn || !destinationColumn || !card) return board;

  const sourceCards = sourceColumn.cards.filter((item) => item.id !== action.cardId);
  const destinationCards =
    action.sourceColumnId === action.destinationColumnId
      ? sourceCards
      : [...destinationColumn.cards];
  const destinationIndex = Math.max(0, Math.min(action.destinationIndex, destinationCards.length));
  destinationCards.splice(destinationIndex, 0, card);

  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id === action.sourceColumnId && column.id === action.destinationColumnId) {
        return { ...column, cards: destinationCards };
      }
      if (column.id === action.sourceColumnId) return { ...column, cards: sourceCards };
      if (column.id === action.destinationColumnId) return { ...column, cards: destinationCards };
      return column;
    }),
  };
}