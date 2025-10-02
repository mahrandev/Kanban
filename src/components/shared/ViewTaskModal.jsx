// src/components/shared/ViewTaskModal.jsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react"; // أيقونة الثلاث نقاط

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
        {/* ✨ قمنا بإعادة هذا الجزء بالكامل مع تحسينات */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold">{task.title}</DialogTitle>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="cursor-pointer text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none bg-[#20212C] text-white">
              <DropdownMenuItem
                onClick={onEditClick}
                className="cursor-pointer"
              >
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDeleteClick}
                className="cursor-pointer text-red-500"
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>

        <DialogDescription className="pt-2 text-gray-400">
          {task.description || "No description for this task."}
        </DialogDescription>

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
                  onChange={(e) =>
                    onSubtaskToggle(subtask.id, e.target.checked)
                  }
                  className="mr-3 h-4 w-4 rounded bg-slate-500"
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
