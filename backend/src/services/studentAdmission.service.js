import StudentAdmission from "../models/studentAdmission.model.js";
import ApiError from "../utils/ApiError.js";

export const registerStudentAdmission = async (admissionData) => {
  const newStudent = new StudentAdmission({
    ...admissionData,
    class: admissionData.class || admissionData.studentClass,
  });

  await newStudent.save();
  return newStudent;
};

export const getAllAdmittedStudents = async () => {
  return await StudentAdmission.find();
};

export const deleteAdmittedStudentById = async (id) => {
  const deletedStudent = await StudentAdmission.findByIdAndDelete(id);
  if (!deletedStudent) {
    throw new ApiError(404, "Student not found");
  }
  return deletedStudent;
};

export default {
  registerStudentAdmission,
  getAllAdmittedStudents,
  deleteAdmittedStudentById,
};

