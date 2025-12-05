import mongoose from "mongoose";


const bankSchema= new mongoose.Schema({

    fromUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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

},{timestamps:true})

export const Bank=mongoose.model("Bank",bankSchema);