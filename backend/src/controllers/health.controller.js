import { successResponse } from '../utils/apiResponse.js';
import * as healthService from '../services/health.service.js';

export const checkHealth = async (req, res, next) => {
  try {
    const healthData = await healthService.getHealthStatus();
    return successResponse(res, {
      statusCode: 200,
      message: 'GlobeTrotter backend is running successfully',
      data: healthData,
    });
  } catch (error) {
    next(error);
  }
};
