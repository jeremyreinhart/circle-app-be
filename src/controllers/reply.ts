import { Response, Request } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../prisma/client";
import { io } from "../app";

export const createReply = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const userId = req.user.id;

  const threadIdParam = req.query.thread_id;
  if (!threadIdParam || Array.isArray(threadIdParam)) {
    return res.status(400).json({ error: "thread_id is required" });
  }

  const threadId = parseInt(String(threadIdParam), 10);
  if (isNaN(threadId)) {
    return res.status(400).json({ error: "Invalid thread_id" });
  }

  // Ambil content dari form-data
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
  });

  if (!thread) {
    return res.status(404).json({ error: "Thread not found" });
  }

  // Ambil file image dari multer
  const file = req.file;
  const imagePath = file ? `/uploads/replies/${file.filename}` : null; // sesuai folder destination multer

  try {
    const reply = await prisma.reply.create({
      data: {
        content,
        image: imagePath,
        user_id: userId,
        thread_id: threadId,
        created_by: userId,
      },
      select: {
        id: true,
        content: true,
        image: true,
        created_at: true,
        creator: {
          select: {
            id: true,
            full_name: true,
            username: true,
            photo_profile: true,
          },
        },
      },
    });

    io.to(`thread:${threadId}`).emit("reply:new", {
      ...reply,
      thread_id: threadId,
    });

    io.emit("reply:count", {
      threadId,
      increment: 1,
    });

    return res.status(201).json({
      code: 201,
      status: "success",
      data: reply,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create reply" });
  }
};

export const getReplys = async (req: Request, res: Response) => {
  const { thread_id } = req.query;

  if (!thread_id) {
    return res.status(400).json({ error: "thread_id is required" });
  }

  try {
    const replies = await prisma.reply.findMany({
      where: {
        thread_id: Number(thread_id),
      },
      orderBy: { created_at: "asc" },
      select: {
        id: true,
        content: true,
        image: true,
        created_at: true,
        creator: {
          select: {
            id: true,
            full_name: true,
            username: true,
            photo_profile: true,
          },
        },
      },
    });

    return res.json({ data: replies });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch" });
  }
};
