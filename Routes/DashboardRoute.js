import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import { dashboard } from "../Controllers/DashboardController.js";

const router = express.Router();

router.get("/dashboard_data", VerifyToken, dashboard);

export default router;
