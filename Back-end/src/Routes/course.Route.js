import { Router } from "express";
import { upload } from "../Middleware/Multer.Middleware.js";

import { jwtVerification } from "../Middleware/Authentication.Middleware.js";
import { addCourse, courseEnroll } from "../Controllers/Course.controller.js";
import { addMaterial, getAllmaterialList, updateMaterial } from "../Controllers/material.controller.js";
import { approvedCourse, approvedEnroll, issueCertificate } from "../Controllers/admin.controller.js";
import { updateProgress } from "../Controllers/progress.controller.js";
const router=Router();


router.route("/addcourse").post(

    jwtVerification,
    upload.fields([
        {
           name:"courseImage",
           maxCount:1 
        }
    ]),addCourse
)


router.route("/contentUpload").post(
    jwtVerification,
    upload.fields([
        {
            name:"audio",
            maxCount:10
        },
         {
            name:"video",
            maxCount:5
        },
           {
            name:"picture",
            maxCount:10
        }
         
    ]),
    addMaterial
)


router.route("/courseEnroll").post(jwtVerification,courseEnroll)

router.route("/approvedEnroll").post(jwtVerification,approvedEnroll);
router.route("/approvedCourse").post(jwtVerification,approvedCourse);

router.route("/getAllmaterialList").post(jwtVerification,getAllmaterialList)

router.route("/updateProgress").post(jwtVerification,updateProgress)
router.route("/issueCertificate").post(jwtVerification,issueCertificate)
router.route("/updateMaterial").post(jwtVerification,
     upload.fields([
        {
            name:"audio",
            maxCount:10
        },
         {
            name:"video",
            maxCount:5
        },
           {
            name:"picture",
            maxCount:10
        }
         
    ]),
    updateMaterial);
export default router