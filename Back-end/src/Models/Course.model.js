import mongoose from "mongoose";

const CourseSchema=new mongoose.Schema({
     title:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     price:{
        type:Number,
        required:true,
        min: 0
     },
     owner:{
         type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

     },
     isActive:{
        type:Boolean,
        default:true
     },
     status:{
        type:String,
        enum:["available","unavailable","pending"],
        default:"pending"

     }

    //material
    




},{timestamps:true});


export const Course = mongoose.model("Course", CourseSchema);
