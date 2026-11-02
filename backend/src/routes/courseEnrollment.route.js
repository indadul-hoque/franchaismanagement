import express from "express";
import {
  enroll,
  getEnrolledCourse,
  getAllEnrolledCourse,
  deleteSpecificEnrolledCourse,
} from "../controllers/courseEnrollment.controller.js";

const router = express.Router();

router.post("/enroll", enroll);
router.get("/enrolled/:studentId", getEnrolledCourse);
router.get("/allenrolledcourse", getAllEnrolledCourse);
router.delete("/deletestudentenrollment/:enrollmentId", deleteSpecificEnrolledCourse);

export default router;

