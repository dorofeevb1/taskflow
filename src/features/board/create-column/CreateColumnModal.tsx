import { useState } from "react";

import { Modal } from "../../../components/modal/Modal";
import { useBoardStore } from "../../../store/boardStore";

import "./CreateColumnModal.scss";

interface CreateColumnModalProps {
  onClose: () => void;
}

const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 40;

export function CreateColumnModal({ onClose }: CreateColumnModalProps) {
  const addColumn = useBoardStore((state) => state.addColumn);
  const columns = useBoardStore((state) => state.columns);

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      (column) =>
        column.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
    );

    if (isDuplicate) {
      setError("A column with this name already exists.");
      return;
    }

    addColumn({
      id: crypto.randomUUID(),
      title: trimmedTitle,
    });

    onClose();
  };

  return (
    <Modal title="Create column" onClose={onClose}>
      <form className="create-column-form" onSubmit={handleSubmit} noValidate>
        <div className="create-column-form__field">
          <input
            id="column-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            placeholder="Column name"
            maxLength={MAX_TITLE_LENGTH}
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "column-title-error" : undefined}
          />

          {error && (
            <span id="column-title-error" className="create-column-form__error">
              {error}
            </span>
          )}
        </div>

        <div className="create-column-form__actions">
          <button
            type="button"
            className="create-column-form__cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-column-form__submit"
            disabled={!title.trim()}
          >
            Create column
          </button>
        </div>
      </form>
    </Modal>
  );
}
