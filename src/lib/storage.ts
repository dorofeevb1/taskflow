import type { Board } from "../types/kanban";

const STORAGE_KEY = "taskflow-board";

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function loadBoard(): Board | null {
  try {
    const storedBoard = localStorage.getItem(STORAGE_KEY);

    if (!storedBoard) {
      return null;
    }

    const parsedBoard: unknown = JSON.parse(storedBoard);

    if (!parsedBoard || typeof parsedBoard !== "object") {
      return null;
    }

    const board = parsedBoard as Partial<Board>;

    if (!Array.isArray(board.columns) || !Array.isArray(board.tasks)) {
      return null;
    }

    return {
      columns: board.columns,
      tasks: board.tasks,
    };
  } catch {
    return null;
  }
}

export function saveBoard(board: Board): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    if (isQuotaExceededError(error)) {
      exportAndClearBoard(board);
      return;
    }

    throw new StorageError("Unable to save board to localStorage.");
  }
}

export function clearBoard(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportBoard(board: Board): void {
  const json = JSON.stringify(board, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "taskflow-board.json";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}

export function exportAndClearBoard(board: Board): void {
  exportBoard(board);
  clearBoard();
}

function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}
