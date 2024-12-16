import db from "../../db/database.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = "e95c8b5289c1bb3ec29be04822a7b5ddfb912d71a884bc9633b889b0439565eb8f3400f7b91a9e023b1d2ed57ed7217c2a485bbe3287c9cbd2a83aafd39d21e8"; 


export async function GET() {
  const users = db.prepare("SELECT id, username, email, rol FROM users").all();
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(request) {
  const { username, email, pass, rol } = await request.json();

  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    const result = db.prepare(
      'INSERT INTO users (username, email, pass, rol) VALUES (?, ?, ?, ?)'
    ).run(username, email, hashedPass, rol || 'regular');
    return new Response(JSON.stringify({ id: result.lastInsertRowid }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

