import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ViewTaskModal({ task, isOpen, onClose, onEditClick, onDeleteClick }) {
  if (!task) return null;

  const completedSubtasks = task.subtasks.filter(
    (sub) => sub.isCompleted
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2B2C37] border-none text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{task.title}</DialogTitle>
          <Button variant="secondary" onClick={onEditClick}>
            Edit Task
          </Button>
          <Button variant="destructive" onClick={onDeleteClick}>
            Delete
          </Button>

          <DialogDescription className="text-gray-400 pt-4">
            {task.description || "No description for this task."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="text-gray-400 font-bold text-sm">
            Subtasks ({completedSubtasks} of {task.subtasks.length})
          </h3>
          <ul className="mt-2 space-y-2 bg-[#20212C] p-4 rounded">
            {task.subtasks.map((subtask, index) => (
              <li
                key={index}
                className="flex items-center bg-[#2B2C37] p-3 rounded"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  readOnly // سنجعلها تفاعلية لاحقاً
                  className="mr-3"
                />
                <span
                  className={`${
                    subtask.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {subtask.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewTaskModal;
