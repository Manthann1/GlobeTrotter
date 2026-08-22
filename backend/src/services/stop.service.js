import prisma from '../db.js';
import { getTripById } from './trip.service.js';

/**
 * Add a city stop to an authenticated user's trip
 */
export const addStopToTrip = async (userId, tripId, { cityId, arrivalDate, departureDate, sortOrder, notes }) => {
  // 1. Verify that the trip exists and belongs to the authenticated user
  await getTripById(userId, tripId);

  // 2. Verify that the city exists
  const city = await prisma.city.findUnique({
    where: { id: cityId },
  });

  if (!city) {
    const error = new Error('City not found');
    error.statusCode = 404;
    throw error;
  }

  // 3. Create the stop with city relation included
  const stop = await prisma.stop.create({
    data: {
      tripId,
      cityId,
      arrivalDate,
      departureDate,
      sortOrder: sortOrder ?? 0,
      notes: notes || null,
    },
    include: {
      city: true,
    },
  });

  return stop;
};

/**
 * Delete a stop from an authenticated user's trip
 */
export const deleteStop = async (userId, stopId) => {
  // 1. Verify that the stop exists and include trip details to verify owner
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: {
      trip: true,
    },
  });

  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify ownership
  if (stop.trip.userId !== userId) {
    const error = new Error('Unauthorized to delete this stop');
    error.statusCode = 403;
    throw error;
  }

  // 3. Delete stop
  await prisma.stop.delete({
    where: { id: stopId },
  });

  return { id: stopId };
};
