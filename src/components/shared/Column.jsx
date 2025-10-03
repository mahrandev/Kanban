// src/components/shared/Column.jsx
import TaskCard from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

function Column({ column, setViewingTask }) {
  const { setNodeRef } = useDroppable({ id: column.id }); // نستخدم ID العمود كمعرف
  const taskIds = column.tasks.map((task) => task.id);
  const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"];
  const colorIndex = column.id.charCodeAt(0) % colors.length; // طريقة ثابتة لاختيار لون

  return (
    <section ref={setNodeRef} className="w-[280px] shrink-0">
      <div className="mb-6 flex items-center space-x-2">
        <span className={`h-4 w-4 rounded-full ${colors[colorIndex]}`}></span>
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
          {column.name} ({column.tasks.length})
        </h2>
      </div>
      {/* هذا المكون يخبر dnd-kit أن هذه القائمة قابلة للفرز */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <ul className="space-y-4">
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setViewingTask={setViewingTask}
            />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}

export default Column;
