import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authorizeUser } from "@/utils/authUtils";

interface GroupRequestBody {
  name: string;
  userIds: string[]; // Define los IDs como un array de strings
}

export async function GET(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const groupsWithUsers = await prisma.group.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(groupsWithUsers, { status: 200 });
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    return NextResponse.json({ error: 'Could not fetch groups with their users' }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const body = await req.json();
    const { name, userIds } = body as GroupRequestBody;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validar si userIds está definido y contiene valores válidos
    // En caso de no tener ids de usuario solo se ingresa el grupo
    const validUserIds = userIds?.filter((uId) => uId != null) || [];
    const newGroup = await prisma.group.create({
      data: {
        name,
        users: {
          create: validUserIds.map((uId) => ({ userId: uId }))
        }
      },
      include: {
        users: {
          include: {
            user: true, // Tambien obtiene los datos de los usuarios ingresados al Group
          }
        }
      }
    })

    return NextResponse.json({ message: "Group created successfully", newGroup }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not insert Group" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const body = await req.json();
    const { id, name, userIds } = body as { id: string; name: string; userIds?: string[] };

    if (!id || !name) {
      return NextResponse.json({ error: "Missing required fields: 'id' and 'name'" }, { status: 400 });
    }

    // Validar si userIds está definido y contiene valores válidos
    const validUserIds = userIds?.filter((uId) => uId != null) || [];

    // Actualizar el grupo y las relaciones
    const groupUpdated = await prisma.group.update({
      where: { id },
      data: {
        name,
        users: {
          deleteMany: {}, // Eliminar las relaciones existentes
          create: validUserIds.map((uId) => ({ userId: uId })), // Crear las nuevas relaciones
        },
      },
      include: {
        users: {
          include: {
            user: true, // Tambien obtiene los datos de los usuarios relacionados al Group
          }
        }
      }
    });

    return NextResponse.json({ message: "Group updated successfully", groupUpdated }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not update Group" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('id');

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 }
      );
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not delete Group" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}