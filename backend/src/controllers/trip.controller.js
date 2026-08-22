import { createTripSchema, updateTripSchema } from '../schemas/trip.schema.js';
import * as tripService from '../services/trip.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Create a new trip
 */
export const createTrip = async (req, res, next) => {
  try {
    const parseResult = createTripSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const trip = await tripService.createTrip(req.user.id, parseResult.data);

    return successResponse(res, {
      statusCode: 201,
      message: 'Trip created successfully',
      data: { trip },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips belonging to the authenticated user
 */
export const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trips retrieved successfully',
      data: { trips },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single trip by ID
 */
export const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.user.id, req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip retrieved successfully',
      data: { trip },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update trip metadata
 */
export const updateTrip = async (req, res, next) => {
  try {
    const parseResult = updateTripSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const trip = await tripService.updateTrip(req.user.id, req.params.id, parseResult.data);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip updated successfully',
      data: { trip },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a trip
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.user.id, req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a public trip by its share token
 */
export const getTripByShareToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const trip = await tripService.getTripByShareToken(token);

    return successResponse(res, {
      statusCode: 200,
      message: 'Shared trip retrieved successfully',
      data: { trip },
    });
  } catch (error) {
    next(error);
  }
};
