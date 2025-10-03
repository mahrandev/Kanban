// src/components/shared/TaskCard.jsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, setViewingTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedSubtasks = task.subtasks.filter(
    (sub) => sub.is_completed,
  ).length;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => setViewingTask(task)}
      className="cursor-pointer rounded-lg bg-[#2B2C37] p-4 shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="mb-2 font-bold text-white">{task.title}</h3>
          <p className="text-xs font-bold text-gray-400">
            {completedSubtasks} of {task.subtasks.length} subtasks
          </p>
        </div>
        <div
          {...listeners}
          className="cursor-grab rounded p-1 hover:bg-white/10 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
            <circle cx="19" cy="5" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="19" cy="19" r="1" />
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="5" cy="19" r="1" />
          </svg>
        </div>
      </div>
    </li>
  );
}

export default TaskCard;
