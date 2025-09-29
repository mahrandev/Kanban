function Column({ column }) {
    return (
        <section>
            <h2>{column.name}</h2>
            <ul>
                {column.tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </section>
    );
}
export default Column;