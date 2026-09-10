'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Edit2, Plus, Check } from 'lucide-react';
import { Column as ColumnType, Card as CardType } from '../types/kanban';
import { CardItem } from './CardItem';
import styles from './Column.module.css';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onRename: (columnId: string, newTitle: string) => void;
  onOpenAddModal: (columnId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  cards,
  onRename,
  onOpenAddModal,
  onDeleteCard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  const [prevTitle, setPrevTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  if (column.title !== prevTitle) {
    setPrevTitle(column.title);
    setTitleInput(column.title);
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed);
    } else {
      setTitleInput(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitleInput(column.title);
      setIsEditing(false);
    }
  };

  return (
    <section className={styles.column} data-testid={`column-${column.id}`}>
      <div className={styles.columnHeader}>
        <div className={styles.titleArea}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className={styles.titleInput}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              data-testid={`column-input-${column.id}`}
              aria-label={`Rename column ${column.title}`}
            />
          ) : (
            <h2
              className={styles.columnTitle}
              onClick={() => setIsEditing(true)}
              title="Click or use edit button to rename"
              data-testid={`column-title-${column.id}`}
            >
              {column.title}
            </h2>
          )}
          <span className={styles.badge} data-testid={`column-count-${column.id}`}>
            {cards.length}
          </span>
        </div>

        <div className={styles.headerActions}>
          {isEditing ? (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleSaveTitle}
              aria-label="Save column title"
              title="Save"
              data-testid={`save-title-${column.id}`}
            >
              <Check size={16} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsEditing(true)}
              aria-label={`Rename column ${column.title}`}
              title="Rename column"
              data-testid={`edit-title-${column.id}`}
            >
              <Edit2 size={15} />
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.cardList} ${
              snapshot.isDraggingOver ? styles.columnDraggingOver : ''
            }`}
            data-testid={`droppable-column-${column.id}`}
          >
            {cards.length === 0 ? (
              <div className={styles.emptyPlaceholder}>
                No tasks in this column
              </div>
            ) : (
              cards.map((card, idx) => (
                <CardItem
                  key={card.id}
                  card={card}
                  index={idx}
                  columnId={column.id}
                  onDelete={onDeleteCard}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className={styles.columnFooter}>
        <button
          type="button"
          className={styles.addCardBtn}
          onClick={() => onOpenAddModal(column.id)}
          aria-label={`Add task to ${column.title}`}
          data-testid={`add-card-button-${column.id}`}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </section>
  );
};
