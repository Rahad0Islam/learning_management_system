import { Router } from "express";
import { upload } from "../Middleware/Multer.Middleware.js";

import { jwtVerification } from "../Middleware/Authentication.Middleware.js";
import { addCourse, courseEnroll } from "../Controllers/Course.controller.js";
import { addMaterial } from "../Controllers/material.controller.js";
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


export default router