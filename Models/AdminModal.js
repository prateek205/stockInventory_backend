import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isAdmin:{
    type:String,
    default:true
  },
  role: {
    type: String,
    enum: ["Admin"],
  },
},{
    timestamps:true
});

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin;
