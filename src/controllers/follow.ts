import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";
import { io } from "../app";

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
        message: "Invalid type,use followers or following",
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
              bio: true,
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
            bio: fol.follower.bio,
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
            bio: true,
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
          bio: item.following.bio,
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

    // Get updated counts untuk follower (current user)
    const followerCounts = await prisma.following.count({
      where: { follower_id: followerId },
    });

    // Get updated counts untuk following (target user)
    const followingCounts = await prisma.following.count({
      where: { following_id: user_id },
    });

    // Emit real-time update ke current user (yang follow)
    io.emit(`follow-update:${followerId}`, {
      userId: followerId,
      following: followerCounts,
    });

    // Emit real-time update ke target user (yang di-follow)
    io.emit(`follow-update:${user_id}`, {
      userId: user_id,
      followers: followingCounts,
    });

    io.emit("follow-action", {
      followerId: followerId,
      followingId: user_id,
      action: "follow",
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
    console.error("Follow error:", error);
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

    // Get updated counts untuk follower (current user)
    const followerCounts = await prisma.following.count({
      where: { follower_id: followerId },
    });

    // Get updated counts untuk following (target user)
    const followingCounts = await prisma.following.count({
      where: { following_id: user_id },
    });

    // Emit real-time update ke current user (yang unfollow)
    io.emit(`follow-update:${followerId}`, {
      userId: followerId,
      following: followerCounts,
    });

    // Emit real-time update ke target user (yang di-unfollow)
    io.emit(`follow-update:${user_id}`, {
      userId: user_id,
      followers: followingCounts,
    });

    // Emit global event untuk update UI realtime
    io.emit("follow-action", {
      followerId: followerId,
      followingId: user_id,
      action: "unfollow",
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
    console.error("Unfollow error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to unfollow user",
    });
  }
};

export const getFollowsCount = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);

  if (!userId)
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user id" });

  try {
    const followers = await prisma.following.count({
      where: { following_id: userId },
    });
    const following = await prisma.following.count({
      where: { follower_id: userId },
    });
    res.json({ status: "success", data: { followers, following } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    // Ambil semua user yang sudah di-follow
    const following = await prisma.following.findMany({
      where: {
        follower_id: userId,
      },
      select: {
        following_id: true,
      },
    });

    const followingIds = following.map((f) => f.following_id);

    // Ambil 5 random users yang BUKAN current user dan BELUM di-follow
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followingIds, userId],
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
        bio: true,
      },
      take: 5,
      orderBy: {
        id: "asc",
      },
    });

    // Shuffle untuk membuat lebih random
    const shuffled = suggestedUsers.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      status: "success",
      data: shuffled.slice(0, 5),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch suggested users",
    });
  }
};
