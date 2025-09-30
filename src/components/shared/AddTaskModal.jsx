// src/components/shared/AddTaskModal.jsx

import { useState } from "react";
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

function AddTaskModal({ isOpen, onClose, columns, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState(["", ""]); // بداية بمهمتين فرعيتين
  const [status, setStatus] = useState(columns[0]?.name || "");

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // التحقق الأساسي من صحة البيانات
    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }

    const newTask = {
      title,
      description,
      status,
      subtasks: subtasks
        .filter((s) => s.trim() !== "")
        .map((s) => ({ title: s, isCompleted: false })),
    };
    onAddTask(newTask);
    onClose(); // إغلاق المودال بعد الإضافة
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2B2C37] border-none text-white">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#20212C] border-gray-600 "
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#20212C] border-gray-600"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="subtasks">Subtasks</Label>
            <div className="space-y-2">
              {subtasks.map((sub, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={sub}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    className="bg-[#20212C] border-gray-600"
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
              className="w-full mt-2 bg-white text-[#635FC7] hover:bg-gray-200"
            >
              + Add New Subtask
            </Button>
          </div>
          <div>
            <Label className="mb-2" htmlFor="status">Status</Label>
            <Select onValueChange={setStatus} defaultValue={status}>
              <SelectTrigger className="bg-[#20212C] border-gray-600">
                <SelectValue placeholder="Select a status" />
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
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskModal;
