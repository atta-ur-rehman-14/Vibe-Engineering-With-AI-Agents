"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Column } from "@/lib/types";
import { canSubmitTitle } from "@/lib/board-state";
import { TaskCard } from "./TaskCard";

type ColumnViewProps = {
  column: Column;
  onRename: (columnId: string, title: string) => void;
  onAdd: (columnId: string, title: string, details: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
};

export function ColumnView({ column, onRename, onAdd, onDelete }: ColumnViewProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitTitle(title)) {
      setError("Add a title to create this card.");
      return;
    }
    onAdd(column.id, title, details);
    setTitle("");
    setDetails("");
    setError("");
    setAdding(false);
  }

  return (
    <section className="column" ref={setNodeRef} aria-label={column.title}>
      <header className="column-header">
        <input className="column-title" aria-label={`Rename ${column.title} column`} value={column.title} onChange={(event) => onRename(column.id, event.target.value)} onBlur={(event) => onRename(column.id, event.target.value)} />
        <span className="count" aria-label={`${column.cards.length} cards`}>{column.cards.length}</span>
      </header>
      <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="card-list">
          {column.cards.length ? column.cards.map((card) => <TaskCard key={card.id} card={card} columnId={column.id} onDelete={onDelete} />) : <div className="empty-state">Drop a card here</div>}
        </div>
      </SortableContext>
      {adding ? (
        <form className="add-form" onSubmit={submit}>
          <input className="field" autoFocus placeholder="Card title" aria-label={`New card title for ${column.title}`} value={title} onChange={(event) => setTitle(event.target.value)} />
          <textarea className="field" placeholder="Details (optional)" aria-label="Card details" value={details} onChange={(event) => setDetails(event.target.value)} />
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions"><button className="quiet-button" type="button" onClick={() => setAdding(false)}>Cancel</button><button className="primary-button" type="submit">Add card</button></div>
        </form>
      ) : <button className="quiet-button" type="button" onClick={() => setAdding(true)}><Plus size={14} /> Add card</button>}
    </section>
  );
}