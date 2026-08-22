import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, {
    statusCode: 404,
    message: `Route not found - ${req.originalUrl}`,
  });
};
