// src/components/shared/Sidebar.jsx

function Sidebar({ boards }) {
    // سنقوم بتحديد لوحة واحدة بشكل ثابت الآن
    const activeBoardName = "Platform Launch";
  
    return (
      <aside className="w-[260px] bg-[#2B2C37] p-6 border-r border-gray-600">
        <h1 className="text-white text-3xl font-bold mb-10">kanban</h1>
        <h2 className="text-gray-400 text-xs font-bold tracking-widest mb-4">
          ALL BOARDS ({boards.length})
        </h2>
        <ul>
          {boards.map((board, index) => (
            <li
              key={index} // استخدم index كمفتاح مؤقت
              className={`text-white font-bold p-3 rounded-r-full cursor-pointer ${
                board.name === activeBoardName
                  ? "bg-[#635FC7]" // اللون عند التفعيل
                  : "hover:bg-white/10" // التأثير عند المرور
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