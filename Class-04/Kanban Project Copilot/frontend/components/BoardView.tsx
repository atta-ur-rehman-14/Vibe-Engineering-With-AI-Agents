"use client";

import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useReducer, useState } from "react";
import { boardReducer } from "@/lib/board-state";
import { initialBoard } from "@/lib/initial-data";
import type { Card } from "@/lib/types";
import { ColumnView } from "./ColumnView";

export function BoardView() {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function findColumn(cardId: string) {
    return board.columns.find((column) => column.cards.some((card) => card.id === cardId));
  }

  function handleDragStart(event: DragStartEvent) {
    const column = findColumn(String(event.active.id));
    setActiveCard(column?.cards.find((card) => card.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    if (!event.over || event.active.id === event.over.id) return;
    const sourceColumn = findColumn(String(event.active.id));
    const destinationColumn = findColumn(String(event.over.id)) ?? board.columns.find((column) => column.id === event.over?.id);
    if (!sourceColumn || !destinationColumn) return;
    const destinationIndex = destinationColumn.cards.findIndex((card) => card.id === event.over?.id);
    dispatch({ type: "move-card", sourceColumnId: sourceColumn.id, destinationColumnId: destinationColumn.id, cardId: String(event.active.id), destinationIndex: destinationIndex < 0 ? destinationColumn.cards.length : destinationIndex });
  }

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">O</span><span>orbit / workspace</span></div><span className="topbar-note">Local board · changes reset on refresh</span></header>
      <main className="board-main">
        <p className="eyebrow">One board, clear momentum</p>
        <div className="hero-row"><h1 className="hero-title">{board.title}</h1><p className="hero-subtitle">{board.subtitle}</p></div>
        <div className="board-rule" />
        <DndContext id="orbit-kanban-dnd" sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="board-grid">{board.columns.map((column) => <ColumnView key={column.id} column={column} onRename={(columnId, title) => dispatch({ type: "rename-column", columnId, title })} onAdd={(columnId, title, details) => dispatch({ type: "add-card", columnId, title, details })} onDelete={(columnId, cardId) => dispatch({ type: "delete-card", columnId, cardId })} />)}</div>
          <DragOverlay>{activeCard ? <article className="task-card"><h3 className="task-title">{activeCard.title}</h3><p className="task-details">{activeCard.details}</p></article> : null}</DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}