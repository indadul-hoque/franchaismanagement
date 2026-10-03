import express from "express";
import {
  addCourse,
  deleteCourse,
  allCourse,
  updateCourse,
  updateCourseStatus,
} from "../controlers/courses.controler.js";
import { validateInput } from "../middleware/validateInput.js";
import { courseInputValidator } from "../validators/courseInput.validator.js";

const router = express.Router();

router.post("/addCourse", validateInput(courseInputValidator), addCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.put(
  "/updateCourse/:id",
  validateInput(courseInputValidator),
  updateCourse,
);
router.put("/updateCourseStatus/:id", updateCourseStatus);
router.get("/allCourse", allCourse);

export default router;
