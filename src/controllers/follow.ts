import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";

export const getFollows = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;
    const type = req.query.type;

    if (type !== "followers" && type !== "following") {
      return res.status(400).json({
        status: "error",
        message: "Invalid type. Use followers or following",
      });
    }
    if (type === "followers") {
      //  siapa yang follow saya
      const followers = await prisma.following.findMany({
        where: {
          following_id: userId,
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      });

      // siapa yang saya follow
      const myFollowing = await prisma.following.findMany({
        where: {
          follower_id: userId,
        },
        select: {
          following_id: true,
        },
      });

      const followingSet = new Set(
        myFollowing.map((item) => item.following_id),
      );

      return res.status(200).json({
        status: "success",
        data: {
          followers: followers.map((fol) => ({
            id: fol.follower.id,
            username: fol.follower.username,
            name: fol.follower.full_name,
            avatar: fol.follower.photo_profile,
            is_following: followingSet.has(fol.follower.id),
          })),
        },
      });
    }

    const following = await prisma.following.findMany({
      where: {
        follower_id: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        following: following.map((item) => ({
          id: item.following.id,
          username: item.following.username,
          name: item.following.full_name,
          avatar: item.following.photo_profile,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch follows",
    });
  }
};

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const followerId = req.user.id;
    const { user_id } = req.body;

    if (!user_id || followerId === user_id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user_id",
      });
    }

    await prisma.following.create({
      data: {
        follower_id: followerId,
        following_id: user_id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "You have successfully followed the user.",
      data: {
        user_id,
        is_following: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to follow the user. Please try again later.",
    });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const followerId = req.user.id;
    const { user_id } = req.body;

    await prisma.following.delete({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: user_id,
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "You have successfully unfollowed the user.",
      data: {
        user_id,
        is_following: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to unfollow user",
    });
  }
};
