import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(201).json({ message: "User created successfully" });
};
