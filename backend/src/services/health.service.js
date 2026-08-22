export const getHealthStatus = () => {
  return {
    status: 'healthy',
    service: 'GlobeTrotter Backend API',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
};
