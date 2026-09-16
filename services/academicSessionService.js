import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";
import { AcademicSession } from "../models/academicSessionModel.js";


// CREATE a new academic session
export const createAcademicSession = async (sessionData) => {
  const { session, isCurrent, currentTerm } = sessionData;

  if (
    session === undefined ||
    typeof session !== 'string' ||
    session.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  if (
    currentTerm === undefined ||
    typeof currentTerm !== 'string' ||
    currentTerm.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  };

  const existingSession = await AcademicSession.findOne({
    session: session
  });

  if (existingSession) {
    throw new AppError('Academic session already exists', 409);
  }

  if (isCurrent !== undefined) {
    if (
      typeof isCurrent !== 'boolean'
    ) {
      throw new AppError('Invalid data passed into current session', 400);
    }


    if (isCurrent === true) {
      const dbSession = await mongoose.startSession();

      try {
        dbSession.startTransaction();
        
        // Checks if there is a current session
        const existingCurrentSession = await AcademicSession.findOne({
          isCurrent: true
        }).session(dbSession);

        // If there is a sesion that is current change it to false
        if (existingCurrentSession) {
          await AcademicSession.findByIdAndUpdate(
            existingCurrentSession._id,
            {isCurrent: false},
            {session: dbSession}
          );
        };

        const [newAcademicSession] = await AcademicSession.create(
          [{
            session,
            isCurrent,
            currentTerm
          }],
          {session: dbSession}
        );

        await dbSession.commitTransaction();

        return newAcademicSession;
        

      } catch (error) {
        await dbSession.abortTransaction();
        throw error
      } finally {
        await dbSession.endSession();
      };
    }
  };

  const newAcademicSession = await AcademicSession.create(
    {
      session,
      isCurrent,
      currentTerm
    }
  );

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


export const getCurrentAcademicSession = async () => {
  const currentSession = await AcademicSession.findOne({
    isCurrent: true
  });

  if (!currentSession) {
    throw new AppError('No current academic session found', 404);
  };

  return currentSession;
};


// Update academic sessions
export const updateAcademicSession = async (sessionId, sessionData) => {
  const { session, isCurrent, currentTerm } = sessionData

  if (
    sessionId === undefined ||
    typeof sessionId !== 'string' ||
    sessionId.trim().length === 0
  ) {
    throw new AppError('Invalid session ID', 400);
  };

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  const existingSession = await AcademicSession.findById(sessionId);

  if (!existingSession) {
    throw new AppError('No academic session found', 404);
  };

  if (session !== undefined) {
    if (
      typeof session !== 'string' ||
      session.trim().length === 0
    ) {
      throw new AppError('Invalid session provided', 400);
    };

    const duplicateSession = await AcademicSession.findOne({
      session,
      _id: { $ne: sessionId }
    });

    if (duplicateSession) {
      throw new AppError('An academic session with this name already exists', 409);
    };
  };

  if (currentTerm !== undefined) {
    throw new AppError("You can't change the term through this method", 400);
  }

  // Checks if isCurrent is being changed
  if (isCurrent !== undefined) {
    if (
      typeof isCurrent !== 'boolean'
    ) {
      throw new AppError('Invalid data passed into current session', 400);
    }


    if (isCurrent === true) {
      const dbSession = await mongoose.startSession();

      try {
        dbSession.startTransaction();
        
        // Checks if there is a current session
        const existingCurrentSession = await AcademicSession.findOne({
          isCurrent: true
        }).session(dbSession);

        // If there is a sesion that is current change it to false
        if (existingCurrentSession) {
          await AcademicSession.findByIdAndUpdate(
            existingCurrentSession._id,
            {isCurrent: false},
            {session: dbSession}
          );
        };

        const updateData = {
          ...(session !== undefined && { session }),
          ...(isCurrent !== undefined && { isCurrent })
        };

        const updatedSession = await AcademicSession.findByIdAndUpdate(
          sessionId,
          updateData,
          {returnDocument: 'after'}
        ).session(dbSession);


        await dbSession.commitTransaction();

        return updatedSession;

      } catch (error) {
        await dbSession.abortTransaction();
        throw error
      } finally {
        await dbSession.endSession();
      };
    }

    if (isCurrent === false && existingSession.isCurrent === true) {
      throw new AppError('The current academic session cannot be unset. Make another session current first.', 400);
    }
  };

  const updateData = {
    ...(session !== undefined && { session }),
    ...(isCurrent !== undefined && { isCurrent })
  };

  const updatedSession = await AcademicSession.findByIdAndUpdate(
    sessionId,
    updateData,
    {returnDocument: 'after'}
  );

  return updatedSession;
};



// Change the current session term
export const advanceAcademicTerm = async () => {
  const existingCurrentSession = await AcademicSession.findOne({
    isCurrent: true
  });

  if (!existingCurrentSession) {
    throw new AppError('No current academic session found', 404);
  };

  if (existingCurrentSession.currentTerm === 'First Term') {
    existingCurrentSession.currentTerm = 'Second Term'
  } else if (existingCurrentSession.currentTerm === 'Second Term') {
    existingCurrentSession.currentTerm = 'Third Term'
  } else {
    throw new AppError('Academic session is already in Third Term, create a new academic session', 400);
  }

  await existingCurrentSession.save();

  return existingCurrentSession;
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