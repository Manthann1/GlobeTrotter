import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { prisma } from '../db.js';

/**
 * Controller to handle user registration
 */
export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const authData = await registerUser(parseResult.data);

    return successResponse(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle user login
 */
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const authData = await loginUser(parseResult.data);

    return successResponse(res, {
      statusCode: 200,
      message: 'Login successful',
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get current authenticated user profile
 */
export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, {
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update current authenticated user profile
 */
export const updateMe = async (req, res, next) => {
  try {
    const { name, email, profilePhoto } = req.body;
    
    // In a real app we would validate, but let's just update directly for now
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(profilePhoto && { profilePhoto }),
      }
    });
    
    // Strip passwordHash before sending back
    const { passwordHash, ...safeUser } = updatedUser;

    return successResponse(res, {
      statusCode: 200,
      message: 'User profile updated successfully',
      data: { user: safeUser },
    });
  } catch (error) {
    next(error);
  }
};
