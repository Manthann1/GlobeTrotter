import { prisma } from '../db.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        createdAt: true,
        _count: {
          select: {
            trips: true,
            savedCities: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalCities = await prisma.city.count();
    const totalActivities = await prisma.activity.count();

    const recentTrips = await prisma.trip.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });

    res.json({
      totalUsers,
      totalTrips,
      totalCities,
      totalActivities,
      recentTrips
    });
  } catch (error) {
    next(error);
  }
};
