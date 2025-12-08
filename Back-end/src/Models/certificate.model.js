import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({

  courseID: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Course" 
  },
  learnerID: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    },
  issuedAt: {
     type: Date, default: Date.now
     },
  certificateCode: {
     type: String, 
     unique: true
     }
});


export const Certificate=mongoose.model("Certificate",certificateSchema)