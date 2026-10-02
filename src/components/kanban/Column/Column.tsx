import { useState } from "react";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useDroppable } from "@dnd-kit/react";

import { useBoardStore } from "../../../store/boardStore";
import type { Column as ColumnType, Task } from "../../../types/kanban";
import { TaskCard } from "../TaskCard/TaskCard";

import "./Column.scss";
import { Modal } from "../../modal/Modal";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 40;

export function Column({ column, tasks }: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
  });

  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const columns = useBoardStore((state) => state.columns);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [error, setError] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleStartEditing = () => {
    setTitle(column.title);
    setError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setTitle(column.title);
    setError("");
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      setError(
        `Column name must contain at least ${MIN_TITLE_LENGTH} characters.`,
      );
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setError(`Column name must not exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    const isDuplicate = columns.some(
      (item) =>
        item.id !== column.id &&
        item.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
    );

    if (isDuplicate) {
      setError("A column with this name already exists.");
      return;
    }

    updateColumn({
      ...column,
      title: trimmedTitle,
    });

    setError("");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (tasks.length > 0) {
      return;
    }

    deleteColumn(column.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <section
        ref={ref}
        className={`column ${isDropTarget ? "column--drop-target" : ""}`}
      >
        <header className="column__header">
          {isEditing ? (
            <div className="column__edit">
              <input
                className={`column__edit-input ${
                  error ? "column__edit-input--error" : ""
                }`}
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSave();
                  }

                  if (event.key === "Escape") {
                    handleCancelEditing();
                  }
                }}
                maxLength={MAX_TITLE_LENGTH}
                autoFocus
                aria-label="Column name"
                aria-invalid={Boolean(error)}
              />

              <div className="column__edit-actions">
                <button
                  type="button"
                  className="column__edit-button column__edit-button--save"
                  onClick={handleSave}
                  aria-label="Save column name"
                  title="Save"
                >
                  <IconCheck size={16} stroke={2} />
                </button>

                <button
                  type="button"
                  className="column__edit-button column__edit-button--cancel"
                  onClick={handleCancelEditing}
                  aria-label="Cancel editing"
                  title="Cancel"
                >
                  <IconX size={16} stroke={2} />
                </button>
              </div>

              {error && <span className="column__edit-error">{error}</span>}
            </div>
          ) : (
            <>
              <div className="column__heading">
                <h2 className="column__title">{column.title}</h2>

                <span className="column__count">{tasks.length}</span>
              </div>

              <div className="column__actions">
                <button
                  type="button"
                  className="column__action"
                  onClick={handleStartEditing}
                  aria-label={`Edit column "${column.title}"`}
                  title="Edit column"
                >
                  <IconEdit size={16} stroke={1.8} />
                </button>

                <button
                  type="button"
                  className={`column__action ${
                    tasks.length > 0
                      ? "column__action--disabled"
                      : "column__action--delete"
                  }`}
                  onClick={() => {
                    if (tasks.length === 0) {
                      setIsDeleteConfirmOpen(true);
                    }
                  }}
                  disabled={tasks.length > 0}
                  aria-label={`Delete column "${column.title}"`}
                  title={
                    tasks.length > 0
                      ? "Move all tasks before deleting"
                      : "Delete column"
                  }
                >
                  <IconTrash size={16} stroke={1.8} />
                </button>
              </div>
            </>
          )}
        </header>

        <div className="column__tasks">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="column__empty">No tasks</div>
          )}
        </div>
      </section>

      {isDeleteConfirmOpen && (
        <Modal
          title="Delete column"
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <div className="column__delete-confirm">
            <p className="column__delete-text">
              Are you sure you want to delete "{column.title}"?
            </p>

            <div className="column__delete-actions">
              <button
                type="button"
                className="column__delete-cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="column__delete-confirm-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
