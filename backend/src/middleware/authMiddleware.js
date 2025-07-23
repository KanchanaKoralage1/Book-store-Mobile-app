import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Attach user to the request object
    req.user = user;
    next(); 
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
