import express from "express";
import { authenticate } from "../middlewares/auth";
import { createReply, getReplys } from "../controllers/reply";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.post("/reply", authenticate, upload.single("image"), createReply);
router.get("/reply", authenticate, getReplys);

export default router;
