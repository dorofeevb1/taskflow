import type { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";

import "./Modal.scss";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className="modal__content"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>

          <button
            type="button"
            className="modal__close"
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
