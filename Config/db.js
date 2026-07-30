import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()
const MONGO_URL = process.env.DB_URL;

export const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("🚀 Mongodb connection is Successfull...")
    } catch (error) {
        console.log("❌ Mongodb connection is failed...")
    }
}
