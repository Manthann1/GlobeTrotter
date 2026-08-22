import { z } from 'zod';

export const createStopSchema = z
  .object({
    cityId: z.string().uuid('Invalid city ID format'),
    arrivalDate: z.coerce.date({ invalid_type_error: 'Invalid arrival date format' }),
    departureDate: z.coerce.date({ invalid_type_error: 'Invalid departure date format' }),
    sortOrder: z.number().int().min(0, 'Sort order must be a non-negative integer').optional().default(0),
    notes: z.string().trim().optional().nullable(),
  })
  .refine((data) => data.departureDate >= data.arrivalDate, {
    message: 'Departure date must be on or after arrival date',
    path: ['departureDate'],
  });
