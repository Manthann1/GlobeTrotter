import { prisma } from '../db.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get catalog activities with filters: cityId, category, maxCost, query
 */
export const getActivities = async (req, res, next) => {
  try {
    const { cityId, category, maxCost, query, q } = req.query;

    const searchStr = query || q;

    const where = {
      ...(cityId && { cityId }),
      ...(category && { category: { equals: category, mode: 'insensitive' } }),
      ...(maxCost !== undefined && maxCost !== '' && { cost: { lte: Number(maxCost) } }),
      ...(searchStr && {
        OR: [
          { name: { contains: searchStr, mode: 'insensitive' } },
          { description: { contains: searchStr, mode: 'insensitive' } },
        ],
      }),
    };

    const activities = await prisma.activity.findMany({
      where,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'Activities retrieved successfully',
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};
