import express from "express";
import { authenticate } from "../middlewares/auth";
import { toggleLike } from "../controllers/like";

const router = express.Router();

router.post("/threads/:threadId/like", authenticate, toggleLike);

export default router;
