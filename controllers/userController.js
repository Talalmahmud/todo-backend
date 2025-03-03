import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../models/userModel.js";
import { generateRandomCode, sendEmail } from "../utils/common.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    if (user.isTwoFAEnabled) {
      return res.status(200).json({
        message: "User already exist. But 2fa not enable",
        id: user._id,
      });
    }
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const emailCode = generateRandomCode();
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    emailCode: emailCode,
  });
  await sendEmail(emailCode.toString(), email);
  await newUser.save();
  res
    .status(201)
    .json({ message: "User created successfully", id: newUser._id });
};

export const userLogin = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (!user.verified) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.isTwoFAEnabled) {
      const isValid = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token,
        window: 1,
      });

      if (!isValid) {
        return res.status(400).json({ message: "Invalid 2FA code" });
      }
    }

    res.status(200).json({ message: "Login successful", id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
