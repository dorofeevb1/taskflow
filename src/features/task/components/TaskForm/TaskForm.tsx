import { useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent } from "react";

import type { Column, TaskPriority } from "../../../../types/kanban";

import "./TaskForm.scss";

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  columnId: string;
}

interface TaskFormProps {
  initialValues: TaskFormValues;
  submitLabel: string;
  columns: Column[];
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  columnId?: string;
}

const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

const priorityOptions: {
  value: TaskPriority;
  label: string;
}[] = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

function AnimatedLabel({ text }: { text: string }) {
  return (
    <label>
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={
            {
              "--letter-delay": `${index * 0.05}s`,
            } as CSSProperties
          }
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </label>
  );
}

export function TaskForm({
  initialValues,
  submitLabel,
  columns,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    const trimmedTitle = values.title.trim();
    const trimmedDescription = values.description.trim();

    if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      nextErrors.title = `Title must contain at least ${MIN_TITLE_LENGTH} characters.`;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      nextErrors.title = `Title must not exceed ${MAX_TITLE_LENGTH} characters.`;
    }

    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      nextErrors.description = `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    if (!values.columnId) {
      nextErrors.columnId = "Please select a column.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({
      ...current,
      title: event.target.value,
    }));

    setErrors((current) => ({
      ...current,
      title: undefined,
    }));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues((current) => ({
      ...current,
      description: event.target.value,
    }));

    setErrors((current) => ({
      ...current,
      description: undefined,
    }));
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({
      ...current,
      priority: event.target.value as TaskPriority,
    }));
  };

  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({
      ...current,
      columnId: event.target.value,
    }));

    setErrors((current) => ({
      ...current,
      columnId: undefined,
    }));
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div
        className={`task-form__field ${
          errors.title ? "task-form__field--error" : ""
        }`}
      >
        <input
          id="task-title"
          type="text"
          value={values.title}
          onChange={handleTitleChange}
          maxLength={MAX_TITLE_LENGTH}
          required
          autoFocus
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />

        <AnimatedLabel text="Title" />

        {errors.title && (
          <span id="task-title-error" className="task-form__error">
            {errors.title}
          </span>
        )}
      </div>

      <div
        className={`task-form__field ${
          errors.description ? "task-form__field--error" : ""
        }`}
      >
        <textarea
          id="task-description"
          value={values.description}
          onChange={handleDescriptionChange}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder=" "
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "task-description-error" : undefined
          }
        />

        <AnimatedLabel text="Description" />

        <span className="task-form__description-counter">
          {values.description.length}/{MAX_DESCRIPTION_LENGTH}
        </span>

        {errors.description && (
          <span id="task-description-error" className="task-form__error">
            {errors.description}
          </span>
        )}
      </div>

      <div
        className={`task-form__field ${
          values.priority ? "task-form__field--filled" : ""
        }`}
      >
        <select
          id="task-priority"
          value={values.priority}
          onChange={handlePriorityChange}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <AnimatedLabel text="Priority" />
      </div>

      <div
        className={`task-form__field ${
          errors.columnId ? "task-form__field--error" : ""
        } ${values.columnId ? "task-form__field--filled" : ""}`}
      >
        <select
          id="task-column"
          value={values.columnId}
          onChange={handleColumnChange}
          aria-invalid={Boolean(errors.columnId)}
          aria-describedby={errors.columnId ? "task-column-error" : undefined}
        >
          <option value="" disabled>
            Select column
          </option>

          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.title}
            </option>
          ))}
        </select>

        <AnimatedLabel text="Column" />

        {errors.columnId && (
          <span id="task-column-error" className="task-form__error">
            {errors.columnId}
          </span>
        )}
      </div>

      <div className="task-form__actions">
        <button type="button" className="task-form__cancel" onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          className="task-form__submit"
          disabled={!values.title.trim()}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
