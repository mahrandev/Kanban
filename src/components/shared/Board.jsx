// src/components/shared/Board.jsx
import Column from "./Column";

function Board({ board }) {
  return (
    // استخدام flex لعرض الأعمدة بجانب بعضها مع padding ومسافة بينها
    <section className="flex-1 p-6 flex space-x-6 overflow-x-auto">
      {board.columns.map((column, index) => (
        <Column key={index} column={column} />
      ))}
    </section>
  );
}
export default Board;