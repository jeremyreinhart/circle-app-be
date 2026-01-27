import { AuthRequest } from "../types/user";
import { Response } from "express";
import { io } from "../app";
import { prisma } from "../prisma/client";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const userId = req.user.id;
  const threadId = Number(req.params.threadId);

  try {
    const like = await prisma.like.findUnique({
      where: {
        created_by_thread_id: {
          created_by: userId,
          thread_id: threadId,
        },
      },
    });

    let liked: boolean;

    if (like) {
      await prisma.like.delete({
        where: { id: like.id },
      });
      liked = false;
    } else {
      await prisma.like.create({
        data: {
          user_id: userId,
          thread_id: threadId,
          created_by: userId,
        },
      });
      liked = true;
    }
    const likeCount = await prisma.like.count({
      where: { thread_id: threadId },
    });

    io.emit("like_update", {
      threadId,
      likeCount,
    });

    res.json({
      status: "success",
      liked,
      likeCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like" });
  }
};
