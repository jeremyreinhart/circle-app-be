import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";
import { io } from "../app";

export const createThread = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { content } = req.body || {};
    const image = req.file ? `/uploads/threads/${req.file.filename}` : null;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const thread = await prisma.thread.create({
      data: {
        content,
        image: image,
        creator: { connect: { id: req.user.id } },
      },
      include: {
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

    io.emit("new-thread", thread);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Thread berhasil diposting.",
      data: thread,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getThread = async (req: AuthRequest, res: Response) => {
  const allThread = await prisma.thread.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
          created_at: true,
        },
      },
      likes: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  const userId = req.user?.id || 0;

  const threadsWithLiked = allThread.map((thread) => ({
    ...thread,
    likes: thread.likes.length,
    replies: thread._count.replies,
    liked: userId
      ? thread.likes.some((like) => like.created_by === userId)
      : false,
  }));

  res.status(200).json({
    message: "Get All allThread",
    data: threadsWithLiked,
  });
};

export const getDetailThread = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "Invalid thread id" });
  }

  try {
    const detailThread = await prisma.thread.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
            username: true,
            photo_profile: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    if (!detailThread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        id: detailThread.id,
        content: detailThread.content,
        image: detailThread.image,
        created_at: detailThread.created_at,

        creator: {
          id: detailThread.creator.id,
          full_name: detailThread.creator.full_name,
          username: detailThread.creator.username,
          photo_profile: detailThread.creator.photo_profile,
        },

        likes_count: detailThread._count.likes,
        replies_count: detailThread._count.replies,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to Get Data" });
  }
};

export const getThreadByUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const threads = await prisma.thread.findMany({
      where: { creator: { id: userId } },
      orderBy: { created_at: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    if (!threads.length) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "No threads have been created yet.",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get my threads successfully",
      data: threads,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
    });
  }
};
