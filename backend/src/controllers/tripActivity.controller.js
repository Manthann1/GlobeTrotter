import { createTripActivitySchema, updateTripActivitySchema } from '../schemas/tripActivity.schema.js';
import * as tripActivityService from '../services/tripActivity.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Add a TripActivity to a Stop
 */
export const addActivity = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const parseResult = createTripActivitySchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const tripActivity = await tripActivityService.addActivityToStop(req.user.id, stopId, parseResult.data);

    return successResponse(res, {
      statusCode: 201,
      message: 'Activity added to stop successfully',
      data: { tripActivity },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing TripActivity
 */
export const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parseResult = updateTripActivitySchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const tripActivity = await tripActivityService.updateTripActivity(req.user.id, id, parseResult.data);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip activity updated successfully',
      data: { tripActivity },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a TripActivity
 */
export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await tripActivityService.deleteTripActivity(req.user.id, id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip activity deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

