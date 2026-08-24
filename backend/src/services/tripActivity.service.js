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

  if (scheduledDate) {
    const sched = new Date(scheduledDate).getTime();
    const arr = new Date(stop.arrivalDate).getTime();
    const dep = new Date(stop.departureDate).getTime();
    if (sched < arr || sched > dep) {
      const error = new Error(`Scheduled date must fall within stop's date range (${stop.arrivalDate.toISOString().split('T')[0]} to ${stop.departureDate.toISOString().split('T')[0]})`);
      error.statusCode = 400;
      throw error;
    }
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
 * Update an existing TripActivity
 */
export const updateTripActivity = async (userId, activityId, updateData) => {
  const existingActivity = await prisma.tripActivity.findUnique({
    where: { id: activityId },
    include: {
      stop: {
        include: {
          trip: true,
        },
      },
    },
  });

  if (!existingActivity) {
    const error = new Error('Trip activity not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingActivity.stop.trip.userId !== userId) {
    const error = new Error('Unauthorized to update this trip activity');
    error.statusCode = 403;
    throw error;
  }

  if (updateData.scheduledDate) {
    const sched = new Date(updateData.scheduledDate).getTime();
    const arr = new Date(existingActivity.stop.arrivalDate).getTime();
    const dep = new Date(existingActivity.stop.departureDate).getTime();
    if (sched < arr || sched > dep) {
      const error = new Error(`Scheduled date must fall within stop's date range (${existingActivity.stop.arrivalDate.toISOString().split('T')[0]} to ${existingActivity.stop.departureDate.toISOString().split('T')[0]})`);
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedActivity = await prisma.tripActivity.update({
    where: { id: activityId },
    data: {
      ...(updateData.nameSnapshot && { nameSnapshot: updateData.nameSnapshot }),
      ...(updateData.categorySnapshot && { categorySnapshot: updateData.categorySnapshot }),
      ...(updateData.costSnapshot !== undefined && { costSnapshot: Number(updateData.costSnapshot) }),
      ...(updateData.scheduledDate !== undefined && { scheduledDate: updateData.scheduledDate ? new Date(updateData.scheduledDate) : null }),
      ...(updateData.timeSlot !== undefined && { timeSlot: updateData.timeSlot }),
      ...(updateData.sortOrder !== undefined && { sortOrder: updateData.sortOrder }),
      ...(updateData.notes !== undefined && { notes: updateData.notes }),
    },
    include: {
      activity: true,
    },
  });

  return updatedActivity;
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

