'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical } from 'lucide-react';
import { Card } from '../types/kanban';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: Card;
  index: number;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  index,
  columnId,
  onDelete,
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${snapshot.isDragging ? styles.cardDragging : ''}`}
          data-testid={`card-${card.id}`}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, card.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label={`Delete card "${card.title}"`}
              title="Delete card"
              data-testid={`delete-card-${card.id}`}
            >
              <Trash2 size={15} />
            </button>
          </div>

          <p className={styles.cardDetails}>{card.details}</p>

          <div className={styles.cardFooter}>
            <span>{card.createdAt}</span>
            <div className={styles.dragHandle} title="Drag to reorder or move">
              <GripVertical size={14} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
