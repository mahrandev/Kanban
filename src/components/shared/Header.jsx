// src/components/shared/Header.jsx

// استقبل الدالة الجديدة onAddTaskClick
function Header({ boardName, onAddTaskClick }) {
  return (
    <header className="bg-[#2B2C37] p-4 border-b border-gray-600 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">{boardName}</h1>
      {/* استدعي الدالة عند الضغط */}
      <button
        onClick={onAddTaskClick}
        className="bg-[#635FC7] text-white font-bold py-2 px-4 rounded-full hover:bg-[#A8A4FF]"
      >
        + Add New Task
      </button>
    </header>
  );
}
export default Header;
