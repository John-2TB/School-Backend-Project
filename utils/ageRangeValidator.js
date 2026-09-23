import { AppError } from "../errors/AppError.js";

export const validateAgeRange = (ageRange) => {
  if (typeof ageRange === 'object') {
    // Checks if the relationship between the comparison operator
    let lowerValue;
    let upperValue;

    if (
      ageRange.$gte !== undefined ||
      ageRange.$gt !== undefined
    ) {
      lowerValue = ageRange.$gte ?? ageRange.$gt
    };

    if (
      ageRange.$lte !== undefined ||
      ageRange.$lt !== undefined
    ) {
      upperValue = ageRange.$lte ?? ageRange.$lt
    };

    let lowerOperator;
    let upperOperator;

    if (
      Object.keys(ageRange).includes('$gte')
    ) {
      lowerOperator = '$gte'
    } else if (
      Object.keys(ageRange).includes('$gt')
    ) {
      lowerOperator = '$gt'
    };
    
    if (
      Object.keys(ageRange).includes('$lte')
    ) {
      upperOperator = '$lte'
    } else if (
      Object.keys(ageRange).includes('$lt')
    ) {
      upperOperator = '$lt'
    };

    if (lowerValue !== undefined && upperValue !== undefined) {
      if (
        lowerValue === upperValue
      ) {
        if (lowerOperator !== '$gte' || upperOperator !== '$lte') {
          throw new AppError('Invalid comparison', 400);
        }
      };

      if (lowerValue > upperValue) {
          throw new AppError('Invalid comparison', 400);
      };
    };
  };
};