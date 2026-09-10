import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true
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

export const Teacher = mongoose.model('Teacher', teacherSchema);