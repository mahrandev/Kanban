// src/components/shared/Board.jsx
import { useState } from "react";
import Column from "./Column";
import ViewTaskModal from "./ViewTaskModal";

function Board({ board, setEditingTask }) {
  const [viewingTask, setViewingTask] = useState(null); // State للمهمة المعروضة

  return (
    <>
      <section className="flex-1 p-6 flex space-x-6 overflow-x-auto">
        {board.columns.map((column, index) => (
          // تمرير دالة setViewingTask إلى الأسفل
          <Column key={index} column={column} setViewingTask={setViewingTask} />
        ))}
      </section>

      <ViewTaskModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        onEditClick={() => {
          setEditingTask(viewingTask); // قم بتعيين المهمة للتعديل
          setViewingTask(null); // أغلق مودال العرض
        }}
      />
    </>
  );
}
export default Board;
