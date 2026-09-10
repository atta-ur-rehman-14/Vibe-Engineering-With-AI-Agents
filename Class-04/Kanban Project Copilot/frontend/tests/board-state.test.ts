import { describe, expect, it } from "vitest";
import { boardReducer, canSubmitTitle } from "@/lib/board-state";
import { initialBoard } from "@/lib/initial-data";

describe("boardReducer", () => {
  it("starts with five populated columns", () => {
    expect(initialBoard.columns).toHaveLength(5);
    expect(initialBoard.columns.some((column) => column.cards.length > 0)).toBe(true);
  });

  it("requires a non-empty title after trimming", () => {
    expect(canSubmitTitle("  ")).toBe(false);
    expect(canSubmitTitle("A useful card")).toBe(true);
  });

  it("renames a column and trims its title", () => {
    const board = boardReducer(initialBoard, { type: "rename-column", columnId: "backlog", title: "  Ideas  " });
    expect(board.columns[0].title).toBe("Ideas");
  });

  it("adds and deletes a card without changing other columns", () => {
    const added = boardReducer(initialBoard, { type: "add-card", columnId: "todo", title: "  Write brief ", details: "  First draft  " });
    expect(added.columns[1].cards.at(-1)).toMatchObject({ title: "Write brief", details: "First draft" });
    const newCardId = added.columns[1].cards.at(-1)?.id ?? "";
    const deleted = boardReducer(added, { type: "delete-card", columnId: "todo", cardId: newCardId });
    expect(deleted.columns[1].cards).toHaveLength(initialBoard.columns[1].cards.length);
  });

  it("reorders cards within one column", () => {
    const board = boardReducer(initialBoard, { type: "move-card", sourceColumnId: "progress", destinationColumnId: "progress", cardId: "card-dashboard", destinationIndex: 1 });
    expect(board.columns[2].cards.map((card) => card.id)).toEqual(["card-onboarding", "card-dashboard"]);
  });

  it("moves a card between columns", () => {
    const board = boardReducer(initialBoard, { type: "move-card", sourceColumnId: "backlog", destinationColumnId: "done", cardId: "card-research", destinationIndex: 1 });
    expect(board.columns[0].cards.map((card) => card.id)).not.toContain("card-research");
    expect(board.columns[4].cards.at(-1)?.id).toBe("card-research");
  });

  it("ignores invalid operations", () => {
    const board = boardReducer(initialBoard, { type: "move-card", sourceColumnId: "missing", destinationColumnId: "done", cardId: "unknown", destinationIndex: 0 });
    expect(board).toEqual(initialBoard);
  });
});