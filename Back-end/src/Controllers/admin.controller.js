import { Course } from "../Models/Course.model.js";
import { Enroll } from "../Models/enroll.model.js";
import { User } from "../Models/User.Model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";
import { FileDelete, FileUpload } from "../Utils/Cloudinary.js";
import jwt from 'jsonwebtoken';
import { transaction } from "../Utils/transaction.js";
import { Bank } from "../Models/bank.model.js";


const approvedEnroll=AsynHandler(async(req,res)=>{
    
    const{courseID,learnerID,transactionID}=req.body;

    if(!courseID || !learnerID || !transactionID){
        throw new ApiError(401,"courseID , LearnerID and transactionID are needed");
    }

    const admin=await User.findById(req.user?._id);
    if(!admin || admin?.Role!=="admin"){
        throw new ApiError(401,"only admin can approve this enrollment");
    }

    const course=await Course.findById(courseID)
    const learner= await User.findById(learnerID)
    if(!course){
        throw new ApiError(401,"course are not found")
    }
    if(!learner){
        throw new ApiError(401,"learner are not found ")
    }

    const txn=await Bank.findById(transactionID);
    if(!txn){
        throw new ApiError(401,"transaction not found ")
    }

    if(txn.status==="success"){
        throw new ApiError(401,"payment already accepted")
    }

    
    
    const enroll=await  Enroll.findOne({
          courseID,learnerID
    })

    if(!enroll){
        throw new ApiError(401,"enroll ID not found ")
    }
    //aproved
    txn.status="success";
    admin.balance=Number(admin.balance)+Number(txn.amount);
    enroll.paymentStatus="paid";
    enroll.status="active";
    
    const courseOwner=course.owner;

    let instructorBank=null;
    console.log(course.owner.toString());
    console.log(admin._id.toString());
    if (course.owner.toString() !== admin._id.toString()) {

    const perEnrolled=Number(txn.amount)*.60;

    admin.balance=(admin.balance)-perEnrolled;
    const tranc=new transaction(admin?._id,courseOwner,perEnrolled,"instructors salary ");
    const tnx=await tranc.tnx()
    console.log("teacher salay done ",perEnrolled);
    instructorBank=await Bank.findById(tnx);
    
    const teacher=await User.findById(courseOwner);
    
    teacher.balance=Number(teacher.balance)+(perEnrolled);
    instructorBank.status="success";
    await teacher.save({validateBeforeSave:false})

}

 
    await course.save({validateBeforeSave:false})
    if(instructorBank)
    await instructorBank.save({validateBeforeSave:false})
    await txn.save({validateBeforeSave:false})
    await admin.save({validateBeforeSave:false})
    await enroll.save({validateBeforeSave:false})

    console.log("approved successfully ");
    
    return res
    .status(201)
    .json(
        new ApiResponse(201,{txn,enroll},"approved successfully and instructor salary done ")
    )
})


export{
    approvedEnroll
}