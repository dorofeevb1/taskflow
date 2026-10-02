import { TaskForm } from "../components/TaskForm/TaskForm";
import type { TaskFormValues } from "../components/TaskForm/TaskForm";
import { TaskModal } from "../components/TaskModal/TaskModal";
import { useBoardStore } from "../../../store/boardStore";
import type { Task } from "../../../types/kanban";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const updateTask = useBoardStore((state) => state.updateTask);

  const columns = useBoardStore((state) => state.columns);

  const initialValues: TaskFormValues = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    columnId: task.columnId,
  };

  const handleSubmit = (values: TaskFormValues) => {
    updateTask({
      ...task,
      ...values,
    });

    onClose();
  };

  return (
    <TaskModal title="Edit task" onClose={onClose}>
      <TaskForm
        initialValues={initialValues}
        submitLabel="Save changes"
        columns={columns}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </TaskModal>
  );
}
