import mongoose from "mongoose";

const academicSessionSchema = new mongoose.Schema({
  session: {
    type: String,
    required: true,
    trim: true
  }
});

export const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);