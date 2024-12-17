import db from "../../../db/database.js";

export async function POST(request) {
  const { group_id, user_id } = await request.json(); 

  try {
    const result = db.prepare('INSERT INTO group_users (group_id, user_id) VALUES (?, ?)').run(group_id, user_id);
    return new Response(JSON.stringify({ id: result.lastInsertRowid }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url); 
  const user_id = searchParams.get('user_id'); 

  try {
      
    const groups = db.prepare(`
      SELECT 
          gu.user_id,
          g.id,
          g.name
      FROM 
          group_users gu
      JOIN 
          groups g
      ON 
          gu.group_id = g.id
      WHERE 
          gu.user_id = ?;
    `).all(user_id);


      return new Response(JSON.stringify(groups), { status: 200 });
  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
