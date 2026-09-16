import mongoose from "mongoose";

const academicSessionSchema = new mongoose.Schema({
  session: {
    type: String,
    required: true,
    trim: true
  },

  isCurrent: {
    type: Boolean,
    default: false
  },

  currentTerm: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true
  }
});

export const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);