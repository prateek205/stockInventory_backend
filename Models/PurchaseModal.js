import mongoose from "mongoose";
import PurchaseItemSchema from "./PurchaseItemModal.js";

const PurchaseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    dealer: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Dealers",
      required: true,
    },
    purchaseDate:{
        type:Date,
        default:Date.now
    },
    items: [PurchaseItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod:{
        type:String,
        enum:["UPI","Credit Card", "Debit Card", "Bank Transfer", "Cash"],
        default:"Cash",
    },
    remark:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  },
);

const Purchases = mongoose.model("Purchases", PurchaseSchema);

export default Purchases;
