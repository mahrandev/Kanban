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
  const handleAddTask = async (newTaskData) => {
    // 1. ابحث عن الـ ID الخاص بالعمود المحدد من الحالة المحلية
    const column = activeBoard.columns.find(
      (c) => c.name === newTaskData.status,
    );
    if (!column) return;

    // 2. أنشئ المهمة الجديدة في جدول 'tasks'
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

    // 3. إذا كانت هناك مهام فرعية، أنشئها في جدول 'subtasks'
    if (newTaskData.subtasks.length > 0) {
      const subtasksToInsert = newTaskData.subtasks.map((sub) => ({
        title: sub.title,
        is_completed: false,
        task_id: newTask.id, // اربطها بالـ ID الخاص بالمهمة الجديدة
      }));

      const { error: subtaskError } = await supabase
        .from("subtasks")
        .insert(subtasksToInsert);

      if (subtaskError) {
        console.error("Error creating subtasks:", subtaskError);
      }
    }

    // 4. تحديث الحالة المحلية فوراً (Optimistic Update)
    const newBoards = JSON.parse(JSON.stringify(boards));
    const board = newBoards.find((b) => b.name === activeBoard.name);
    const targetColumn = board.columns.find(
      (c) => c.name === newTaskData.status,
    );
    targetColumn.tasks.push({ ...newTask, subtasks: newTaskData.subtasks }); // أضف المهمة الجديدة للواجهة
    setBoards(newBoards);
  };
  const handleEditTask = (updatedTask) =>
    console.log("Editing task:", updatedTask);
  const handleDeleteTask = () => console.log("Deleting task...");

  const handleCreateBoard = async () => {
    // 1. احصل على المستخدم الحالي
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. أنشئ لوحة جديدة واربطها بالمستخدم
    const { data: newBoard, error: boardError } = await supabase
      .from("boards")
      .insert({ name: "My First Board", user_id: user.id })
      .select()
      .single(); // .select().single() يجعل Supabase يرجع البيانات التي تم إنشاؤها

    if (boardError) {
      console.error("Error creating board:", boardError);
      return;
    }

    // 3. أنشئ أعمدة افتراضية لهذه اللوحة
    const { error: columnsError } = await supabase.from("columns").insert([
      { name: "Todo", board_id: newBoard.id },
      { name: "Doing", board_id: newBoard.id },
      { name: "Done", board_id: newBoard.id },
    ]);

    if (columnsError) {
      console.error("Error creating columns:", columnsError);
    } else {
      // 4. قم بتحديث الحالة المحلية لتعرض اللوحة الجديدة فوراً
      setBoards([
        ...boards,
        {
          ...newBoard,
          columns: [
            { name: "Todo", tasks: [] },
            { name: "Doing", tasks: [] },
            { name: "Done", tasks: [] },
          ],
        },
      ]);
    }
  };
  // عرض رسالة تحميل بينما يتم جلب بيانات الألواح
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
