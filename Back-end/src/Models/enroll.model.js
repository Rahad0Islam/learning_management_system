import mongoose from "mongoose";

const enrollSchema=new mongoose.Schema({
     courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
     },
     learnerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },

     enrollAt:{
         type:Date,
         default:Date.now
     },
     paymentStatus:{
        type:String,
        enum: ["paid", "unpaid", "refunded","pending"],
        default:"unpaid"
     },

     status: {
        type: String,
        enum: ["active", "completed", "cancelled", "pending"],
        default: "pending"
     },

     certificateIssued:{
        type:Boolean,
        default:false
     },
     progress:{
        type:Number,
        default:0,
        min:0,
        max:100
     },
     transactionID: {
      type: String
    }



},{timestamps:true});

export const Enroll=mongoose.model("Enroll",enrollSchema);