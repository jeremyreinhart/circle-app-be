import express from "express";
import { authenticate } from "../middlewares/auth";
import { followUser, getFollows, unfollowUser } from "../controllers/follow";

const router = express.Router();

router.get("/follows", authenticate, getFollows);
router.post("/follows", authenticate, followUser);
router.delete("/follows", authenticate, unfollowUser);

export default router;
