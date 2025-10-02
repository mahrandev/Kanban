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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Auth />;
  } else {
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
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchBoards = async () => {
    // لا نعرض شاشة التحميل عند كل إعادة جلب، فقط في المرة الأولى
    if (boards.length === 0) setLoadingBoards(true);

    const { data: boardsData, error } = await supabase
      .from("boards")
      .select("*, columns(*, tasks(*, subtasks(*)))");

    if (error) {
      console.error("Error fetching boards:", error);
    } else {
      setBoards(boardsData);
      // تحديث اللوحة النشطة والمودال المفتوح بالبيانات الجديدة
      if (boardsData && boardsData.length > 0) {
        setActiveBoard(
          (currentActive) =>
            boardsData.find((b) => b.id === currentActive?.id) || boardsData[0],
        );
        setViewingTask((currentTask) => {
          if (!currentTask) return null;
          // ابحث عن النسخة المحدثة من المهمة المعروضة
          for (const board of boardsData) {
            for (const col of board.columns) {
              const task = col.tasks.find((t) => t.id === currentTask.id);
              if (task) return task;
            }
          }
          return null;
        });
      }
    }
    setLoadingBoards(false);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: newBoard, error: boardError } = await supabase
      .from("boards")
      .insert({ name: "My First Board", user_id: user.id })
      .select()
      .single();
    if (boardError) {
      console.error("Error creating board:", boardError);
      return;
    }
    await supabase.from("columns").insert([
      { name: "Todo", board_id: newBoard.id },
      { name: "Doing", board_id: newBoard.id },
      { name: "Done", board_id: newBoard.id },
    ]);
    await fetchBoards();
  };

  const handleAddTask = async (newTaskData) => {
    const column = activeBoard.columns.find(
      (c) => c.name === newTaskData.status,
    );
    if (!column) return;
    const { data: newTask, error: taskError } = await supabase
      .from("tasks")
      .insert({
        title: newTaskData.title,
        description: newTaskData.description,
        status: newTaskData.status,
        column_id: column.id,
      })
      .select()
      .single();
    if (taskError) {
      console.error("Error creating task:", taskError);
      return;
    }
    if (newTaskData.subtasks.length > 0) {
      const subtasksToInsert = newTaskData.subtasks.map((sub) => ({
        title: sub.title,
        is_completed: false,
        task_id: newTask.id,
      }));
      await supabase.from("subtasks").insert(subtasksToInsert);
    }
    await fetchBoards();
  };

  // 🔽🔽🔽 هذا هو الإصلاح النهائي لدالة تحديث المهمة الفرعية 🔽🔽🔽
  const handleSubtaskToggle = async (subtaskId, newStatus) => {
    const { error } = await supabase
      .from("subtasks")
      .update({ is_completed: newStatus })
      .eq("id", subtaskId);

    if (error) {
      console.error("Error updating subtask:", error);
    } else {
      // بعد التحديث الناجح، قم بإعادة جلب كل البيانات
      // هذا يضمن أن كل شيء (المودال والبطاقات) يعرض أحدث البيانات
      await fetchBoards();
    }
  };

  const handleEditTask = async (updatedTaskData) => {
    if (!editingTask) return;

    // 1. ابحث عن الـ ID الخاص بالعمود الجديد
    const newColumn = activeBoard.columns.find(
      (c) => c.name === updatedTaskData.status,
    );
    if (!newColumn) return;

    // 2. قم بتحديث بيانات المهمة الأساسية في جدول 'tasks'
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        title: updatedTaskData.title,
        description: updatedTaskData.description,
        status: updatedTaskData.status,
        column_id: newColumn.id, // حدّث الـ column_id إذا تغيرت الحالة
      })
      .eq("id", editingTask.id); // حدد المهمة التي تريد تعديلها

    if (updateError) {
      console.error("Error updating task:", updateError);
      return;
    }

    // 3. تعامل مع المهام الفرعية (الأفضل حذف القديم وإضافة الجديد لضمان التوافق)
    // أولاً: احذف كل المهام الفرعية القديمة المرتبطة بالمهمة
    await supabase.from("subtasks").delete().eq("task_id", editingTask.id);

    // ثانياً: أضف المهام الفرعية الجديدة
    if (updatedTaskData.subtasks.length > 0) {
      const subtasksToInsert = updatedTaskData.subtasks.map((sub) => ({
        title: sub.title,
        is_completed: sub.is_completed || false, // احتفظ بالحالة القديمة إن وجدت
        task_id: editingTask.id,
      }));
      await supabase.from("subtasks").insert(subtasksToInsert);
    }

    // 4. بعد نجاح كل العمليات، أغلق المودال وأعد جلب البيانات
    setEditingTask(null);
    await fetchBoards();
  };
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    // 1. احذف المهمة من جدول 'tasks'
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskToDelete.id); // حدد المهمة التي تريد حذفها بالـ id

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      // 2. إذا نجح الحذف، أغلق المودال وأعد جلب البيانات
      setTaskToDelete(null);
      await fetchBoards();
    }
  };
  if (loadingBoards) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#20212C] text-2xl text-white">
        Loading Your Boards...
      </div>
    );
  }
  if (boards.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#20212C] text-white">
        <h2 className="mb-4 text-2xl">You don't have any boards yet.</h2>
        <button
          onClick={handleCreateBoard}
          className="rounded-full bg-[#635FC7] px-6 py-3 font-bold text-white hover:bg-[#A8A4FF]"
        >
          + Create Your First Board
        </button>
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
        onSubtaskToggle={handleSubtaskToggle}
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
