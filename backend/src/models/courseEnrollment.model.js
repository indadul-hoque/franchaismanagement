import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true // Ensures studentId is always provided
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true // Ensures courseId is always provided
    },
    courseTitle: {
        type: String,
        required: true,
        trim: true // Removes extra spaces
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Enrollments = mongoose.model("Enrollments", enrollmentSchema);

export default Enrollments;
