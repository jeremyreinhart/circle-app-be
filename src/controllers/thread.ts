import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";
import { io } from "../app";
import redis from "../lib/redis";

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
        image,
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

    // Cache invalidation
    await redis.del(`user:${req.user.id}:threads`);
    await redis.del(`threads:timeline:user:${req.user.id}`);

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
  const userId = req.user?.id || 0;
  const cacheKey = `threads:timeline:user:${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        message: "Get all threads (from cache)",
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const allThread = await prisma.thread.findMany({
      orderBy: { created_at: "desc" },
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
          select: { replies: true },
        },
      },
    });

    const threadsWithLiked = allThread.map((thread) => ({
      ...thread,
      likes: thread.likes.length,
      replies: thread._count.replies,
      liked: userId
        ? thread.likes.some((like) => like.created_by === userId)
        : false,
    }));

    await redis.set(cacheKey, JSON.stringify(threadsWithLiked), "EX", 60);

    res.status(200).json({
      message: "Get all threads",
      fromCache: false,
      data: threadsWithLiked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDetailThread = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid thread id" });

  const cacheKey = `thread:${id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Get detail thread (from cache)",
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

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

    const responseData = {
      id: detailThread.id,
      content: detailThread.content,
      image: detailThread.image,
      created_at: detailThread.created_at,
      creator: detailThread.creator,
      likes_count: detailThread._count.likes,
      replies_count: detailThread._count.replies,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 120);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      fromCache: false,
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to Get Data" });
  }
};

export const getThreadByUser = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid user id",
    });
  }

  const cacheKey = `user:${userId}:threads`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Get my threads successfully (from cache)",
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

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

    await redis.set(cacheKey, JSON.stringify(threads), "EX", 60);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: threads.length
        ? "Get my threads successfully"
        : "No threads have been created yet.",
      fromCache: false,
      data: threads,
    });
  } catch (error) {
    console.error("GET THREAD BY USER ERROR:", error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
    });
  }
};
