import { createResults, deleteResult, getResult, getResultsByStudent, getResultsByStudentRegistrationNumber, updateResult } from "../services/resultService.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createResultController = asyncHandler(
  async (req, res) => {
    const newResult = await createResults(req.body);

    res.status(201).json({
      message: 'Result created successfully',
      data: newResult
    });
  }
);


export const getResultController = asyncHandler(
  async (req, res) => {
    const result = await getResult(req.user, req.params.resultId);

    res.status(200).json({
      message: 'Result found',
      data: result
    });
  }
);


export const updateResultController = asyncHandler(
  async (req, res) => {
    const updatedResult = await updateResult(req.params.resultId, req.body);

    res.status(200).json({
      message: 'Result updated successfully',
      data: updatedResult
    });
  }
);


export const deleteResultController = asyncHandler(
  async (req, res) => {
    const deletedResult = await deleteResult(req.params.resultId);

    res.status(200).json({
      message: 'Result deleted successfully',
      data: deletedResult
    });
  }
);



export const getResultsByStudentRegistrationNumberController = asyncHandler(
  async (req, res) => {
    const result = await getResultsByStudentRegistrationNumber(req.user, req.params.registrationNumber);

    res.status(200).json({
      message: 'Result found successfully',
      data: result
    });
  }
);
