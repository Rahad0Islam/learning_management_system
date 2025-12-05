import mongoose from "mongoose";
const materialSchema=new mongoose.Schema({
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  materialType:{
     type:String,
     enum:['text','audio','mcq','video'],
     required:true  
  },

  materialContent:{
    type:String,
    required:true,
  },
  questions: [  //mcq
      {
        question: { type: String },
        options: [{ type: String }],
        answer: { type: String }
      }
    ],

uploadedBy:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
}

},{timestamps:true})


export const Material=mongoose.model("Material",materialSchema)