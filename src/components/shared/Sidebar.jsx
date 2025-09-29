function Sidebar({ boards }) {
    return (
        <aside>
            <ul>
                {boards.map((board) => (
                    <li key={board.id}>{board.name}</li>
                ))}
            </ul>
        </aside>
    );
}
export default Sidebar;