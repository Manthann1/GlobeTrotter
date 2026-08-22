import prisma from '../db.js';

/**
 * Create a new trip for a user
 */
export const createTrip = async (userId, { name, startDate, endDate, description, coverPhoto, isPublic }) => {
  const trip = await prisma.trip.create({
    data: {
      userId,
      name,
      startDate,
      endDate,
      description: description || null,
      coverPhoto: coverPhoto || null,
      isPublic: isPublic ?? false,
    },
  });
  return trip;
};

/**
 * Get all trips for a specific user
 */
export const getUserTrips = async (userId) => {
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
    include: {
      user: { select: { id: true, name: true, profilePhoto: true } },
      budget: true,
      _count: {
        select: { stops: true },
      },
      stops: {
        include: { 
          city: true,
          tripActivities: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      }
    },
  });
  return trips;
};

/**
 * Get all public trips
 */
export const getPublicTrips = async () => {
  const trips = await prisma.trip.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, profilePhoto: true } },
      budget: true,
      _count: {
        select: { stops: true, sharedLinks: true },
      },
      stops: {
        include: { 
          city: true,
          tripActivities: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      }
    },
  });
  return trips;
};

export const getTripById = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: {
      OR: [
        { id: tripId },
        { shareToken: tripId }
      ]
    },
    include: {
      user: { select: { id: true, name: true, profilePhoto: true } },
      stops: {
        orderBy: { sortOrder: 'asc' },
        include: {
          city: true,
          tripActivities: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
      budget: true,
    },
  });

  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  return trip;
};

/**
 * Update an existing trip owned by the user
 */
export const updateTrip = async (userId, tripId, updateData) => {
  // Ensure the trip exists and belongs to the user
  const existingTrip = await getTripById(userId, tripId);

  // Validate date relationship if updating partial dates
  const newStartDate = updateData.startDate ?? existingTrip.startDate;
  const newEndDate = updateData.endDate ?? existingTrip.endDate;

  if (newEndDate < newStartDate) {
    const error = new Error('End date must be on or after start date');
    error.statusCode = 400;
    throw error;
  }

  // Strip out any attempts to modify userId or id
  const { id, userId: _ignoredUserId, ...safeUpdateData } = updateData;

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: safeUpdateData,
  });

  return updatedTrip;
};

/**
 * Delete a trip owned by the user
 */
export const deleteTrip = async (userId, tripId) => {
  // Ensure the trip exists and belongs to the user
  await getTripById(userId, tripId);

  await prisma.trip.delete({
    where: { id: tripId },
  });

  return { id: tripId };
};

/**
 * Get a public trip by its shareToken
 */
export const getTripByShareToken = async (shareToken) => {
  const trip = await prisma.trip.findFirst({
    where: {
      shareToken,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilePhoto: true,
        },
      },
      stops: {
        orderBy: { sortOrder: 'asc' },
        include: {
          city: true,
          tripActivities: {
            orderBy: { sortOrder: 'asc' },
            include: {
              activity: true,
            },
          },
        },
      },
      budget: true,
    },
  });

  if (!trip) {
    const error = new Error('Public trip not found or link has expired');
    error.statusCode = 404;
    throw error;
  }

  return trip;
};
