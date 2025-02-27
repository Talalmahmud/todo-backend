import express from "express";
import { createUser, userLogin } from "../controllers/userController.js";
import { emailVerify } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/email-verify", emailVerify);
router.post("/login", userLogin);

export default router;
