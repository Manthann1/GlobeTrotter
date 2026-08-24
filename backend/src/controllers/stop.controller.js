import { createStopSchema, updateStopSchema } from '../schemas/stop.schema.js';
import * as stopService from '../services/stop.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Add a stop to a trip
 */
export const addStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const parseResult = createStopSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const stop = await stopService.addStopToTrip(req.user.id, tripId, parseResult.data);

    return successResponse(res, {
      statusCode: 201,
      message: 'Stop added to trip successfully',
      data: { stop },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update/reorder a stop
 */
export const updateStop = async (req, res, next) => {
  try {
    const stopId = req.params.stopId || req.params.id;
    const parseResult = updateStopSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const stop = await stopService.updateStop(req.user.id, stopId, parseResult.data);

    return successResponse(res, {
      statusCode: 200,
      message: 'Stop updated successfully',
      data: { stop },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a stop
 */
export const deleteStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await stopService.deleteStop(req.user.id, id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Stop deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

