// src/App.jsx

import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import { useState } from "react";
// لاحظ أني غيرت مسار الاستيراد ليتوافق مع هيكل المجلدات
import data from "./data.json";

function App() {
  const [boards, setBoards] = useState(data.boards);
  // سنتعامل مع لوحة واحدة بشكل مؤقت
  const [activeBoard, setActiveBoard] = useState(boards[0]);

  return (
    // سنستخدم اللون الأسود الخاص بالوضع المظلم كخلفية
    <div className="bg-[#20212C] min-h-screen flex">
      <Sidebar
        boards={boards}
        activeBoard={activeBoard}
        setActiveBoard={setActiveBoard}
      />
      <main className="flex-1">
        <Header boardName={activeBoard.name} />
        <Board board={activeBoard} />
      </main>
    </div>
  );
}

export default App;
