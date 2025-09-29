import "./App.css";
import Sidebar from "./components/shared/Sidebar";
import Header from "./components/shared/Header";
import Board from "./components/shared/Board";
import { useState } from "react";
import data from "./data";
function App() {
  const [boards, setBoards] = useState(data.boards);
  const activeBoard = boards[0];
  return (
    <div className="flex">
      <Sidebar boards={boards} />
      <main className="flex-1">
        <Header boardName={activeBoard.name} />
        <Board board={activeBoard} />
      </main>
    </div>
  );
}

export default App;
