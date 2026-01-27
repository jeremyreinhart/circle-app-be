import express from "express";
import {
  handleLogin,
  handleRegister,
  updateUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.post("/user/register", handleRegister);
router.post("/user/login", handleLogin);
router.post("/user/logout", authenticate, userLogout);
router.get("/me", userLogin);
router.patch(
  "/user/profile",
  authenticate,
  upload.single("profile"),
  updateUser,
);

export default router;
