import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";

export const createThread = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { content, image } = req.body;

  const thread = await prisma.thread.create({
    data: {
      content,
      image: image || null,
      creator: {
        connect: { id: req.user.id },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

  res.status(201).json(thread);
};
