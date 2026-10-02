import { useState } from "react";
import { IconDownload, IconPlus, IconStackPlus } from "@tabler/icons-react";

import { CreateColumnModal } from "../../features/board/create-column/CreateColumnModal";
import { CreateTaskModal } from "../../features/task/CreateTask/CreateTaskModal";
import { Board } from "../../components/kanban/Board/Board";
import { exportBoard } from "../../lib/storage";
import { useBoardStore } from "../../store/boardStore";

import "./BoardPage.scss";

export function BoardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);

  const columns = useBoardStore((state) => state.columns);

  const tasks = useBoardStore((state) => state.tasks);

  const handleExport = () => {
    exportBoard({
      columns,
      tasks,
    });
  };

  return (
    <main className="board-page">
      <div className="board-page__container">
        <header className="board-page__header">
          <div className="board-page__heading">
            <h1 className="board-page__title">Tasks</h1>

            <p className="board-page__description">
              Keep track of what needs to be done.
            </p>
          </div>

          <div className="board-page__actions">
            <button
              type="button"
              className="board-page__export-button"
              onClick={handleExport}
              aria-label="Export board"
              title="Export board"
            >
              <IconDownload size={18} stroke={1.8} />
            </button>

            <button
              type="button"
              className="board-page__add-button"
              onClick={() => setIsCreateModalOpen(true)}
              aria-label="Create task"
              title="Create task"
            >
              <IconPlus size={20} stroke={2} />
            </button>

            <button
              type="button"
              className="board-page__add-button"
              onClick={() => setIsCreateColumnModalOpen(true)}
              aria-label="Create column"
              title="Create column"
            >
              <IconStackPlus size={20} stroke={2} />
            </button>
          </div>
        </header>

        <Board />
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {isCreateColumnModalOpen && (
        <CreateColumnModal onClose={() => setIsCreateColumnModalOpen(false)} />
      )}
    </main>
  );
}
