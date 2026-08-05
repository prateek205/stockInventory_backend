import Admin from "../Models/AdminModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN = process.env.JWT_TOKEN;

export const RegisterAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existAdmin = await Admin.findOne({ email });
    if (existAdmin) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPass,
      role: "Admin",
    });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "User Created Successfully...",
      admin: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const LoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory..." });
    }

    const existAdmin = await Admin.findOne({ email });
    if (!existAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, existAdmin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: existAdmin._id }, TOKEN, { expiresIn: "1d" });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const user = {
      id: existAdmin._id,
      name: existAdmin.name,
      email: existAdmin.email,
      role: existAdmin.role,
    };

    res.status(200).json({
      success: true,
      message: "Admin Login Successfully...",
      token: token,
      admin:user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.existAdmin.id).select("-password");

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const LogoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminToken");

    res.status(200).json({ success: true, message: "Logout Successfully..." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
