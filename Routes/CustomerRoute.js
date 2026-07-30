import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../Controllers/CustomerController.js";

const router = express.Router();

router.post("/createCustomer", VerifyToken, createCustomer);
router.get("/customers", VerifyToken, getCustomers);
router.get("/customer/:id", VerifyToken, getCustomer);
router.put("/updateCustomer/:id", VerifyToken, updateCustomer);
router.delete("/deleteCustomer/:id", VerifyToken, deleteCustomer);

export default router;
