import { z } from 'zod';

export const createTripSchema = z
  .object({
    name: z.string().trim().min(1, 'Trip name is required').max(200, 'Trip name must be 200 characters or less'),
    startDate: z.coerce.date({ invalid_type_error: 'Invalid start date format' }),
    endDate: z.coerce.date({ invalid_type_error: 'Invalid end date format' }),
    description: z.string().trim().optional().nullable(),
    coverPhoto: z.string().trim().optional().nullable(),
    isPublic: z.boolean().optional().default(false),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const updateTripSchema = z
  .object({
    name: z.string().trim().min(1, 'Trip name cannot be empty').max(200, 'Trip name must be 200 characters or less').optional(),
    startDate: z.coerce.date({ invalid_type_error: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ invalid_type_error: 'Invalid end date format' }).optional(),
    description: z.string().trim().optional().nullable(),
    coverPhoto: z.string().trim().optional().nullable(),
    isPublic: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );
