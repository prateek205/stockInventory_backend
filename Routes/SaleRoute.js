import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import { createSales,getSales,getSale,updateSale,removeSale } from "../Controllers/SalesController.js";
const router = express.Router();

router.post("/createSales", VerifyToken, createSales);
router.get("/getSales", VerifyToken, getSales);
router.get("/getSale/:id", VerifyToken, getSale);
router.put("/updateSale/:id", VerifyToken, updateSale);
router.delete("/deleteSale/:id", VerifyToken, removeSale);

export default router;
