import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const userToken = req.header("Authorization")?.split(" ")[1];

  if (!userToken) {
    return res.status(400).json({ error: "User unauthorized" });
  }
  try {
    const decode = jwt.verify(userToken, "talal");
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
