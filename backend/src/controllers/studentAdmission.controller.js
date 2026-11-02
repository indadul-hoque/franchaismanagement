import * as studentAdmissionService from "../services/studentAdmission.service.js";

export const studentAdmission = async (req, res) => {
  try {
    const newStudent = await studentAdmissionService.registerStudentAdmission(req.body);
    return res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error registering student", error });
  }
};

export const getAllAdmitedStudents = async (req, res) => {
  try {
    const students = await studentAdmissionService.getAllAdmittedStudents();
    return res.status(200).json(students);
  } catch (error) {
    return res.status(404).json({ message: "No students found", error });
  }
};

export const deleteAdmitedStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await studentAdmissionService.deleteAdmittedStudentById(id);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error deleting student:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  studentAdmission,
  getAllAdmitedStudents,
  deleteAdmitedStudent,
};

