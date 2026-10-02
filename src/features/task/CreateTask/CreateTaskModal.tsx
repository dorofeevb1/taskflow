import { TaskForm } from "../components/TaskForm/TaskForm";
import type { TaskFormValues } from "../components/TaskForm/TaskForm";

import { Modal } from "../../../components/modal/Modal";
import { useBoardStore } from "../../../store/boardStore";

interface CreateTaskModalProps {
  onClose: () => void;
}

export function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const addTask = useBoardStore((state) => state.addTask);

  const columns = useBoardStore((state) => state.columns);

  const initialValues: TaskFormValues = {
    title: "",
    description: "",
    priority: "medium",
    columnId: columns[0]?.id ?? "",
  };

  const handleSubmit = (values: TaskFormValues) => {
    addTask({
      id: crypto.randomUUID(),
      ...values,
    });

    onClose();
  };

  return (
    <Modal title="Create task" onClose={onClose}>
      <TaskForm
        initialValues={initialValues}
        submitLabel="Create task"
        columns={columns}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
