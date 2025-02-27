import User from "../models/userModel.js";

export const emailVerify = async (req, res) => {
  const { email, emailCode } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }
  if (user.emailCode !== emailCode) {
    return res.status(400).json({ message: "Invalid code" });
  }
  user.verified = true;
  user.emailCode = "";
  await user.save();
  res.status(200).json({ message: "Email verified successfully" });
};
