import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },

  academicSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicSession',
    required: true,
  },

  term: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true,
    trim: true
  },

  ca: {
    type: Number,
    min: 0,
    max: 40
  },

  exam: {
    type: Number,
    min: 0,
    max: 60
  },

  total: {
    type: Number,
    min: 0,
    max: 100
  },

  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    trim: true
  }
});

resultSchema.index(
  {
    student: 1,
    subject: 1,
    academicSession: 1,
    term: 1
  },
  {
    unique: true
  }
);

export const Result = mongoose.model('Result', resultSchema);