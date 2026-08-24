import prisma from '../db.js';
import { getTripById } from './trip.service.js';

/**
 * Helper to check overlapping stop dates within the same trip
 */
const checkStopOverlap = async (tripId, arrivalDate, departureDate, excludeStopId = null) => {
  const existingStops = await prisma.stop.findMany({
    where: {
      tripId,
      ...(excludeStopId ? { id: { not: excludeStopId } } : {}),
    },
  });

  const arr = new Date(arrivalDate).getTime();
  const dep = new Date(departureDate).getTime();

  for (const existing of existingStops) {
    const exArr = new Date(existing.arrivalDate).getTime();
    const exDep = new Date(existing.departureDate).getTime();

    // Overlap condition: arr <= exDep AND dep >= exArr
    if (arr <= exDep && dep >= exArr) {
      const error = new Error(`Stop dates overlap with existing stop (${existing.arrivalDate.toISOString().split('T')[0]} to ${existing.departureDate.toISOString().split('T')[0]})`);
      error.statusCode = 400;
      throw error;
    }
  }
};

/**
 * Add a city stop to an authenticated user's trip
 */
export const addStopToTrip = async (userId, tripId, { cityId, arrivalDate, departureDate, sortOrder, notes }) => {
  // 1. Verify that the trip exists and belongs to the authenticated user
  const trip = await getTripById(userId, tripId);

  // Check date overlap
  await checkStopOverlap(tripId, arrivalDate, departureDate);

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
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      sortOrder: sortOrder ?? 0,
      notes: notes || null,
    },
    include: {
      city: true,
      tripActivities: true,
    },
  });

  return stop;
};

/**
 * Update an existing stop (e.g. dates, sort_order, notes)
 */
export const updateStop = async (userId, stopId, updateData) => {
  const existingStop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });

  if (!existingStop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingStop.trip.userId !== userId) {
    const error = new Error('Unauthorized to update this stop');
    error.statusCode = 403;
    throw error;
  }

  const newArr = updateData.arrivalDate ? new Date(updateData.arrivalDate) : existingStop.arrivalDate;
  const newDep = updateData.departureDate ? new Date(updateData.departureDate) : existingStop.departureDate;

  if (newDep < newArr) {
    const error = new Error('Departure date must be on or after arrival date');
    error.statusCode = 400;
    throw error;
  }

  if (updateData.arrivalDate || updateData.departureDate) {
    await checkStopOverlap(existingStop.tripId, newArr, newDep, stopId);
  }

  const updatedStop = await prisma.stop.update({
    where: { id: stopId },
    data: {
      ...(updateData.arrivalDate && { arrivalDate: newArr }),
      ...(updateData.departureDate && { departureDate: newDep }),
      ...(updateData.sortOrder !== undefined && { sortOrder: updateData.sortOrder }),
      ...(updateData.notes !== undefined && { notes: updateData.notes }),
    },
    include: {
      city: true,
      tripActivities: true,
    },
  });

  return updatedStop;
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

