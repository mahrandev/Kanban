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
    isDragging, // خاصية لمعرفة ما إذا كان العنصر يُسحب حالياً
  } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // اجعل العنصر الأصلي شبه شفاف أثناء السحب لتحسين التجربة
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
      {...listeners}
      // ✨ هذا هو مفتاح الحل: لا تقم بتشغيل onClick إذا كان المستخدم يسحب
      onClick={() => !isDragging && setViewingTask(task)}
      className="cursor-grab touch-none rounded-lg bg-[#2B2C37] p-4 shadow-md active:cursor-grabbing"
    >
      <h3 className="mb-2 font-bold text-white">{task.title}</h3>
      <p className="text-xs font-bold text-gray-400">
        {completedSubtasks} of {task.subtasks.length} subtasks
      </p>
    </li>
  );
}

export default TaskCard;
