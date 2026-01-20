import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";

export const registerUser = async (
  username: string,
  full_name: string,
  email: string,
  password: string,
) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, full_name, email, password: hashed },
  });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
    username: user.username,
    photo_profile: user.photo_profile,
    bio: user.bio,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong Password");

  const token = signToken({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
  });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    username: user.username,
    photo_profile: user.photo_profile,
    bio: user.bio,
    token,
  };
};
