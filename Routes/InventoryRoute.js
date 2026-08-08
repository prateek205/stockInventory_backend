import express from "express";
import { getInventory } from "../Controllers/InventoryController.js";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/inventory", VerifyToken, getInventory);

export default router;
