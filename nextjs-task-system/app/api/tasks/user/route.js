import db from "../../../db/database";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
  
    try {

      const groups = db.prepare(`
        SELECT 
            gu.group_id
        FROM 
            group_users gu
        WHERE 
            gu.user_id = ?;
      `).all(user_id);
  
      const groupIds = groups.map(group => group.group_id);
  
      const tasks = db.prepare(`
        SELECT * FROM tasks t
        WHERE 
            (t.assigned_to_type = 'user' AND t.assigned_to_id = ?)
            OR (t.assigned_to_type = 'group' AND t.assigned_to_id IN (${groupIds.map(() => '?').join(',')}));
      `).all(user_id, ...groupIds);
  
      return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  