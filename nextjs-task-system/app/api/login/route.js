import db from "../../db/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "e95c8b5289c1bb3ec29be04822a7b5ddfb912d71a884bc9633b889b0439565eb8f3400f7b91a9e023b1d2ed57ed7217c2a485bbe3287c9cbd2a83aafd39d21e8";

export async function POST(request) {
  const { email, pass } = await request.json();
  try {
  const user = db
    .prepare("SELECT id, username, email, pass, rol FROM users WHERE email = ?")
    .get(email);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }
  const match = await bcrypt.compare(pass, user.pass);

  if (!match) {
    return new Response(JSON.stringify({ error: "Incorrect credentials" }), {
      status: 401,
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, rol: user.rol },
    SECRET_KEY,
    { expiresIn: "1h" },
  );

  const userLogged = {id: user.id, username: user.username, email: user.email, rol: user.rol}
  return new Response(JSON.stringify({ token, user: userLogged }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: token }), { status: 400 });
  }
}
