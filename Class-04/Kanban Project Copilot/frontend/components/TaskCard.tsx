"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Card as CardModel } from "@/lib/types";

type TaskCardProps = {
  card: CardModel;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export function TaskCard({ card, columnId, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <article ref={setNodeRef} style={style} className={`task-card${isDragging ? " dragging" : ""}`} {...attributes} {...listeners}>
      <button className="icon-button delete-button" type="button" aria-label={`Delete ${card.title}`} onClick={() => onDelete(columnId, card.id)}>
        <Trash2 size={15} strokeWidth={1.8} />
      </button>
      <h3 className="task-title">{card.title}</h3>
      {card.details && <p className="task-details">{card.details}</p>}
    </article>
  );
}