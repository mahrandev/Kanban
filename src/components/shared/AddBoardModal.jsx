// src/components/shared/AddBoardModal.jsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddBoardModal({ isOpen, onClose, onCreateBoard }) {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(["Todo", "Doing"]); // أعمدة افتراضية

  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const addColumn = () => setColumns([...columns, ""]);
  const removeColumn = (index) =>
    setColumns(columns.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Board name is required.");
      return;
    }
    const finalColumns = columns.filter((c) => c.trim() !== "");
    if (finalColumns.length === 0) {
      alert("Board must have at least one column.");
      return;
    }
    onCreateBoard(name, finalColumns);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-[#2B2C37] text-white">
        <DialogHeader>
          <DialogTitle>Add New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="name">Board Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-600 bg-[#20212C]"
            />
          </div>
          <div>
            <Label className="mb-2">Board Columns</Label>
            <div className="space-y-2 ">
              {columns.map((col, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={col}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    className="border-gray-600 bg-[#20212C]"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeColumn(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={addColumn}
              className="mt-2 w-full bg-white text-[#635FC7] hover:bg-gray-200"
            >
              + Add New Column
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#635FC7] hover:bg-[#A8A4FF]"
          >
            Create New Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddBoardModal;
