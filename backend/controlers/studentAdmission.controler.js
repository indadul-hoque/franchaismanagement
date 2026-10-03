import StudentAdmission from "../models/studentAdmission.model.js";


export const studentAdmission = async (req, res) => {
    try {
        const {
            studentName,
            schoolName,
            class: studentClass,
            dateOfBirth,
            gender,
            age,
            hobbies,
            fatherName,
            fatherOccupation,
            motherName,
            motherOccupation,
            address,
            city,
            pinCode,
            state,
            mobileNumber,
            whatsAppNumber,
            email,
            branch,
            level,
            sourceReference,
            addmissionDate,
            selectCourse,
            courseMode,
            monthlyFees
        } = req.body;

        const newStudent = new StudentAdmission({
            studentName,
            schoolName,
            class: studentClass,
            dateOfBirth,
            gender,
            age,
            hobbies,
            fatherName,
            fatherOccupation,
            motherName,
            motherOccupation,
            address,
            city,
            pinCode,
            state,
            mobileNumber,
            whatsAppNumber,
            email,
            branch,
            level,
            sourceReference,
            addmissionDate,
            selectCourse,
            courseMode,
            monthlyFees
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully', student: newStudent });
    } catch (error) {
        res.status(500).json({ message: 'Error registering student', error });
    }
};


export const getAllAdmitedStudents = async (req, res) => {
    try {
        const students = await StudentAdmission.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(404).json({ message: 'No students found', error });
    }
}

export const deleteAdmitedStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await StudentAdmission.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const deletedStudent = await StudentAdmission.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
