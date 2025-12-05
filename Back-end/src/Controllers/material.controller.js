import { Course } from "../Models/Course.model.js";
import { User } from "../Models/User.Model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";
import { FileDelete, FileUpload } from "../Utils/Cloudinary.js";
import jwt from 'jsonwebtoken';
import { Material } from "../Models/material.model.js"; 


const addMaterial=AsynHandler(async(req,res)=>{
      const {title,description,courseID,materialType,text,mcq} =req.body;
      
      if( !courseID || !materialType){
        throw new ApiError(401,"all Feilds are required! ");
      }
    

      const user=await User.findById(req.user?._id);
      if(!user){
        throw new ApiError(401,"User id are not valid");
      }

      if(user.Role!=="admin" && user.Role!=="instructor"){
        throw new ApiError(401,"only admin and instructor can upload a material");
     }
    
    const course=await Course.findById(courseID);
    if(!course){
        throw new ApiError(401,"Course ID is invalid ")
    }
    const pictureLocalPath=[];
    const pictureFiles = Array.isArray(req.files?.picture) ? req.files.picture : [];
    for (const pic of pictureFiles) {
        try {
            const LocalPath = await FileUpload(pic.path);
            if(LocalPath){
                pictureLocalPath.push({ url: LocalPath.url, publicId: LocalPath.public_id });
            }
        } catch (e) {
            console.error('Picture upload failed:', e?.message || e);
        }
    }

    const videoLocalPath=[];
    const videoFiles = Array.isArray(req.files?.video) ? req.files.video : [];
    for (const vid of videoFiles) {
        try {
            const LocalPath = await FileUpload(vid.path);
            if(LocalPath){
                videoLocalPath.push({ url: LocalPath.url, publicId: LocalPath.public_id });
            }
        } catch (e) {
            console.error('Video upload failed:', e?.message || e);
        }
    }

     const audioLocalPath=[];
    const audioFiles = Array.isArray(req.files?.audio) ? req.files.audio: [];
    for (const aid of audioFiles) {
        try {
            const LocalPath = await FileUpload(aid.path);
            if(LocalPath){
                audioLocalPath.push({ url: LocalPath.url, publicId: LocalPath.public_id });
            }
        } catch (e) {
            console.error('audio upload failed:', e?.message || e);
        }
    }

      if ((!text || text.trim() === "") &&
        pictureLocalPath.length === 0 &&
        videoLocalPath.length === 0 &&
        audioLocalPath.length===0 &&
        mcq.length===0
      ) {
     throw new ApiError(400, "upload must contain at least one of: text or  picture or audio or video or mcq");
  }

    let questions = [];
  if (mcq) {
    try {
      const parsed = JSON.parse(mcq);
      if (Array.isArray(parsed)) {
        questions = parsed.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.answer
        }));
      }
    } catch (err) {
      throw new ApiError(400, "Invalid MCQ format, must be valid JSON");
    }
  }
   const material=await Material.create({
     courseID,
     title,
     description,
     materialType,
     text:text||null,
     picture:pictureLocalPath,
     video:videoLocalPath,
     audio:audioLocalPath,
     questions,
     uploadedBy:req.user?._id
     
   })

   console.log("content uploaded succesfully");

   return res
   .status(201)
   .json(
    new ApiResponse(201,material,"content uploaded succesfully")
   )
})



const getAllmaterial=AsynHandler(async(req,res)=>{
     const {courseID}= req.body;

     

})
export{
    addMaterial,
    getAllmaterial
}