import express from 'express';
import { enroll, getEnrolledCourse, getAllEnrolledCourse, deleteSpecificEnrolledCourse } from '../controlers/courseEnrollment.controler.js';

const router = express.Router();

// Route to enroll a student in a course
router.post('/enroll', enroll);

// Route to get enrolled courses for a specific student
router.get('/enrolled/:studentId', getEnrolledCourse);

// Route to fetching all enrolled courses
router.get('/allenrolledcourse', getAllEnrolledCourse);

// Route to delete a specific enrollment course
router.delete('/deletestudentenrollment/:enrollmentId', deleteSpecificEnrolledCourse)

export default router;
