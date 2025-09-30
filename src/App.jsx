// src/App.jsx

import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import { useState } from "react";
// لاحظ أني غيرت مسار الاستيراد ليتوافق مع هيكل المجلدات
import data from "./data.json";
import AddTaskModal from "./components/shared/AddTaskModal";
import EditTaskModal from "./components/shared/EditTaskModal";

function App() {
  const [boards, setBoards] = useState(data.boards);
  const [activeBoard, setActiveBoard] = useState(boards[0]);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false); // State لإدارة المودال
  const [editingTask, setEditingTask] = useState(null);

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
  const handleEditTask = (updatedTask) => {
    const newBoards = JSON.parse(JSON.stringify(boards));
    const activeBoardRef = newBoards.find((b) => b.name === activeBoard.name);

    let originalColumn = null;
    let taskIndex = -1;

    // الخطوة 1: ابحث عن المهمة ومكانها الأصلي
    for (const col of activeBoardRef.columns) {
      const index = col.tasks.findIndex((t) => t.title === editingTask.title); // استخدم `editingTask` لتجد المهمة الأصلية
      if (index !== -1) {
        originalColumn = col;
        taskIndex = index;
        break;
      }
    }

    // إذا لم يتم العثور على المهمة، لا تفعل شيئاً (حالة أمان)
    if (!originalColumn) return;

    const originalStatus = originalColumn.name;

    // الخطوة 2: تحقق إذا تغيرت الحالة (Status)
    if (originalStatus === updatedTask.status) {
      // إذا لم تتغير الحالة، فقط قم بتحديث المهمة في مكانها
      originalColumn.tasks[taskIndex] = updatedTask;
    } else {
      // إذا تغيرت الحالة، انقل المهمة
      // احذفها من العمود القديم
      originalColumn.tasks.splice(taskIndex, 1);

      // أضفها إلى العمود الجديد
      const newColumn = activeBoardRef.columns.find(
        (c) => c.name === updatedTask.status
      );
      if (newColumn) {
        newColumn.tasks.push(updatedTask);
      }
    }

    // الخطوة 3: قم بتحديث الحالة ليعاد رسم الواجهة
    setBoards(newBoards);
    setActiveBoard(newBoards.find((b) => b.name === activeBoard.name));
  };

  const taskToEdit = (() => {
    if (!editingTask) return null;
    for (const board of boards) {
      for (const column of board.columns) {
        const task = column.tasks.find((t) => t.title === editingTask.title);
        if (task) return task;
      }
    }
    return null;
  })();

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
        <Board board={activeBoard} setEditingTask={setEditingTask} />
      </main>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        columns={activeBoard.columns}
        onAddTask={handleAddTask}
      />
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        columns={activeBoard.columns}
        taskToEdit={taskToEdit}
        onEditTask={handleEditTask}
      />
    </div>
  );
}

export default App;
