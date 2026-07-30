import express from "express";
import {
  LoginAdmin,
  LogoutAdmin,
  profile,
  RegisterAdmin,
} from "../Controllers/UserController.js";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/register", RegisterAdmin);
router.post("/login", LoginAdmin);
router.get("/profile", VerifyToken, profile);
router.post("/logout", VerifyToken, LogoutAdmin);

export default router;
