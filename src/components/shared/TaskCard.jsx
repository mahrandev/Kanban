// src/components/shared/TaskCard.jsx

function TaskCard({ task }) {
  const completedSubtasks = task.subtasks.filter(
    (sub) => sub.isCompleted
  ).length;

  return (
    <li className="bg-[#2B2C37] p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow">
      <h3 className="text-white font-bold mb-2">{task.title}</h3>
      <p className="text-gray-400 text-xs font-bold">
        {completedSubtasks} of {task.subtasks.length} subtasks
      </p>
    </li>
  );
}
export default TaskCard;
