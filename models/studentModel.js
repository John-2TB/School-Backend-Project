import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  academicSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicSession',
    required: true 
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    required: true,
    min: 1
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },

  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
});

export const Student = mongoose.model('Student', studentSchema);