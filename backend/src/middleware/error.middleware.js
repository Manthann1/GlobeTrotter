import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  // Handle custom status code if set on error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, {
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      errors: {
        stack: err.stack,
        details: err.details || null,
      },
    }),
  });
};
