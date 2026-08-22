import { prisma } from '../db.js';

export const getTrips = async (req, res, next) => {
  try {
    const isPublic = req.query.public === 'true';
    const where = isPublic ? { isPublic: true } : { userId: req.user.id };

    const trips = await prisma.trip.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, profilePhoto: true } },
        budget: true,
        stops: {
          orderBy: { sortOrder: 'asc' },
          include: {
            city: true,
            tripActivities: {
              orderBy: { sortOrder: 'asc' },
              include: { activity: true },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, profilePhoto: true } },
        budget: true,
        sharedLinks: true,
        stops: {
          orderBy: { sortOrder: 'asc' },
          include: {
            city: true,
            tripActivities: {
              orderBy: { sortOrder: 'asc' },
              include: { activity: true },
            },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const getTripByShareToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const trip = await prisma.trip.findFirst({
      where: {
        OR: [{ shareToken: token }, { id: token }],
      },
      include: {
        user: { select: { id: true, name: true, email: true, profilePhoto: true } },
        budget: true,
        stops: {
          orderBy: { sortOrder: 'asc' },
          include: {
            city: true,
            tripActivities: {
              orderBy: { sortOrder: 'asc' },
              include: { activity: true },
            },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Shared itinerary not found' });
    }

    // Increment shared link view count if exists
    try {
      await prisma.sharedLink.updateMany({
        where: { shareToken: token },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      // ignore
    }

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const { name, startDate, endDate, description, coverPhoto, isPublic, totalBudget, dailyCap } = req.body;
    
    // Find or create default user for demo
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Alex Explorer',
          email: 'alex.explorer@globetrotter.io',
          passwordHash: 'seeded_hash',
        }
      });
    }

    const shareToken = `trip-${Date.now()}`;

    const newTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        coverPhoto,
        isPublic: isPublic ?? true,
        shareToken,
        budget: {
          create: {
            dailyCap: dailyCap ? Number(dailyCap) : null,
            categoryCaps: {},
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true, profilePhoto: true } },
        budget: true,
        stops: true,
      },
    });

    res.status(201).json(newTrip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};
