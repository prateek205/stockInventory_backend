import mongoose from "mongoose";

const PurchaseItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    buyPrice:{
        type:Number,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    }
  },
  {
    _id:false,
  },
);

export default PurchaseItemSchema;
