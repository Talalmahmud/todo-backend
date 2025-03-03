export const emailAuth = async (req, res, next) => {
  
        

 
  try {
    const decode = jwt.verify(userToken, "talal");
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
