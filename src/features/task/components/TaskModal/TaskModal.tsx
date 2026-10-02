import type { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";
import "./TaskModal.scss";

interface TaskModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function TaskModal({ title, children, onClose }: TaskModalProps) {
  return (
    <div className="task-modal" onMouseDown={onClose}>
      <div
        className="task-modal__content"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="task-modal__header">
          <h2 className="task-modal__title">{title}</h2>

          <button
            type="button"
            className="task-modal__close"
            onClick={onClose}
            aria-label="Close modal"
            title="Close"
          >
            <IconX size={18} stroke={1.8} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}
