import { Course } from "../Models/Course.model.js";
import { Enroll } from "../Models/enroll.model.js";
import { User } from "../Models/User.Model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";
import { FileDelete, FileUpload } from "../Utils/Cloudinary.js";
import jwt from 'jsonwebtoken';
import { transaction } from "../Utils/transaction.js";


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
      const {courseID,price,adminID,secretKey}=req.body;
      

      if(!courseID){
        throw new ApiError(401,"courseID needed! ");
      }
      

      const courseCheck=await Enroll.findOne({
           courseID:courseID,
           learnerID:req.user?._id 
      });

      if(courseCheck?.paymentStatus==="pending" || courseCheck?.paymentStatus==="paid"){
         throw new ApiError(401,"payment already done ")
      }

  
      if(!adminID){
        throw new ApiError("adminID not valid")
      }

      const adminid=await User.findById(adminID);
      if(!adminid || adminid.Role!=="admin"){
         throw new ApiError("admin are required ");
      }

      const course=await Course.findById(courseID);
      if(!course){
        throw new ApiError(501,"course not found");
      }

     if(course.isActive==false){
        throw new ApiError(401,"course are not availabe ")
     }
      if(price!=course.price){
        throw new ApiError(401,"price are not same")
      }

      const user=await User.findById(req.user?._id);
      if(!user){
        throw new ApiError(401,"user not found");
      }
    
      const IsSecretCorr=await user.IssecretKeyCorrect(secretKey);
      if(!IsSecretCorr)throw new ApiError(401,"secret key invalid");

      if(price>user.balance){
        throw new ApiError(401,"balance are insufficient!");
      }
      
      user.balance=Number(user.balance)-Number(price);

      const txn=new transaction(user._id,adminID,price,`purchase course: ${course.title}`)
      const transactionID=await txn.tnx();
      const enrolled=await Enroll.create({
         courseID,
         learnerID:user._id,
         enrollAt:new Date(),
         transactionID,
         paymentStatus:"pending"

      })

      await  user.save({validateBeforeSave:false});
      console.log("enrolled succesfully .. awaiting for admin approval");
       

      
      return res
      .status(201)
      .json(
        new ApiResponse(201,enrolled,"enrolled succesfully .. awaiting for admin approval")
      )

})

export{
    addCourse,
    courseEnroll

}