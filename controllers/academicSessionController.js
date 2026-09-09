import { createAcademicSession, deleteAcademicSession, getAcademicSession, updateAcademicSession } from "../services/academicSessionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createAcademicSessionController = asyncHandler(
  async (req, res) => {
    const newAcademicSession = await createAcademicSession(req.body);

    res.status(201).json({
      message: 'Academic session was created succesfully',
      data: newAcademicSession
    });
  }
);


export const getAcademicSessionController = asyncHandler(
  async (req, res) => {
    const academicSessions = await getAcademicSession(req.params.sessionId);

    res.status(200).json({
      message: 'Academic session found',
      data: academicSessions
    });
  }
);



export const updateAcademicSessionController = asyncHandler(
  async (req, res) => {
    const updatedAcademicSession = await updateAcademicSession(req.params.sessionId, req.body);

    res.status(200).json({
      message: 'Academic session was updated successfully',
      data: updatedAcademicSession
    });
  }
);



export const deleteAcademicSessionController = asyncHandler(
  async (req, res) => {
    const deletedSession = await deleteAcademicSession(req.params.sessionId);

    res.status(200).json({
      message: 'Academic session was deleted successfully',
      data: deletedSession
    });
  }
)