/**
 * Standard API Response helpers
 */
export const successResponse = (res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) => {
  const payload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, { statusCode = 500, message = 'Internal Server Error', errors = null } = {}) => {
  const payload = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};
