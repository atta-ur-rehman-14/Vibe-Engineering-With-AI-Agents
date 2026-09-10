"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column, Card } from "../types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { AddCardModal } from "./AddCardModal";
import {
  updateColumnTitle,
  createCard,
  deleteCard,
  syncColumnsState,
} from "../lib/supabase";

interface KanbanBoardProps {
  initialColumns: Column[];
  boardTitle: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialColumns,
  boardTitle,
}) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isMounted, setIsMounted] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Drag and Drop Handler
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex((c) => c.id === source.droppableId);
    const destColIndex = columns.findIndex((c) => c.id === destination.droppableId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const newColumns = [...columns];

    // Same column reorder
    if (sourceColIndex === destColIndex) {
      const col = newColumns[sourceColIndex];
      const newCards = Array.from(col.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      // Re-index positions
      const updatedCards = newCards.map((card, idx) => ({
        ...card,
        position: idx,
      }));

      newColumns[sourceColIndex] = {
        ...col,
        cards: updatedCards,
      };

      setColumns(newColumns);
      await syncColumnsState(newColumns);
      return;
    }

    // Moving between different columns
    const sourceCol = newColumns[sourceColIndex];
    const destCol = newColumns[destColIndex];

    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);

    const [movedCard] = sourceCards.splice(source.index, 1);
    const updatedMovedCard: Card = {
      ...movedCard,
      column_id: destCol.id,
    };

    destCards.splice(destination.index, 0, updatedMovedCard);

    // Re-index both columns
    newColumns[sourceColIndex] = {
      ...sourceCol,
      cards: sourceCards.map((c, idx) => ({ ...c, position: idx })),
    };

    newColumns[destColIndex] = {
      ...destCol,
      cards: destCards.map((c, idx) => ({ ...c, position: idx })),
    };

    setColumns(newColumns);
    await syncColumnsState(newColumns);
  };

  // Rename column
  const handleRenameColumn = async (columnId: string, newTitle: string) => {
    const updated = columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    setColumns(updated);
    await updateColumnTitle(columnId, newTitle, updated);
  };

  // Open Add Card modal
  const handleOpenAddCard = (columnId: string, columnTitle: string) => {
    setTargetColumn({ id: columnId, title: columnTitle });
    setModalOpen(true);
  };

  // Submit Add Card
  const handleCreateCard = async (title: string, details: string) => {
    if (!targetColumn) return;

    const colIndex = columns.findIndex((c) => c.id === targetColumn.id);
    if (colIndex === -1) return;

    const nextPosition = columns[colIndex].cards.length;
    const newCard = await createCard(
      targetColumn.id,
      title,
      details,
      nextPosition,
      columns
    );

    const updated = columns.map((col) => {
      if (col.id === targetColumn.id) {
        // Prevent duplicate if already added in optimistic path
        const exists = col.cards.some((c) => c.id === newCard.id);
        return {
          ...col,
          cards: exists ? col.cards : [...col.cards, newCard],
        };
      }
      return col;
    });

    setColumns(updated);
  };

  // Delete Card
  const handleDeleteCard = async (cardId: string) => {
    const updated = columns.map((col) => ({
      ...col,
      cards: col.cards.filter((c) => c.id !== cardId),
    }));
    setColumns(updated);
    await deleteCard(cardId, updated);
  };

  if (!isMounted) {
    return (
      <main className="board-container">
        <div className="board-header">
          <div>
            <h2 className="board-title">{boardTitle}</h2>
            <p className="board-subtitle">Loading board state...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="board-container">
      <div className="board-header">
        <div>
          <h2 className="board-title">{boardTitle}</h2>
          <p className="board-subtitle">
            Manage engineering and product tasks across fixed stages. Drag cards to update status.
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-row">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              onRenameColumn={handleRenameColumn}
              onDeleteCard={handleDeleteCard}
              onOpenAddCard={handleOpenAddCard}
            />
          ))}
        </div>
      </DragDropContext>

      <AddCardModal
        isOpen={modalOpen}
        columnTitle={targetColumn ? targetColumn.title : ""}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateCard}
      />
    </main>
  );
};
