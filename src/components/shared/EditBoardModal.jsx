// src/components/shared/EditBoardModal.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EditBoardModal({ isOpen, onClose, boardToEdit, onEditBoard }) {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (boardToEdit) {
      setName(boardToEdit.name);
      setColumns(boardToEdit.columns.map((c) => ({ id: c.id, name: c.name })));
    }
  }, [boardToEdit]);

  if (!boardToEdit) return null;

  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  };

  const addColumn = () => setColumns([...columns, { name: "" }]); // Do not add id here
  const removeColumn = (index) =>
    setColumns(columns.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Board name is required.");
      return;
    }
    onEditBoard(name, columns);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-[#2B2C37] text-white">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-600 bg-[#20212C]"
            />
          </div>
          <div>
            <Label>Board Columns</Label>
            <div className="space-y-2">
              {columns.map((col, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={col.name}
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditBoardModal;
