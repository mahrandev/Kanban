// src/components/shared/Header.jsx
import { supabase } from "../../lib/supabaseClient"; // استيراد supabase

// استقبل الدالة الجديدة onAddTaskClick
function Header({ boardName, onAddTaskClick }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="flex items-center justify-between border-b border-gray-600 bg-[#2B2C37] p-4">
      <h1 className="text-2xl font-bold text-white">{boardName}</h1>
      {/* استدعي الدالة عند الضغط */}
      <button
        onClick={onAddTaskClick}
        className="rounded-full bg-[#635FC7] px-4 py-2 font-bold text-white hover:bg-[#A8A4FF]"
      >
        + Add New Task
      </button>
      <button
        onClick={handleSignOut}
        className="rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Sign Out
      </button>
    </header>
  );
}
export default Header;
