// src/App.jsx

import { useState, useEffect } from "react"; // ◀️ 1. تأكد من استيراد useEffect
import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import data from "./data.json";
import AddTaskModal from "./components/shared/AddTaskModal";
import EditTaskModal from "./components/shared/EditTaskModal";
import DeleteModal from "./components/shared/DeleteModal";

function App() {
  // 🔽 2. تعديل useState لقراءة البيانات عند البدء 🔽
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem("kanbanBoards");
    return savedBoards ? JSON.parse(savedBoards) : data.boards;
  });

  const [activeBoard, setActiveBoard] = useState(boards[0]);

  // ... (كل الـ states الأخرى: isAddTaskModalOpen, viewingTask, etc.)
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // ◀️ 3. إضافة useEffect لحفظ البيانات عند أي تغيير في boards
  useEffect(() => {
    localStorage.setItem("kanbanBoards", JSON.stringify(boards));
    // تحديث اللوحة النشطة في حال تغيرت البيانات
    const currentActive =
      boards.find((b) => b.name === activeBoard?.name) || boards[0];
    setActiveBoard(currentActive);
  }, [boards]);

  // ... (كل دوال الـ handlers: handleAddTask, handleEditTask, handleDeleteTask)
  // لا يوجد أي تغيير في هذه الدوال
  const handleAddTask = (newTask) => {
    const boardIndex = boards.findIndex((b) => b.name === activeBoard.name);
    const columnIndex = boards[boardIndex].columns.findIndex(
      (c) => c.name === newTask.status
    );
    const newBoards = JSON.parse(JSON.stringify(boards));
    newBoards[boardIndex].columns[columnIndex].tasks.push(newTask);
    setBoards(newBoards);
  };

  const handleEditTask = (updatedTask) => {
    const newBoards = JSON.parse(JSON.stringify(boards));
    const activeBoardRef = newBoards.find((b) => b.name === activeBoard.name);
    let originalColumn = null;
    let taskIndex = -1;
    for (const col of activeBoardRef.columns) {
      const index = col.tasks.findIndex((t) => t.title === editingTask.title);
      if (index !== -1) {
        originalColumn = col;
        taskIndex = index;
        break;
      }
    }
    if (!originalColumn) return;
    const originalStatus = originalColumn.name;
    if (originalStatus === updatedTask.status) {
      originalColumn.tasks[taskIndex] = updatedTask;
    } else {
      originalColumn.tasks.splice(taskIndex, 1);
      const newColumn = activeBoardRef.columns.find(
        (c) => c.name === updatedTask.status
      );
      if (newColumn) {
        newColumn.tasks.push(updatedTask);
      }
    }
    setBoards(newBoards);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    const newBoards = JSON.parse(JSON.stringify(boards));
    const activeBoardRef = newBoards.find((b) => b.name === activeBoard.name);
    for (const column of activeBoardRef.columns) {
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
        <Header
          boardName={activeBoard?.name}
          onAddTaskClick={() => setAddTaskModalOpen(true)}
        />
        <Board
          board={activeBoard}
          setViewingTask={setViewingTask}
          setEditingTask={setEditingTask}
          onDeleteTaskClick={(task) => setTaskToDelete(task)}
        />
      </main>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        columns={activeBoard?.columns || []}
        onAddTask={handleAddTask}
      />
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        columns={activeBoard?.columns || []}
        taskToEdit={taskToEdit}
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
