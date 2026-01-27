import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  createThread,
  getDetailThread,
  getThread,
  getThreadByUser,
} from "../controllers/thread";
import { upload } from "../middlewares/multer";
const router = express.Router();

router.post("/thread", authenticate, upload.single("image"), createThread);
router.get("/threads", authenticate, getThread);
router.get("/threads/me/:userId", authenticate, getThreadByUser);
router.get("/thread/:id", authenticate, getDetailThread);

export default router;
