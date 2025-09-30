// src/components/shared/Column.jsx
import TaskCard from "./TaskCard";

function Column({ column, setViewingTask }) {
  // ألوان مختلفة لدائرة العنوان بناءً على اسم العمود (يمكن تخصيصها)
  const colors = ["bg-red-400", "bg-blue-400", "bg-green-400"];
  const colorIndex = column.name.length % colors.length; // طريقة بسيطة لاختيار لون

  return (
    // تحديد عرض ثابت للعمود
    <section className="w-[280px] shrink-0">
      <div className="flex items-center space-x-2 mb-6">
        <span className={`w-4 h-4 rounded-full ${colors[colorIndex]}`}></span>
        <h2 className="text-gray-400 font-bold tracking-widest uppercase text-sm">
          {column.name} ({column.tasks.length})
        </h2>
      </div>
      <ul className="space-y-4">
        {column.tasks.map((task, index) => (
          <TaskCard key={index} task={task} setViewingTask={setViewingTask} />
        ))}
      </ul>
    </section>
  );
}
export default Column;
