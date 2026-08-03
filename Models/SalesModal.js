import mongoose from "mongoose";
import salesItemSchema from "./SalesItemModal.js";

const SalesSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    salesDate: {
      type: Date,
      default: Date.now,
    },
    items: [salesItemSchema],
    itemDiscount: {
      type: Number,
      default: 0,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: ["Cash", "UPI", "Cards", "Banking"],
      default: "UPI",
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Sales = mongoose.model("Sales", SalesSchema);

export default Sales;
