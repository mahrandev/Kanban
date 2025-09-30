// src/components/shared/Sidebar.jsx

// نستقبل الـ props الجديدة
function Sidebar({ boards, activeBoard, setActiveBoard }) {
  return (
    <aside className="w-[260px] bg-[#2B2C37] p-6 border-r border-gray-600">
      <h1 className="text-white text-3xl font-bold mb-10">kanban</h1>
      <h2 className="text-gray-400 text-xs font-bold tracking-widest mb-4">
        ALL BOARDS ({boards.length})
      </h2>
      <ul>
        {boards.map((board) => (
          <li
            key={board.name} // استخدام الاسم كمفتاح فريد مؤقتاً
            // إضافة دالة onClick لتغيير اللوحة النشطة
            onClick={() => setActiveBoard(board)}
            className={`text-white font-bold p-3 rounded-r-full cursor-pointer ${
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
    </aside>
  );
}

export default Sidebar;
