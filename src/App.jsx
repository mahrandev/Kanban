// src/App.jsx

import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import AddTaskModal from "./components/shared/AddTaskModal";
import ViewTaskModal from "./components/shared/ViewTaskModal";
import EditTaskModal from "./components/shared/EditTaskModal";
import DeleteModal from "./components/shared/DeleteModal";

// ===================================================================
// 1. المكون الرئيسي: مسؤول فقط عن المصادقة (Authentication)
// ===================================================================
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب الجلسة عند تحميل التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // انتهاء التحميل بعد جلب الجلسة
    });

    // الاستماع لأي تغيير في حالة المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // لا تعرض شيئاً حتى نتأكد من حالة تسجيل الدخول
  if (loading) {
    return null;
  }

  // عرض الواجهة بناءً على حالة الجلسة
  if (!session) {
    return <Auth />;
  } else {
    // `key` هنا مهمة جداً لضمان إعادة تحميل التطبيق عند تغيير المستخدم
    return <KanbanApp key={session.user.id} />;
  }
}

// ===================================================================
// 2. مكون التطبيق: مسؤول فقط عن منطق Kanban
// ===================================================================
function KanbanApp() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(true);

  // States الخاصة بالنوافذ المنبثقة
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // useEffect لجلب البيانات من Supabase عند تحميل المكون
  useEffect(() => {
    const fetchBoards = async () => {
      setLoadingBoards(true);
      // استعلام لجلب كل البيانات المترابطة للمستخدم الحالي
      const { data: boardsData, error } = await supabase
        .from("boards")
        .select("*, columns(*, tasks(*, subtasks(*)))");

      if (error) {
        console.error("Error fetching boards:", error);
      } else {
        setBoards(boardsData);
        if (boardsData && boardsData.length > 0) {
          setActiveBoard(boardsData[0]);
        }
      }
      setLoadingBoards(false);
    };

    fetchBoards();
  }, []); // [] تعني أن هذا سيعمل مرة واحدة فقط

  // دوال وهمية مؤقتة (Placeholders) - سنقوم بتحديثها في الخطوات القادمة
  const handleAddTask = (newTask) => console.log("Adding task:", newTask);
  const handleEditTask = (updatedTask) =>
    console.log("Editing task:", updatedTask);
  const handleDeleteTask = () => console.log("Deleting task...");

  // عرض رسالة تحميل بينما يتم جلب بيانات الألواح
  if (loadingBoards) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#20212C] text-2xl text-white">
        Loading Your Boards...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#20212C]">
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
        taskToEdit={editingTask}
        onEditTask={handleEditTask}
      />
      <DeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete this task?"
        description={`Are you sure you want to delete the ‘${taskToDelete?.title}’ task? This action cannot be reversed.`}
      />
    </div>
  );
}

export default App;
