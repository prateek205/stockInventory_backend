import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./Config/db.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import DealerRoute from "./Routes/DealerRoutes.js";
import ProductRoute from "./Routes/ProductRoute.js";
import CustomerRoute from "./Routes/CustomerRoute.js";
import PurchaseRoute from "./Routes/PurchaseRoute.js";
import SalesRoute from "./Routes/SaleRoute.js";
import DashboardRoute from "./Routes/DashboardRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const SERVER_PORT = process.env.PORT || 5000;

connectDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/admin", AuthRoutes);
app.use("/api/v1/dashboard", DashboardRoute);
app.use("/api/v1/dealer", DealerRoute);
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/customer", CustomerRoute);
app.use("/api/v1/purchase", PurchaseRoute);
app.use("/api/v1/sales", SalesRoute);

app.listen(SERVER_PORT, () => {
  console.log(`The Server is Running on http://localhost:${SERVER_PORT}`);
});
