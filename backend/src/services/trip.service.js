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
    where: {
      userId: userId,
    },
    orderBy: { startDate: 'desc' },
    include: {
      user: { select: { id: true, name: true, profilePhoto: true, email: true } },
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

const isValidUuid = (str) => typeof str === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

export const getTripById = async (userId, tripId) => {
  const trip = await prisma.trip.findFirst({
    where: isValidUuid(tripId)
      ? { OR: [{ id: tripId }, { shareToken: tripId }] }
      : { shareToken: tripId },
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

/**
 * Get SQL-aggregated budget breakdown for a trip
 */
export const getTripBudgetAggregation = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { budget: true },
  });

  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  // Live SQL aggregate query (SUM / GROUP BY category_snapshot)
  const categoryBreakdown = await prisma.tripActivity.groupBy({
    by: ['categorySnapshot'],
    where: {
      stop: {
        tripId,
      },
    },
    _sum: {
      costSnapshot: true,
    },
    _count: {
      id: true,
    },
  });

  const categories = categoryBreakdown.map((item) => ({
    category: item.categorySnapshot,
    totalCost: Number(item._sum.costSnapshot || 0),
    count: item._count.id,
  }));

  const totalCost = categories.reduce((sum, item) => sum + item.totalCost, 0);

  // Calculate duration in days
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
  const perDayAverage = Number((totalCost / totalDays).toFixed(2));

  const dailyCap = trip.budget?.dailyCap ? Number(trip.budget.dailyCap) : null;
  const isOverDailyCap = dailyCap ? perDayAverage > dailyCap : false;

  return {
    tripId,
    totalCost,
    totalDays,
    perDayAverage,
    dailyCap,
    isOverDailyCap,
    categoryCaps: trip.budget?.categoryCaps || {},
    categories,
  };
};

/**
 * Share a trip by generating a shareToken and marking public
 */
export const shareTrip = async (userId, tripId) => {
  const trip = await getTripById(userId, tripId);

  let shareToken = trip.shareToken;
  if (!shareToken) {
    shareToken = `gt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      isPublic: true,
      shareToken,
    },
  });

  // Upsert shared link record
  await prisma.sharedLink.upsert({
    where: { shareToken },
    create: {
      tripId,
      shareToken,
    },
    update: {},
  });

  return {
    shareToken,
    shareUrl: `/public/trips/${shareToken}`,
    isPublic: true,
  };
};

/**
 * Transactional deep-copy of a public trip into the requester's account
 */
export const copyTripTransaction = async (userId, shareToken) => {
  const originalTrip = await prisma.trip.findFirst({
    where: isValidUuid(shareToken)
      ? { OR: [{ shareToken }, { id: shareToken }] }
      : { shareToken },
    include: {

      budget: true,
      stops: {
        orderBy: { sortOrder: 'asc' },
        include: {
          tripActivities: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!originalTrip) {
    const error = new Error('Public trip not found');
    error.statusCode = 404;
    throw error;
  }

  // Perform multi-table INSERT within a single DB transaction
  const clonedTrip = await prisma.$transaction(async (tx) => {
    const newShareToken = `copied-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newTrip = await tx.trip.create({
      data: {
        userId,
        name: `Copy of ${originalTrip.name}`,
        startDate: originalTrip.startDate,
        endDate: originalTrip.endDate,
        description: originalTrip.description,
        coverPhoto: originalTrip.coverPhoto,
        isPublic: false,
        shareToken: newShareToken,
        copiedFromId: originalTrip.id,
      },
    });

    if (originalTrip.budget) {
      await tx.budget.create({
        data: {
          tripId: newTrip.id,
          dailyCap: originalTrip.budget.dailyCap,
          categoryCaps: originalTrip.budget.categoryCaps || {},
        },
      });
    }

    for (const stop of originalTrip.stops) {
      const newStop = await tx.stop.create({
        data: {
          tripId: newTrip.id,
          cityId: stop.cityId,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          sortOrder: stop.sortOrder,
          notes: stop.notes,
        },
      });

      for (const act of stop.tripActivities) {
        await tx.tripActivity.create({
          data: {
            stopId: newStop.id,
            activityId: act.activityId,
            nameSnapshot: act.nameSnapshot,
            costSnapshot: act.costSnapshot,
            categorySnapshot: act.categorySnapshot,
            scheduledDate: act.scheduledDate,
            timeSlot: act.timeSlot,
            sortOrder: act.sortOrder,
            notes: act.notes,
          },
        });
      }
    }

    return tx.trip.findUnique({
      where: { id: newTrip.id },
      include: {
        user: { select: { id: true, name: true, profilePhoto: true } },
        budget: true,
        stops: {
          orderBy: { sortOrder: 'asc' },
          include: {
            city: true,
            tripActivities: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  });

  return clonedTrip;
};

