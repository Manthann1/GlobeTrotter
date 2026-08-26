import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be at most 100 characters'),
  phone: z.string().max(30).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  profilePhoto: z.string().optional().nullable(),
  languagePref: z.string().length(2, 'Language code must be 2 characters (e.g. en)').optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
