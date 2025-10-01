// src/components/shared/EditTaskModal.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function EditTaskModal({ isOpen, onClose, columns, taskToEdit, onEditTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [status, setStatus] = useState("");

  // Hook لتعبئة الفورم ببيانات المهمة عند فتح المودال
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setSubtasks(taskToEdit.subtasks.map((s) => s.title)); // عرض العناوين فقط
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  if (!taskToEdit) return null; // لا تعرض شيئاً إذا لم تكن هناك مهمة للتعديل

  // نفس دوال التعامل مع المهام الفرعية من AddTaskModal
  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const addSubtask = () => setSubtasks([...subtasks, ""]);
  const removeSubtask = (index) =>
    setSubtasks(subtasks.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }

    const updatedTask = {
      ...taskToEdit, // احتفظ بالبيانات القديمة مثل الـ ID
      title,
      description,
      status,
      // أعد بناء كائنات المهام الفرعية مع الحفاظ على حالة الإكمال إن أمكن
      subtasks: subtasks.map((subTitle, index) => {
        const oldSubtask = taskToEdit.subtasks[index];
        return {
          title: subTitle,
          isCompleted: oldSubtask ? oldSubtask.isCompleted : false,
        };
      }),
    };
    onEditTask(updatedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-[#2B2C37] text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-600 bg-[#20212C]"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-600 bg-[#20212C]"
            />
          </div>
          <div>
            <Label className="mb-2">Subtasks</Label>
            <div className="space-y-2">
              {subtasks.map((sub, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={sub}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    className="border-gray-600 bg-[#20212C]"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSubtask(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={addSubtask}
              className="mt-2 w-full bg-white text-[#635FC7] hover:bg-gray-200"
            >
              + Add New Subtask
            </Button>
          </div>
          <div>
            <Label className="mb-2" htmlFor="status">
              Status
            </Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="border-gray-600 bg-[#20212C]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2C37] text-white">
                {columns.map((col) => (
                  <SelectItem key={col.name} value={col.name}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#635FC7] hover:bg-[#A8A4FF]"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditTaskModal;
