import db from "../../db/database.js";

export async function POST(request) {
  const { name} = await request.json();

  try {
      const result =  db.prepare('INSERT INTO groups (name) VALUES (?)').run(name);
    return new Response(JSON.stringify({ id: result.lastInsertRowid }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function GET() {
  const tasks = db.prepare('SELECT * FROM groups').all();
  return new Response(JSON.stringify(tasks), { status: 200 });
}