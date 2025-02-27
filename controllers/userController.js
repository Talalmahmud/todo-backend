import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateRandomCode, sendEmail } from "../utils/common.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
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
  res.status(201).json({ message: "User created successfully" });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }
  if (!user.verified) {
    return res.status(400).json({ message: "Email not verified" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ id: user._id }, "talal", { expiresIn: "10d" });
  res.status(200).json({ token });
};
