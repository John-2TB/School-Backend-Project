import cloudinary from "../config/cloudinaryConfig.js";
import { AppError } from "../errors/AppError.js";


export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (error) {
          reject(new AppError(error.message, 500));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};