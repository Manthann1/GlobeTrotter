import { prisma } from '../db.js';

export const getCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { country: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const cities = await prisma.city.findMany({
      where,
      include: {
        activities: {
          take: 6,
        },
      },
      orderBy: { popularityScore: 'desc' },
    });

    res.json(cities);
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    next(error);
  }
};

export const getCityActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const activities = await prisma.activity.findMany({
      where: { cityId: id },
      orderBy: { name: 'asc' },
    });

    res.json(activities);
  } catch (error) {
    next(error);
  }
};
