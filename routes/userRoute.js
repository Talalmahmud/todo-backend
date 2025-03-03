import express from "express";
import { createUser, userLogin } from "../controllers/userController.js";
import {
  emailVerify,
  twoFaSetup,
  twoFaSetupVerify,
  verifyTwoFA,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/email-verify", emailVerify);
router.post("/login", userLogin);
router.post("/twofa-setup", twoFaSetup);
router.post("/twofa-setup-verify", twoFaSetupVerify);
router.post("/twofa-verify", verifyTwoFA);

export default router;
