import { Router } from "express";
import { upload } from "../Middleware/Multer.Middleware.js";

import { jwtVerification } from "../Middleware/Authentication.Middleware.js";
import { addCourse } from "../Controllers/Course.controller.js";
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




export default router