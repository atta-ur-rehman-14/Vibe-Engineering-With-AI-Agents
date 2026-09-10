'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useKanbanBoard } from '../hooks/useKanbanBoard';
import { Header } from './Header';
import { Column } from './Column';
import { AddCardModal } from './AddCardModal';
import styles from './KanbanBoard.module.css';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const KanbanBoard: React.FC = () => {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { board, moveCard, renameColumn, addCard, deleteCard } = useKanbanBoard();

  const [activeModalColumnId, setActiveModalColumnId] = useState<string | null>(null);

  const totalCards = Object.keys(board.cards).length;
  const columnCount = board.columnOrder.length;

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCard(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleOpenAddModal = (columnId: string) => {
    setActiveModalColumnId(columnId);
  };

  const handleCloseAddModal = () => {
    setActiveModalColumnId(null);
  };

  const activeColumn = activeModalColumnId ? board.columns[activeModalColumnId] : null;

  if (!mounted) {
    return (
      <div className={styles.pageContainer}>
        <Header totalCards={totalCards} columnCount={columnCount} />
        <div className={styles.loadingWrapper}>
          <span>Initializing workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer} data-testid="kanban-page">
      <Header totalCards={totalCards} columnCount={columnCount} />

      <div className={styles.boardSubheader}>
        <div className={styles.boardInfo}>
          <h2 className={styles.boardTitle}>Sprint Execution Board</h2>
          <span className={styles.boardTag}>Active Iteration</span>
        </div>
        <p className={styles.instruction}>
          Drag and drop cards across columns to transition states. Click column names to rename.
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <main className={styles.boardContent} data-testid="kanban-board-canvas">
          {board.columnOrder.map((colId) => {
            const column = board.columns[colId];
            const columnCards = column.cardIds
              .map((cardId) => board.cards[cardId])
              .filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onRename={renameColumn}
                onOpenAddModal={handleOpenAddModal}
                onDeleteCard={deleteCard}
              />
            );
          })}
        </main>
      </DragDropContext>

      <AddCardModal
        isOpen={Boolean(activeModalColumnId && activeColumn)}
        columnId={activeModalColumnId || ''}
        columnTitle={activeColumn?.title || ''}
        onClose={handleCloseAddModal}
        onSubmit={addCard}
      />
    </div>
  );
};
