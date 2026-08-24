import { z } from 'zod';

export const createTripActivitySchema = z
  .object({
    activityId: z.string().uuid('Invalid activity ID format').optional().nullable(),
    name: z.string().trim().optional(),
    nameSnapshot: z.string().trim().optional(),
    category: z.string().trim().optional(),
    categorySnapshot: z.string().trim().optional(),
    cost: z.coerce.number().min(0, 'Cost cannot be negative').optional(),
    costSnapshot: z.coerce.number().min(0, 'Cost cannot be negative').optional(),
    scheduledDate: z.coerce.date({ invalid_type_error: 'Invalid scheduled date format' }).optional().nullable(),
    timeSlot: z.string().trim().optional().nullable(),
    sortOrder: z.number().int().min(0, 'Sort order must be a non-negative integer').optional().default(0),
    notes: z.string().trim().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.activityId) {
        const hasName = Boolean(data.name || data.nameSnapshot);
        const hasCategory = Boolean(data.category || data.categorySnapshot);
        return hasName && hasCategory;
      }
      return true;
    },
    {
      message: 'Name and Category are required for custom activities',
      path: ['name'],
    }
  );

export const updateTripActivitySchema = z.object({
  nameSnapshot: z.string().trim().optional(),
  categorySnapshot: z.string().trim().optional(),
  costSnapshot: z.coerce.number().min(0, 'Cost cannot be negative').optional(),
  scheduledDate: z.coerce.date({ invalid_type_error: 'Invalid scheduled date format' }).optional().nullable(),
  timeSlot: z.string().trim().optional().nullable(),
  sortOrder: z.number().int().min(0, 'Sort order must be a non-negative integer').optional(),
  notes: z.string().trim().optional().nullable(),
});

