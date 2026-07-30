import express from "express";
import { VerifyToken } from "../Middlewares/AuthMiddleware.js";
import {
  deleteDealer,
  getDealerID,
  getDealers,
  postDealer,
  updateDealers,
} from "../Controllers/DealerController.js";

const router = express.Router();

router.post("/createDealer", VerifyToken, postDealer);
router.get("/allDealers", VerifyToken, getDealers);
router.get("/dealer/:id", VerifyToken, getDealerID);
router.put("/updateDealer/:id", VerifyToken, updateDealers);
router.delete("/deleteDealer/:id", VerifyToken, deleteDealer);

export default router;
