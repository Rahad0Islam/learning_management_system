import { Progress } from "../Models/progress.model.js";
import { Material } from "../Models/material.model.js";
import { Enroll } from "../Models/enroll.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsynHandler } from "../Utils/AsyncHandler.js";

const updateProgress = AsynHandler(async (req, res) => {
  const { courseID, materialID, watchedSeconds, videoUrl } = req.body;
  const learnerID = req.user?._id;

  if (!courseID || !materialID || !watchedSeconds || !videoUrl) {
    throw new ApiError(400, "courseID, materialID, watchedSeconds, videoUrl are required");
  }

  const material = await Material.findById(materialID);
  if (!material) throw new ApiError(404, "Material not found");

  
  const videoObj = material.video.find(v => v.url === videoUrl);
  if (!videoObj) throw new ApiError(404, "Video not found in material");

  const duration = videoObj.duration;
  if (!duration) throw new ApiError(400, "Video duration not available");


  let progress = await Progress.findOne({ courseID, learnerID, materialID, videoUrl });

  if (!progress) {
    progress = new Progress({
      courseID,
      learnerID,
      materialID,
      videoUrl,
      watchedSeconds: 0,
      watchedPercent: 0,
      completed: false
    });
  }

  if (watchedSeconds > progress.watchedSeconds) {
    progress.watchedSeconds = watchedSeconds;
    progress.watchedPercent = (watchedSeconds / duration) * 100;

    if (progress.watchedPercent >= 80) {
      progress.completed = true;
    }

    await progress.save();
  }


  const totalMaterials = await Material.countDocuments({ courseID });
  const completedMaterials = await Progress.countDocuments({ courseID, learnerID, completed: true });
  const courseProgress = (completedMaterials / totalMaterials) * 100;

  const enroll = await Enroll.findOneAndUpdate(
    { courseID, learnerID },
    { progress: courseProgress },
    { new: true }
  );


  if (courseProgress >= 100 && !enroll.certificateIssued) {
    enroll.status = "completed";
    // enroll.certificateIssued = true;
    await enroll.save({validateBeforeSave:false});
  }
  
 console.log("Progress updated successfully");

  return res
  .status(200)
  .json(
    new ApiResponse(200, { progress, enroll }, "Progress updated successfully")
  );
});


export {updateProgress}