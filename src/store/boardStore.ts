import { create } from "zustand";

import type { Board, Column, Task } from "../types/kanban";

import { loadBoard, saveBoard } from "../lib/storage";

interface BoardStore extends Board {
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, columnId: string) => void;

  addColumn: (column: Column) => void;
  updateColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
}

const initialBoard: Board = {
  columns: [
    {
      id: "todo",
      title: "To Do",
    },
    {
      id: "in-progress",
      title: "In Progress",
    },
    {
      id: "review",
      title: "Review",
    },
    {
      id: "done",
      title: "Done",
    },
  ],

  tasks: [
    {
      id: "task-1",
      title: "Create project structure",
      description: "Set up the initial React project architecture.",
      priority: "high",
      columnId: "todo",
    },
    {
      id: "task-2",
      title: "Design dashboard",
      description: "Create the initial dashboard layout.",
      priority: "medium",
      columnId: "todo",
    },
    {
      id: "task-3",
      title: "Implement Kanban board",
      description: "Build columns and task cards.",
      priority: "high",
      columnId: "in-progress",
    },
    {
      id: "task-4",
      title: "Initialize project",
      description: "Create the React application with TypeScript.",
      priority: "low",
      columnId: "done",
    },
  ],
};

const savedBoard = loadBoard();

const initialState = savedBoard ?? initialBoard;

export const useBoardStore = create<BoardStore>((set) => ({
  ...initialState,

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  moveTask: (taskId, columnId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              columnId,
            }
          : task,
      ),
    })),

  addColumn: (column) =>
    set((state) => ({
      columns: [...state.columns, column],
    })),

  updateColumn: (updatedColumn) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === updatedColumn.id ? updatedColumn : column,
      ),
    })),

  deleteColumn: (columnId) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== columnId),
    })),
}));

useBoardStore.subscribe((state) => {
  const board: Board = {
    columns: state.columns,
    tasks: state.tasks,
  };

  saveBoard(board);
});
