import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

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
