// src/components/shared/Board.jsx
import { useState } from "react";
import Column from "./Column";
import ViewTaskModal from "./ViewTaskModal";

function Board({ board }) {
  const [viewingTask, setViewingTask] = useState(null); // State للمهمة المعروضة

  return (
    <>
      <section className="flex-1 p-6 flex space-x-6 overflow-x-auto">
        {board.columns.map((column, index) => (
          // تمرير دالة setViewingTask إلى الأسفل
          <Column key={index} column={column} setViewingTask={setViewingTask} />
        ))}
      </section>

      {/* عرض الـ Modal عندما يكون viewingTask ليس null */}
      <ViewTaskModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
      />
    </>
  );
}
export default Board;
