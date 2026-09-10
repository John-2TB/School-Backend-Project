import mongoose from "mongoose";



const studentCounterSchema = new mongoose.Schema({
  sequence: {
    type: Number,
    default: 0
  }
});

export const StudentCounter = mongoose.model('StudentCounter', studentCounterSchema);