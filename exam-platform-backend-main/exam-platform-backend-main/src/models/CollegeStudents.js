// models/CollegeStudents.js
import mongoose from 'mongoose';

const collegeStudentSchema = new mongoose.Schema({
  
  collegeName: {
    type: String,
    required: true,
  },
  students: [
    {
      name: { type: String, required: true },
      rollNo: { type: String, required: true },
    },
  ],
});

const CollegeStudents = mongoose.model('CollegeStudents', collegeStudentSchema);

export default CollegeStudents;
