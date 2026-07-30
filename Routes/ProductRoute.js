import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import { createProduct, deleteProduct, getAllProduct, getProductId } from "../Controllers/ProductController.js";

const router = express.Router();

router.post("/createProduct", VerifyToken, createProduct);
router.get("/getAllProducts", VerifyToken, getAllProduct);
router.get("/getProduct/:id", VerifyToken, getProductId);
// router.update("/updateProduct", VerifyToken, updateProduct);
router.delete("/deleteProduct/:id", VerifyToken, deleteProduct);

export default router;
