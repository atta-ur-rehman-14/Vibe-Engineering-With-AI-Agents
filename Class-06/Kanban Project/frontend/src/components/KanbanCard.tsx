"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { Card } from "../types/kanban";

interface KanbanCardProps {
  card: Card;
  index: number;
  onDelete: (cardId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, index, onDelete }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? "is-dragging" : ""}`}
        >
          <div className="card-top">
            <h4 className="card-title">{card.title}</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete card "${card.title}"?`)) {
                  onDelete(card.id);
                }
              }}
              className="card-delete-btn"
              title="Delete card"
              aria-label={`Delete card ${card.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {card.details && (
            <p className="card-details">{card.details}</p>
          )}
        </div>
      )}
    </Draggable>
  );
};
