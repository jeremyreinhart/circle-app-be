import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  followUser,
  getFollows,
  getFollowsCount,
  getSuggestedUsers,
  unfollowUser,
} from "../controllers/follow";

const router = express.Router();

router.get("/follows", authenticate, getFollows);
router.get("/follows/count/:userId", authenticate, getFollowsCount);
router.post("/follows", authenticate, followUser);
router.delete("/follows", authenticate, unfollowUser);
router.get("/follows/suggested", authenticate, getSuggestedUsers);

export default router;
