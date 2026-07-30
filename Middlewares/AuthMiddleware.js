import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const VerifyToken = async (req, res, next) => {
  const TOKENS = process.env.JWT_TOKEN;

  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(400).json({ success: false, message: "Login first" });
    }

    const decode = jwt.verify(token, TOKENS);

    req.existAdmin = decode;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
