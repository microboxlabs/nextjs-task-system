import { db } from "@/database/task";
import { Task } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo acepta solicitudes GET
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  console.log("Cliente conectado"); // Log para verificar conexiones

  // Configura los encabezados necesarios para SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // Envía un mensaje inicial
  res.write(
    "data: " + JSON.stringify({ message: "Conexión establecida" }) + "\n\n",
  );

  // Función para obtener las tareas actualizadas
  const sendUpdatedTasks = () => {
    db.all("SELECT * FROM tasks", async (err, rows: Task[]) => {
      if (err) {
        console.error("Error al obtener tareas:", err);
        return;
      }

      // Procesa las tareas (puedes personalizar el procesamiento según tu lógica)
      //  const tasks = await Promise.all(rows.map(processTaskWithAssignedName));

      // Envia las tareas al cliente
      // res.write(`data: ${JSON.stringify(rows)}\n\n`);
      const tasksWithIndicator = rows.map((task) => ({
        ...task,
        isNew: false, // Indicador de nueva tarea
      }));

      res.write(`data: ${JSON.stringify(tasksWithIndicator)}\n\n`);
    });
  };

  // Envía las actualizaciones cada 5 segundos
  const intervalId = setInterval(() => {
    sendUpdatedTasks(); // Llama a la función para enviar tareas actualizadas
  }, 5000);

  res.write(
    `data: ${JSON.stringify({
      title: "Nueva tarea asignada",
      body: "Revisa tu dashboard para más detalles.",
      url: "/dashboard",
    })}\n\n`,
  );

  // Limpia recursos al cerrar la conexión
  req.on("close", () => {
    console.log("Cliente desconectado"); // Log para verificar cierres
    clearInterval(intervalId);
    res.end();
  });
}
