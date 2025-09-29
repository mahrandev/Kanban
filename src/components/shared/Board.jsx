function Board({ board }) {
    return (
        <section>
            <h2>{board.name}</h2>
            <ul>
                {board.columns.map((column) => (
                    <li key={column.id}>{column.name}</li>
                ))}
            </ul>
        </section>
    );
}
export default Board;