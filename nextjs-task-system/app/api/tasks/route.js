import db from "../../db/database.js";

export async function GET() {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(request) {
  const { title, description,assigned_to, assigned_to_id,assigned_to_type, due_date, priority } = await request.json();

  try {
      const result = db.prepare(
       'INSERT INTO tasks (title, description, assigned_to,assigned_to_id,assigned_to_type,due_date, priority) VALUES (?, ?, ?,?, ?, ?, ?)'
      ).run(title, description, assigned_to, assigned_to_id,assigned_to_type, due_date, priority || 'low');
    return new Response(JSON.stringify({ id: result.lastInsertRowid }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function PUT(request) {
  const { id,title,description,assigned_to,assigned_to_id,assigned_to_type,due_date, status, priority  } = await request.json();

  try {
    const result = db.prepare(
      'UPDATE tasks SET title = ? ,description = ?,assigned_to = ?,assigned_to_id = ?, assigned_to_type = ? ,due_date = ? ,status = ?, priority = ? WHERE id = ?'
    ).run(title,description,assigned_to,assigned_to_id,assigned_to_type,due_date,status,priority, id);

    return new Response(JSON.stringify({ id }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}


export async function DELETE(request) {
  const { searchParams } = new URL(request.url); 
  const id = searchParams.get('id'); 

  try {
      const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

      if (result.changes === 0) {
          return new Response(
              JSON.stringify({ error: 'Task not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
      }

      return new Response(
          JSON.stringify({ message: 'Task deleted successfully' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
  } catch (error) {
      return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }
}
