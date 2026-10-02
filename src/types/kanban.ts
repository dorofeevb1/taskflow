export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}
