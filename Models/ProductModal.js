import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    itemNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    minStock: {
      type: Number,
      default: 5,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["Peice", "Lit.", "Box", "Set"],
      default: "Peice",
    },
    status: {
      type: String,
      enum: ["Available", "Out Of Stock", "Not Available"],
      default: "Available",
    },
    imgUrl:{
        type:String,
        required:true,
    }
  },
  {
    timestamps: true,
  },
);

const Products = mongoose.model("Products", ProductSchema);

export default Products;
