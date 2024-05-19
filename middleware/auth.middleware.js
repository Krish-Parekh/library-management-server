import  jwt  from "jsonwebtoken";
import { User } from "../model/user.model.js";


const verifyToken = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer")) {
      token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { verifyToken };
