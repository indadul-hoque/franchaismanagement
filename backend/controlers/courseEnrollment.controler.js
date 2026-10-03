import express from "express";
import Enrollments from "../models/courseEnrollment.model.js";
import Users from "../models/users.model.js";
import Courses from "../models/courses.model.js";
import mongoose from "mongoose";

const router = express.Router();

// Create Enrollment
export const enroll = async (req, res) => {
  try {
    const { studentId, courseId, courseTitle } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !courseTitle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if student exists
    const studentExists = await Users.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if course exists
    const courseExists = await Courses.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Default payment status to 'Pending' if not provided
    const enrollment = new Enrollments({
      studentId,
      courseId,
      courseTitle,
    });

    await enrollment.save();
    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Enrollment by Student ID
export const getEnrolledCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollments.find({ studentId })
      .populate("courseId")
      .populate("studentId");
    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for this student" });
    }
    res.json(enrollments);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllEnrolledCourse = async (req, res) => {
  try {
    // Fetch all enrollments and populate student & course details
    const allEnrollments = await Enrollments.find()
      .populate("studentId", "firstName lastName email phone role")
      .populate(
        "courseId",
        "courseTittle instructorName duration price courseLevel courseDescription",
      );

    if (!allEnrollments || allEnrollments.length === 0) {
      return res.status(404).json({ message: "No enrolled courses found." });
    }

    res.json(allEnrollments); // Send the populated data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteSpecificEnrolledCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    console.log("Deleting Enrollment with ID:", enrollmentId);

    // Check if enrollmentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      return res.status(400).json({ message: "Invalid enrollmentId format." });
    }

    const deleteEnrolledCourse =
      await Enrollments.findByIdAndDelete(enrollmentId);

    if (!deleteEnrolledCourse) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    return res.json({
      message: "Enrollment deleted successfully.",
      deleteEnrolledCourse,
    });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
