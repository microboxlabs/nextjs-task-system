import { Task } from "@/types/tasks-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveNotificationToDB(
  message: { title: string; createdAt: Date },
  userId?: number,
  groupId?: number,
) {
  try {
    await prisma.notification.create({
      data: {
        message: message.title,
        userId: userId || null,
        groupId: groupId || null,
      },
    });
  } catch (error) {
    console.error(
      "Error al guardar la notificación en la base de datos:",
      error,
    );
  }
}

export async function saveMessageAndTask(
  formattedTask: Task,
  token: string,
  messageForWebsocket: string,
) {
  try {
    {
      /*Logic to save notifications by user*/
    }
    const message = {
      title: messageForWebsocket,
      createdAt: new Date(),
    };

    if (formattedTask.user?.id && formattedTask.group?.id == null) {
      const body = {
        message: message,
        userId: formattedTask.user?.id,
      };
      await fetch("http://localhost:8081/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      await saveNotificationToDB(message, formattedTask.user?.id);
    }

    //Logic to save notifications by group
    else if (formattedTask.group?.id) {
      await fetch("http://localhost:8081/send-group-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message,
          groupId: formattedTask.group?.id,
        }),
      });

      await saveNotificationToDB(message, undefined, formattedTask.group.id);
    }
    return true;
  } catch (error) {
    return false;
  }
}
