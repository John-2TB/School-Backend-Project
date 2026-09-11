import { createSubject, getstudentsBySubjectId, deleteSubject, getSubjects, updateSubject } from "../services/subjectService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /subject
export const createSubjectController = asyncHandler(
  async (req, res) => {
    const newSubject = await createSubject(req.body);

    res.status(201).json({
      message: 'Created subject successfully',
      data: newSubject
    });
  }
);

// GET students by subjectID
export const getStudentsBySubjectIdController = asyncHandler(
  async (req, res) => {
    const students = await getstudentsBySubjectId(req.params.subjectId)

    res.status(200).json({
      message: 'Students found for this subject',
      data: students
    })
  }
);

export const getSubjectController = asyncHandler(
  async (req, res) => {
    const subjects = await getSubjects(req.user, req.params.subjectId);

    res.status(200).json({
      message: 'Subjects found',
      data: subjects
    });
  }
);


// Delete subjects by ID
export const deleteSubjectController = asyncHandler(
  async (req, res) => {
    const deletedSubject = await deleteSubject(req.params.subjectId)

    res.status(200).json({     
      message: 'Subject was successfully deleted',
      data: deletedSubject  
    });
  }
);


// Update subject by ID
export const updateSubjectController = asyncHandler(
  async (req, res) => {
    const updatedSubject = await updateSubject(req.params.subjectId, req.body)

    res.status(200).json({     
      message: 'Subject was successfully updated',
      data: updatedSubject  
    });
  }
);