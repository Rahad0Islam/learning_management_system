import mongoose from "mongoose";
const materialSchema=new mongoose.Schema({
 
  courseID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },
   title:{
    type:String,
    
  },
  description:{
    type:String,
   
  },
  
  materialType:{
     type:String,
     enum:['text','audio','mcq','video','picture'],
     required:true  
  },
 
   //material
      text:{
         type:String
      },

       picture:
      [{
        url: { type: String },
        publicId: { type: String }
     }],

       video:
      [{
        url: { type: String },
        publicId: { type: String }
     }],

      audio:[{
        url:{type:String},
        publicId:{type:String}
      }],
   
  
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