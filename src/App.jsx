// src/App.jsx

import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import { useState } from "react";
// لاحظ أني غيرت مسار الاستيراد ليتوافق مع هيكل المجلدات
import data from "./data.json";
import AddTaskModal from "./components/shared/AddTaskModal";

function App() {
  const [boards, setBoards] = useState(data.boards);
  const [activeBoard, setActiveBoard] = useState(boards[0]);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false); // State لإدارة المودال

  const handleAddTask = (newTask) => {
    // العثور على اللوحة والعمود المناسبين
    const boardIndex = boards.findIndex((b) => b.name === activeBoard.name);
    const columnIndex = boards[boardIndex].columns.findIndex(
      (c) => c.name === newTask.status
    );

    // إنشاء نسخة جديدة من الحالة لتجنب التعديل المباشر (immutability)
    const newBoards = JSON.parse(JSON.stringify(boards));
    newBoards[boardIndex].columns[columnIndex].tasks.push(newTask);

    setBoards(newBoards);
    // تحديث اللوحة النشطة لتعكس التغيير
    setActiveBoard(newBoards[boardIndex]);
  };

  return (
    <div className="bg-[#20212C] min-h-screen flex">
      <Sidebar
        boards={boards}
        activeBoard={activeBoard}
        setActiveBoard={setActiveBoard}
      />
      <main className="flex-1">
        {/* تمرير دالة لفتح المودال */}
        <Header
          boardName={activeBoard.name}
          onAddTaskClick={() => setAddTaskModalOpen(true)}
        />
        <Board board={activeBoard} />
      </main>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        columns={activeBoard.columns}
        onAddTask={handleAddTask}
      />
    </div>
  );
}

export default App;
