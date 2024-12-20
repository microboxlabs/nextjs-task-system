import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { error: "Invalid or missing taskId parameter." },
      { status: 400 },
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        taskId: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error fetching comments. Please try again later." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const userId = parseInt(session.user.id);

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { error: "Invalid or missing taskId parameter." },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 },
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        taskId: parseInt(id),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Error creating comment. Please try again later." },
      { status: 500 },
    );
  }
}
