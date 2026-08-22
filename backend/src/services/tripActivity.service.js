import prisma from '../db.js';

/**
 * Add a TripActivity to a Stop
 */
export const addActivityToStop = async (
  userId,
  stopId,
  { activityId, name, nameSnapshot, category, categorySnapshot, cost, costSnapshot, scheduledDate, timeSlot, sortOrder, notes }
) => {
  // 1. Verify Stop exists and include parent Trip to check ownership
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

  // 2. Security: Verify that the parent trip belongs to the authenticated user
  if (stop.trip.userId !== userId) {
    const error = new Error('Unauthorized to add activity to this stop');
    error.statusCode = 403;
    throw error;
  }

  let finalNameSnapshot = nameSnapshot || name;
  let finalCategorySnapshot = categorySnapshot || category;
  let finalCostSnapshot = costSnapshot ?? cost;

  // 3. Catalog Activity Validation & Fallback Defaults
  if (activityId) {
    const catalogActivity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!catalogActivity) {
      const error = new Error('Activity not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify activity belongs to the same city as the stop
    if (catalogActivity.cityId !== stop.cityId) {
      const error = new Error('Activity does not belong to the city of this stop');
      error.statusCode = 400;
      throw error;
    }

    // Use catalog activity values as defaults if not explicitly provided
    if (!finalNameSnapshot) finalNameSnapshot = catalogActivity.name;
    if (!finalCategorySnapshot) finalCategorySnapshot = catalogActivity.category;
    if (finalCostSnapshot === undefined || finalCostSnapshot === null) {
      finalCostSnapshot = Number(catalogActivity.cost || 0);
    }
  }

  if (!finalNameSnapshot || !finalCategorySnapshot) {
    const error = new Error('Name and category are required for trip activities');
    error.statusCode = 400;
    throw error;
  }

  // 4. Create TripActivity in database
  const tripActivity = await prisma.tripActivity.create({
    data: {
      stopId,
      activityId: activityId || null,
      nameSnapshot: finalNameSnapshot,
      categorySnapshot: finalCategorySnapshot,
      costSnapshot: Number(finalCostSnapshot || 0),
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      timeSlot: timeSlot || null,
      sortOrder: sortOrder ?? 0,
      notes: notes || null,
    },
    include: {
      activity: true,
    },
  });

  return tripActivity;
};

/**
 * Delete a TripActivity
 */
export const deleteTripActivity = async (userId, activityId) => {
  // 1. Verify TripActivity exists and include Stop -> Trip relationship
  const tripActivity = await prisma.tripActivity.findUnique({
    where: { id: activityId },
    include: {
      stop: {
        include: {
          trip: true,
        },
      },
    },
  });

  if (!tripActivity) {
    const error = new Error('Trip activity not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Security: Verify parent Trip belongs to authenticated user
  if (tripActivity.stop.trip.userId !== userId) {
    const error = new Error('Unauthorized to delete this trip activity');
    error.statusCode = 403;
    throw error;
  }

  // 3. Delete record
  await prisma.tripActivity.delete({
    where: { id: activityId },
  });

  return { id: activityId };
};
