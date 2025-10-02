import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ViewTaskModal({
  task,
  isOpen,
  onClose,
  onEditClick,
  onDeleteClick,
  onSubtaskToggle,
}) {
  if (!task) return null;

  const completedSubtasks = task.subtasks.filter(
    (sub) => sub.is_completed,
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-[#2B2C37] text-white">
        {/* ... (DialogHeader) ... */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-gray-400">
            Subtasks ({completedSubtasks} of {task.subtasks.length})
          </h3>
          <ul className="mt-2 space-y-2 rounded bg-[#20212C] p-4">
            {task.subtasks.map((subtask) => (
              <li
                key={subtask.id}
                className="flex items-center rounded bg-[#2B2C37] p-3"
              >
                <input
                  type="checkbox"
                  checked={subtask.is_completed}
                  // ✨ تفعيل الـ checkbox
                  onChange={(e) =>
                    onSubtaskToggle(subtask.id, e.target.checked)
                  }
                  className="mr-3 h-4 w-4"
                />
                <span
                  className={`${subtask.is_completed ? "text-gray-500 line-through" : ""}`}
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
