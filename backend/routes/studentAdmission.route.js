import express from 'express';
import { studentAdmission, getAllAdmitedStudents, deleteAdmitedStudent } from '../controlers/studentAdmission.controler.js';

const router = express.Router();

router.post('/studentAdmission', studentAdmission);
router.get('/getAllAdmitedStudents', getAllAdmitedStudents);
router.delete('/deleteAdmitedStudent/:id', deleteAdmitedStudent);


export default router;