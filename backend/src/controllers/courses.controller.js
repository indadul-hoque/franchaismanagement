import mongoose from "mongoose";
import * as courseService from "../services/course.service.js";

export const addCourse = async (req, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    return res.status(201).json({
      message: "Course initialized and saved successfully.",
      course: newCourse,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Course Addition Failure:", error);
    return res.status(500).json({
      error: "Failed to create course.",
      technicalDetails: error.message,
    });
  }
};

export const allCourse = async (req, res) => {
  try {
    const { category, age, status } = req.query;
    const all_courses = await courseService.getAllCourses({ category, age, status });

    return res.status(200).json({
      courses: all_courses,
      totalCourses: all_courses.length,
      message: `Successfully fetched ${all_courses.length} courses.`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching courses.",
      details: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const updatedCourse = await courseService.updateCourseById(id, req.body);
    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error updating course:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const updatedCourse = await courseService.updateCourseStatusById(id, status);
    return res.status(200).json({
      message: "Course status updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error updating course status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const deletedCourse = await courseService.deleteCourseById(id);
    return res.json({ message: "Course deleted successfully", deletedCourse });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  addCourse,
  allCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
};

