import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/userAuth";
import { loginUser, registerUser } from "../services/user-auth";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../types/user";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(500)
        .json({ code: 500, status: "error", message: "Invalid Register" });

    const { full_name, email, password, username } = req.body;
    const user = await registerUser(username, full_name, email, password);

    res.status(201).json({
      code: 200,
      status: "succes",
      message: "Registration Successful",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid Register",
    });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Invalid Login",
      });

    const { email, password } = req.body;
    const data = await loginUser(email, password);

    res.cookie("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login Successful",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid Login",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid token" });
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        bio: true,
        photo_profile: true,
      },
    });
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json({ data: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const userLogout = (req: Request, res: Response) => {
  res.cookie(
    "token",
    "",

    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    },
  );

  res.status(200).json({
    message: "Logout Berhasil",
  });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { full_name, username, bio } = req.body;
  const photo_profile = req.file
    ? `/uploads/profile/${req.file.filename}`
    : undefined;
  try {
    const userEdit = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        full_name,
        username,
        bio,
        ...(photo_profile && { photo_profile }),
      },
      select: {
        id: true,
        full_name: true,
        username: true,
        email: true,
        photo_profile: true,
        bio: true,
      },
    });

    res.json({
      message: "Profile updated Successfuly",
      data: userEdit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
