import jwt from 'jsonwebtoken';
import { getUserById } from '../services/auth.service.js';
import { errorResponse } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_super_secure_jwt_secret_dev_key_2026';

/**
 * Middleware to authenticate requests using JWT Bearer token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: 'Authentication token missing.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return errorResponse(res, {
        statusCode: 403,
        message: err.name === 'TokenExpiredError' ? 'Token has expired. Please log in again.' : 'Invalid authentication token.',
      });
    }

    const user = await getUserById(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware for optional authentication.
 * Attaches req.user if a valid Bearer token is provided, but continues without error if no token or an invalid token is provided.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await getUserById(decoded.userId);
      req.user = user || null;
    } catch (err) {
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to require Admin authorization
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Authentication required.',
    });
  }

  const isAdmin = req.user.role === 'ADMIN' || req.user.isAdmin === true || req.user.email === 'admin@globetrotter.in';

  if (!isAdmin) {
    return errorResponse(res, {
      statusCode: 403,
      message: 'Access denied. Admin authorization required.',
    });
  }

  next();
};

