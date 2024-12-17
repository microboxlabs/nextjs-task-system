import db from "../../../db/database";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const task_id = searchParams.get("task_id");

  try {
    const comments = db
      .prepare(
        `
        SELECT 
            c.task_id,
            c.user_id,
            c.comment,
            c.created_at,
            u.username
        FROM 
            comments c
        JOIN 
            users u ON c.user_id = u.id
        WHERE 
            c.task_id = ?;
      `
      )
      .all(task_id);

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
  
  export async function POST(request) {
    try {
      const { task_id, user_id, comment } = await request.json();
  
      if (!task_id || !user_id || !comment) {
        return new Response(
          JSON.stringify({ error: "All fields are required: task_id, user_id, comment" }),
          { status: 400 }
        );
      }

      const result = db
        .prepare(
          `
          INSERT INTO comments (task_id, user_id, comment)
          VALUES (?, ?, ?);
        `
        )
        .run(task_id, user_id, comment);
  
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }