import { useState } from "react";
import { useDraggable } from "@dnd-kit/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useBoardStore } from "../../../store/boardStore";
import type { Task } from "../../../types/kanban";
import { EditTaskModal } from "../../../features/task/EditTask/EditTaskModal";

import "./TaskCard.scss";
import { Modal } from "../../modal/Modal";

interface TaskCardProps {
  task: Task;
}

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export function TaskCard({ task }: TaskCardProps) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { ref, isDragging } = useDraggable({
    id: task.id,
  });

  const handleDelete = () => {
    deleteTask(task.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <article
        ref={ref}
        className={`task-card ${isDragging ? "task-card--dragging" : ""}`}
      >
        <div className="task-card__header">
          <h3 className="task-card__title">{task.title}</h3>

          <span
            className={`task-card__priority task-card__priority--${task.priority}`}
          >
            {priorityLabels[task.priority]}
          </span>
        </div>

        <p className="task-card__description">{task.description}</p>

        <div className="task-card__actions">
          <button
            type="button"
            className="task-card__action task-card__action--edit"
            onClick={() => setIsEditOpen(true)}
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <IconEdit size={16} stroke={1.8} />
          </button>

          <button
            type="button"
            className="task-card__action task-card__action--delete"
            onClick={() => setIsDeleteConfirmOpen(true)}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <IconTrash size={16} stroke={1.8} />
          </button>
        </div>
      </article>

      {isEditOpen && (
        <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />
      )}

      {isDeleteConfirmOpen && (
        <Modal
          title="Delete task"
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <div className="task-card__delete-confirm">
            <p className="task-card__delete-text">
              Are you sure you want to delete "{task.title}"?
            </p>

            <div className="task-card__delete-actions">
              <button
                type="button"
                className="task-card__delete-cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="task-card__delete-confirm-button"
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
