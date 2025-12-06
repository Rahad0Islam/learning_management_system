import mongoose from "mongoose";


const bankSchema= new mongoose.Schema({

    fromUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fromUserName:{
        type:String,
        required:true
    },
    fromUserEmail:{
        type:String,
        required:true
    },
    toUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserName:{
        type:String,
        required:true
    },
    toUserEmail:{
        type:String,
        required:true
    },
    transactionTime:{
        type:Date,
        default:Date.now
    },
      amount: {
      type: Number,
      required: true,
      min: 0
    },
    status:{
        type:String,
        enum:["success","pending"],
        default:"pending"
    },
    description:{
        type:String
    }



},{timestamps:true})

export const Bank=mongoose.model("Bank",bankSchema);