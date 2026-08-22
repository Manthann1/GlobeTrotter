import { successResponse } from '../utils/apiResponse.js';
import * as healthService from '../services/health.service.js';

export const checkHealth = (req, res) => {
  const healthData = healthService.getHealthStatus();
  return successResponse(res, {
    statusCode: 200,
    message: 'GlobeTrotter backend is running successfully',
    data: healthData,
  });
};
