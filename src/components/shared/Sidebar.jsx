// src/components/shared/Sidebar.jsx

// نستقبل الـ props الجديدة
function Sidebar({ boards, activeBoard, setActiveBoard, onAddBoardClick }) {
  return (
    <aside className="w-[260px] border-r border-gray-600 bg-[#2B2C37] p-6">
      <h1 className="mb-10 text-3xl font-bold text-white">kanban</h1>
      <h2 className="mb-4 text-xs font-bold tracking-widest text-gray-400">
        ALL BOARDS ({boards.length})
      </h2>
      <ul>
        {boards.map((board) => (
          <li
            key={board.name} // استخدام الاسم كمفتاح فريد مؤقتاً
            // إضافة دالة onClick لتغيير اللوحة النشطة
            onClick={() => setActiveBoard(board)}
            className={`cursor-pointer rounded-r-full p-3 font-bold text-white ${
              // مقارنة الكائن مباشرة لتحديد العنصر النشط
              activeBoard.name === board.name
                ? "bg-[#635FC7]"
                : "hover:bg-white/10"
            }`}
          >
            {board.name}
          </li>
        ))}
      </ul>
      <button
        onClick={onAddBoardClick}
        className="cursor-pointer rounded-r-full p-3 font-bold text-[#635FC7] hover:bg-white/10"
      >
        + Create New Board
      </button>
    </aside>
  );
}

export default Sidebar;
