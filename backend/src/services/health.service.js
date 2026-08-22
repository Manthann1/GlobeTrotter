import prisma from '../db.js';

export const getHealthStatus = async () => {
  let dbStatus = 'disconnected';
  let stats = null;

  try {
    const [cityCount, activityCount] = await Promise.all([
      prisma.city.count(),
      prisma.activity.count(),
    ]);
    dbStatus = 'connected';
    stats = {
      cities: cityCount,
      activities: activityCount,
    };
  } catch (error) {
    dbStatus = `error: ${error.message}`;
  }

  return {
    status: 'healthy',
    service: 'GlobeTrotter Backend API',
    database: dbStatus,
    stats,
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  };
};
