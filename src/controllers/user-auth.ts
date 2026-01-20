import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/userAuth";
import { loginUser, registerUser } from "../services/user-auth";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/auth";

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

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
