import mongoose from "mongoose";



const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  age: {
    type: Number,
    required: true,
    min: 1
  },

  staffType: {
    type: String,
    enum: ['teaching', 'non-teaching'],
    required: true
  },

  position: {
    type: String,
    required: true,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
});


export const Staff = mongoose.model('Staff', staffSchema);