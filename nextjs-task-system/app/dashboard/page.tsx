const tasks = [
    { id: 1, title: 'Task 1', status: 'Pending', dueDate: '2024-12-05' },
    { id: 2, title: 'Task 2', status: 'Completed', dueDate: '2024-12-10' },
  ];
  
  export default function Dashboard() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  