import { DragDropProvider } from "@dnd-kit/react";

import { useBoardStore } from "../../../store/boardStore";
import { Column as KanbanColumn } from "../Column/Column";

import "./Board.scss";

export function Board() {
  const columns = useBoardStore((state) => state.columns);

  const tasks = useBoardStore((state) => state.tasks);

  const moveTask = useBoardStore((state) => state.moveTask);

  const handleDragEnd = (event: {
    canceled: boolean;
    operation: {
      source: {
        id: string | number;
      } | null;

      target: {
        id: string | number;
      } | null;
    };
  }) => {
    if (event.canceled) {
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target) {
      return;
    }

    const taskId = String(source.id);
    const columnId = String(target.id);

    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    const columnExists = columns.some((column) => column.id === columnId);

    if (!columnExists) {
      return;
    }

    if (task.columnId === columnId) {
      return;
    }

    moveTask(taskId, columnId);
  };

  return (
    <div className="board">
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="board__columns">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.columnId === column.id,
            );

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
              />
            );
          })}
        </div>
      </DragDropProvider>
    </div>
  );
}
