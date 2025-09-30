// src/App.jsx

import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import data from "./data.json";
import AddTaskModal from "./components/shared/AddTaskModal";
import ViewTaskModal from "./components/shared/ViewTaskModal";
import EditTaskModal from "./components/shared/EditTaskModal";
import DeleteModal from "./components/shared/DeleteModal";

function App() {
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem("kanbanBoards");
    try {
      const parsedBoards = JSON.parse(savedBoards);
      return Array.isArray(parsedBoards) && parsedBoards.length > 0
        ? parsedBoards
        : data.boards;
    } catch (e) {
      return data.boards;
    }
  });

  const [activeBoard, setActiveBoard] = useState(boards[0]);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null); // هذا هو مصدر الحقيقة للتعديل
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanbanBoards", JSON.stringify(boards));
    const currentActive =
      boards.find((b) => b.name === activeBoard?.name) || boards[0];
    setActiveBoard(currentActive);
  }, [boards, activeBoard?.name]);

  const handleAddTask = (newTask) => {
    const newBoards = JSON.parse(JSON.stringify(boards));
    const board = newBoards.find((b) => b.name === activeBoard.name);
    const column = board.columns.find((c) => c.name === newTask.status);
    column.tasks.push(newTask);
    setBoards(newBoards);
  };

  const handleEditTask = (updatedTask) => {
    const newBoards = JSON.parse(JSON.stringify(boards));
    const board = newBoards.find((b) => b.name === activeBoard.name);

    // حذف المهمة من مكانها القديم
    let oldColumn = null;
    for (const col of board.columns) {
      const taskIndex = col.tasks.findIndex(
        (t) => t.title === editingTask.title
      ); // استخدم `editingTask` للبحث عن النسخة الأصلية
      if (taskIndex !== -1) {
        oldColumn = col;
        oldColumn.tasks.splice(taskIndex, 1);
        break;
      }
    }

    // إضافة المهمة المحدثة إلى مكانها الجديد
    const newColumn = board.columns.find((c) => c.name === updatedTask.status);
    if (newColumn) {
      newColumn.tasks.push(updatedTask);
    }

    setBoards(newBoards);
    setEditingTask(null); // أغلق المودال بعد الحفظ
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    const newBoards = JSON.parse(JSON.stringify(boards));
    const board = newBoards.find((b) => b.name === activeBoard.name);
    for (const column of board.columns) {
      const taskIndex = column.tasks.findIndex(
        (t) => t.title === taskToDelete.title
      );
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        break;
      }
    }
    setBoards(newBoards);
    setTaskToDelete(null);
  };

  return (
    <div className="bg-[#20212C] min-h-screen flex">
      <Sidebar
        boards={boards}
        activeBoard={activeBoard}
        setActiveBoard={setActiveBoard}
      />
      <main className="flex-1">
        <Header
          boardName={activeBoard?.name}
          onAddTaskClick={() => setAddTaskModalOpen(true)}
        />
        <Board board={activeBoard} setViewingTask={setViewingTask} />
      </main>

      {/* === Modals Section === */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        columns={activeBoard?.columns || []}
        onAddTask={handleAddTask}
      />
      <ViewTaskModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        onEditClick={() => {
          setEditingTask(viewingTask);
          setViewingTask(null);
        }}
        onDeleteClick={() => {
          setTaskToDelete(viewingTask);
          setViewingTask(null);
        }}
      />
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        columns={activeBoard?.columns || []}
        taskToEdit={editingTask} // ✅ نستخدم الحالة مباشرة
        onEditTask={handleEditTask}
      />
      <DeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete this task?"
        description={`Are you sure you want to delete the ‘${taskToDelete?.title}’ task and its subtasks? This action cannot be reversed.`}
      />
    </div>
  );
}

export default App;
