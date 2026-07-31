import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import { createPurchase, getPurchases } from "../Controllers/PurchaseController.js";

const router = express.Router();

router.post("/createPurchase", VerifyToken, createPurchase);
router.get("/getPurchases", VerifyToken, getPurchases);
router.get("/getPurchase/:id", VerifyToken, getPurchase);
router.put("/updatePurchase/:id", VerifyToken, updatePurchase);
router.delete("/deletePurchase/:id", VerifyToken, deletePurchase);

export default router;
