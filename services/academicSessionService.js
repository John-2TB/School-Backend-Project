import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";
import { AcademicSession } from "../models/academicSessionModel.js";


// CREATE a new academic session
export const createAcademicSession = async (sessionData) => {
  const { session } = sessionData;

  if (
    session === undefined ||
    typeof session !== 'string' ||
    session.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  const newAcademicSession = await AcademicSession.create({
    session
  });

  return newAcademicSession;
};



// GET academic sessions
export const getAcademicSession = async (sessionId) => {

  // If session ID is undefined, get all the academic sessions
  if (sessionId === undefined) {
    const academicSessions = await AcademicSession.find();

    return academicSessions;
  };

  if (
    typeof sessionId !== 'string' ||
    sessionId.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  const existingSession = await AcademicSession.findById(sessionId);

  if (!existingSession) {
    throw new AppError('No academic session found', 404);
  };

  return existingSession;

};


// Update academic sessions
export const updateAcademicSession = async (sessionId, sessionData) => {
  const { session } = sessionData

  if (
    sessionId === undefined ||
    session === undefined ||
    typeof sessionId !== 'string' ||
    typeof session !== 'string' ||
    sessionId.trim().length === 0 ||
    session.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  const updateData = {
    ...(session !== undefined && { session })
  };

  const updatedSession = await AcademicSession.findByIdAndUpdate(
    sessionId,
    updateData,
    {new: true}
  );

  if (!updatedSession) {
    throw new AppError('No academic session found', 404);
  };

  return updatedSession;

};



export const deleteAcademicSession = async (sessionId) => {
  if (
    sessionId === undefined ||
    typeof sessionId !== 'string' ||
    sessionId.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  const existingSession = await AcademicSession.findById(sessionId);

  if (!existingSession) {
    throw new AppError('No academic session found', 404);
  };

  const deletedSession = await AcademicSession.findByIdAndDelete(sessionId);

  return deletedSession;
}