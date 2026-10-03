import mongoose from 'mongoose';

const studentAdmissionSchema = new mongoose.Schema({
    studentName: { 
        type: String, 
        required: true 
    },
    schoolName: { 
        type: String, 
        required: true 
    },
    class: { 
        type: String, 
        required: true 
    },
    dateOfBirth: { 
        type: Date, 
        required: true 
    },

    gender: { 
        type: String, 
        required: true,
         enum: ['male', 'female', 'Other']
    },
    age: { 
        type: Number, 
        required: true 
    },
    hobbies: { 
        type: String, 
        required: true 
    },
    fatherName: { 
        type: String, 
        required: true 
    },
    fatherOccupation: { 
        type: String, 
        required: true 
    },
    motherName: { 
        type: String, 
        required: true 
    },
    motherOccupation: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    pinCode: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    mobileNumber: { 
        type: String, 
        required: true 
    },
    whatsAppNumber: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    branch: { 
        type: String, 
        required: true,
         enum: ['berhampore', 'cossimbazar', 'lalbagh'] 
    },
    level: { 
        type: String, 
        required: true 
    },
    sourceReference: { 
        type: String, 
        required: true 
    },
    addmissionDate: { 
        type: Date, 
        required: true 
    },

    selectCourse: { 
        type: String, 
        required: true,
        enum: ['abacus', 'vedicmath', 'handwritting'] 
    },
    courseMode: { 
        type: String, 
        required: true,
         enum: ['online', 'offline'] 
    },
    monthlyFees: { 
        type: Number, 
        required: true 
    }
},{ timestamps: true });

const StudentAdmission = mongoose.model('studentRegistrations', studentAdmissionSchema);
export default StudentAdmission;