import { db } from "@/database/task";
import { NextApiRequest, NextApiResponse } from "next";
import { protectRoute } from "@/utils/middleware";
import { Group, User } from "@/types";

interface GroupWithUsers {
  group: string;
  users: { id: number; username: string }[];
  id_group: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return protectRoute(createGroup, "admin")(req, res);
    case "GET":
      return protectRoute(getGroups, "admin")(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

const createGroup = (req: NextApiRequest, res: NextApiResponse) => {
  const { name, user_ids } = req.body; // aqui se pide el nombre del grupo y un array con los ids de usuario

  if (!name || !Array.isArray(user_ids) || user_ids.length === 0) {
    return res.status(400).json({ error: "Group name and users are required" });
  }

  // Crear el grupo
  db.run(`INSERT INTO groups (name) VALUES (?)`, [name], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error creating group" });
    }

    const groupId = this.lastID; // aqui obtenemos el id del nuevo grupo

    // Asignar los usuarios al grupo
    const insertUsersToGroup = db.prepare(
      `INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)`,
    );

    user_ids.forEach((userId: number) => {
      insertUsersToGroup.run(userId, groupId, (err: any) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error assigning users to group" });
        }
      });
    });

    insertUsersToGroup.finalize();

    return res.status(201).json({
      message: "Group created and users assigned successfully",
      groupId,
    });
  });
};

// Endpoint para obtener todos los grupos y los usuarios asignados
const getGroups = (req: NextApiRequest, res: NextApiResponse) => {
  // Consulta para obtener todos los grupos
  db.all("SELECT * FROM groups", (err, groups: Group[]) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching groups" });
    }

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: "No groups found" });
    }

    // Inicializar el array con el tipo explícito
    const groupsWithUsers: GroupWithUsers[] = [];

    groups.forEach((group) => {
      db.all(
        "SELECT u.username, u.id FROM users u INNER JOIN user_groups ug ON u.id = ug.user_id WHERE ug.group_id = ?",
        [group.id],
        (err, users: User[]) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error fetching group members" });
          }

          groupsWithUsers.push({
            group: group.name,
            users: users.map((user) => ({
              id: user.id,
              username: user.username,
            })),
            id_group: group.id,
          });

          // Cuando hemos agregado todos los grupos y sus usuarios, respondemos
          if (groupsWithUsers.length === groups.length) {
            return res.status(200).json(groupsWithUsers);
          }
        },
      );
    });
  });
};
