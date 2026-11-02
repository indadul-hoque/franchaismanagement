import Enrollments from "../models/courseEnrollment.model.js";
import Users from "../models/users.model.js";
import Courses from "../models/courses.model.js";
import ApiError from "../utils/ApiError.js";

export const enrollStudent = async ({ studentId, courseId, courseTitle }) => {
  if (!studentId || !courseId || !courseTitle) {
    throw new ApiError(400, "All fields are required");
  }

  const studentExists = await Users.findById(studentId);
  if (!studentExists) {
    throw new ApiError(404, "Student not found");
  }

  const courseExists = await Courses.findById(courseId);
  if (!courseExists) {
    throw new ApiError(404, "Course not found");
  }

  const enrollment = new Enrollments({
    studentId,
    courseId,
    courseTitle,
  });

  await enrollment.save();
  return enrollment;
};

export const getEnrollmentsByStudentId = async (studentId) => {
  const enrollments = await Enrollments.find({ studentId })
    .populate("courseId")
    .populate("studentId");

  if (!enrollments || enrollments.length === 0) {
    throw new ApiError(404, "No enrollments found for this student");
  }

  return enrollments;
};

export const getAllEnrollments = async () => {
  const allEnrollments = await Enrollments.find()
    .populate("studentId", "firstName lastName email phone role")
    .populate(
      "courseId",
      "courseTittle instructorName duration price courseLevel courseDescription"
    );

  if (!allEnrollments || allEnrollments.length === 0) {
    throw new ApiError(404, "No enrolled courses found.");
  }

  return allEnrollments;
};

export const deleteEnrollmentById = async (enrollmentId) => {
  const deleteEnrolledCourse = await Enrollments.findByIdAndDelete(enrollmentId);
  if (!deleteEnrolledCourse) {
    throw new ApiError(404, "Enrollment not found");
  }
  return deleteEnrolledCourse;
};

export default {
  enrollStudent,
  getEnrollmentsByStudentId,
  getAllEnrollments,
  deleteEnrollmentById,
};

