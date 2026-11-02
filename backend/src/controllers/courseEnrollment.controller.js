import mongoose from "mongoose";
import * as enrollmentService from "../services/courseEnrollment.service.js";

export const enroll = async (req, res) => {
  try {
    const { studentId, courseId, courseTitle } = req.body;
    const enrollment = await enrollmentService.enrollStudent({ studentId, courseId, courseTitle });
    return res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Enrollment error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEnrolledCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentId);
    return res.json(enrollments);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllEnrolledCourse = async (req, res) => {
  try {
    const allEnrollments = await enrollmentService.getAllEnrollments();
    return res.json(allEnrollments);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteSpecificEnrolledCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      return res.status(400).json({ message: "Invalid enrollmentId format." });
    }

    const deleteEnrolledCourse = await enrollmentService.deleteEnrollmentById(enrollmentId);
    return res.json({
      message: "Enrollment deleted successfully.",
      deleteEnrolledCourse,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error deleting enrollment:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default {
  enroll,
  getEnrolledCourse,
  getAllEnrolledCourse,
  deleteSpecificEnrolledCourse,
};

