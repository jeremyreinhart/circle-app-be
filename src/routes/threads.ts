import express from "express";
import { authenticate } from "../middlewares/auth";
import { createThread } from "../controllers/thread";

const router = express.Router();

router.post("/thread", authenticate, createThread);

export default router;
