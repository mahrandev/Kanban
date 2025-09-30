// src/components/shared/Board.jsx
import Column from "./Column";

// يستقبل فقط board و setViewingTask
function Board({ board, setViewingTask }) {
  // لا يوجد أي state هنا
  return (
    <section className="flex-1 p-6 flex space-x-6 overflow-x-auto">
      {/* التأكد من وجود board قبل محاولة الوصول لأعمدته */}
      {board?.columns.map((column, index) => (
        <Column
          key={index}
          column={column}
          setViewingTask={setViewingTask} // تمرير الدالة للأسفل
        />
      ))}
    </section>
  );
}
export default Board;
