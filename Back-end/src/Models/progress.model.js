import mongoose, { mongo } from "mongoose";

const progressSchema = new mongoose.Schema({

  courseID: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Course" 
    },
    
  learnerID: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    },

  materialID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Material"
 },

  watchedSeconds: { 
    type: Number, 
    default: 0 
}, 

  watchedPercent: { 
    type: Number,
     default: 0
 },  

  completed: { 
    type: Boolean,
     default: false 
},

videoUrl: { 
    type: String 
}

}, { timestamps: true });


export const Progress = mongoose.model("Progress",progressSchema)