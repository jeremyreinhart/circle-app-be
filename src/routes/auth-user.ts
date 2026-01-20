import express from "express";
import { handleLogin, handleRegister, getUser } from "../controllers/user-auth";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/user/register", handleRegister);
router.post("/user/login", handleLogin);

router.get("/user/me", authenticate, getUser);

export default router;
