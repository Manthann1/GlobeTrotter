import { createTripSchema, updateTripSchema } from '../schemas/trip.schema.js';
import * as tripService from '../services/trip.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper to map tripActivities to activities for frontend compatibility
 */
const mapTripActivities = (trip) => {
  if (!trip) return trip;
  if (trip.stops) {
    trip.stops = trip.stops.map(stop => ({
      ...stop,
      activities: stop.tripActivities || []
    }));
  }
  return trip;
};

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
      data: { trip: mapTripActivities(trip) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips belonging to the authenticated user or public trips
 */
export const getTrips = async (req, res, next) => {
  try {
    // If accessing the /public endpoint, path ends with 'public'
    const isPublic = req.path.endsWith('/public') || req.query.public === 'true';

    let trips;
    if (isPublic || !req.user) {
      trips = await tripService.getPublicTrips();
    } else {
      trips = await tripService.getUserTrips(req.user.id);
    }

    const formattedTrips = trips.map(mapTripActivities);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trips retrieved successfully',
      data: { trips: formattedTrips },
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
    const userId = req.user?.id || null;
    const trip = await tripService.getTripById(userId, req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip retrieved successfully',
      data: { trip: mapTripActivities(trip) },
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
      data: { trip: mapTripActivities(trip) },
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
      data: { trip: mapTripActivities(trip) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregated budget breakdown for a trip
 */
export const getTripBudget = async (req, res, next) => {
  try {
    const budgetData = await tripService.getTripBudgetAggregation(req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip budget retrieved successfully',
      data: budgetData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate share token and share trip
 */
export const shareTrip = async (req, res, next) => {
  try {
    const shareData = await tripService.shareTrip(req.user.id, req.params.id);

    return successResponse(res, {
      statusCode: 200,
      message: 'Trip shared successfully',
      data: shareData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deep copy a shared trip into current user's account
 */
export const copyTrip = async (req, res, next) => {
  try {
    const shareToken = req.params.shareToken || req.params.token;
    const clonedTrip = await tripService.copyTripTransaction(req.user.id, shareToken);

    return successResponse(res, {
      statusCode: 201,
      message: 'Trip cloned successfully',
      data: { trip: mapTripActivities(clonedTrip) },
    });
  } catch (error) {
    next(error);
  }
};

