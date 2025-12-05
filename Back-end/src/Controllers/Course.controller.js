import { Course } from "../Models/Course.model.js";
import { User } from "../Models/User.Model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";
import { FileDelete, FileUpload } from "../Utils/Cloudinary.js";
import jwt from 'jsonwebtoken';


const addCourse=AsynHandler(async(req,res)=>{
     const {title,description,price}=req.body;


     if(!title || !description || !price){
        throw new ApiError(401,"All fields are required ");
     }
     if(Number(price)<0){
        throw new ApiError(401,"price can not be negative");
     }

    
     const user=await User.findById(req.user?._id);
     if(!user){
        throw new ApiError(401,"userId not valid");
     }

     if(user.Role!=="admin" && user.Role!=="instructor"){
        throw new ApiError(401,"only admin and instructor can lanch a course ");
     }

     let courseImageLocalPath="";
         if (
                 Array.isArray(req.files?.courseImage) &&
                 req.files?.courseImage.length > 0 
                )
            {
           courseImageLocalPath=req.files?.courseImage[0]?.path;
         }
     
     
     
         if(!courseImageLocalPath){
             throw new ApiError(401,"course picture is required");
         }
       
         console.log(courseImageLocalPath);
     
      const courseImage=await FileUpload(courseImageLocalPath);

      if(!courseImage){
        throw new ApiError(501,"cloudinary problem");
      }

      const course=await Course.create({
          title,
          description,
          price,
          courseImage:courseImage?.url,
          courseImagePublicID:courseImage?.public_id,
          owner:user._id
      })
   

    console.log("course added succesfully ");

    return res
    .status(201)
    .json(
        new ApiResponse(201,course,"course added succesfully")
    )
})


const courseEnroll=AsynHandler(async(req,res)=>{
      const {courseID}=req.body;
})

export{
    addCourse,
    courseEnroll

}