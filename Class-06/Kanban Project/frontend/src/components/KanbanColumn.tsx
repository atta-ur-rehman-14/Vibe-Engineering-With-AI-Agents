"use client";

import React, { useState, useRef, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, Edit2, Check } from "lucide-react";
import { Column } from "../types/kanban";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  column: Column;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenAddCard: (columnId: string, columnTitle: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onRenameColumn,
  onDeleteCard,
  onOpenAddCard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="kanban-column" data-testid={`column-${column.position}`}>
      <div className="column-header">
        <div className="column-header-left">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="column-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              maxLength={40}
              aria-label="Edit column title"
            />
          ) : (
            <span
              className="column-title-text"
              onClick={() => setIsEditing(true)}
              title="Click to rename column"
            >
              {column.title}
            </span>
          )}
          <span className="column-badge" title="Total cards">
            {column.cards.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {isEditing ? (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSaveTitle}
              className="column-action-btn"
              title="Save name"
              aria-label="Save column title"
            >
              <Check size={14} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="column-action-btn"
              title="Rename column"
              aria-label={`Rename ${column.title}`}
            >
              <Edit2 size={13} />
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`cards-list ${snapshot.isDraggingOver ? "is-dragging-over" : ""}`}
          >
            {column.cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="column-footer">
        <button
          onClick={() => onOpenAddCard(column.id, column.title)}
          className="btn-add-card"
          aria-label={`Add card to ${column.title}`}
        >
          <Plus size={14} />
          Add Card
        </button>
      </div>
    </div>
  );
};
