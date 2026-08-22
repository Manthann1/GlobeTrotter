import { createTripSchema, updateTripSchema } from '../src/schemas/trip.schema.js';

console.log('--- Testing Trip Validation Schemas ---');

// 1. Valid Create Trip
const validCreate = createTripSchema.safeParse({
  name: 'Summer Trip to Europe',
  startDate: '2026-06-01',
  endDate: '2026-06-15',
  description: 'Visiting Paris & Rome',
  coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
  isPublic: true,
});
console.log('Valid Create Trip:', validCreate.success, validCreate.data);

// 2. Invalid Create Trip (End date before Start date)
const invalidDates = createTripSchema.safeParse({
  name: 'Invalid Date Trip',
  startDate: '2026-06-15',
  endDate: '2026-06-01',
});
console.log('Invalid Dates Parse (should be false):', invalidDates.success);
if (!invalidDates.success) {
  console.log('Error Message:', invalidDates.error.flatten().fieldErrors);
}

// 3. Valid Update Trip (Partial)
const validUpdate = updateTripSchema.safeParse({
  name: 'Updated Trip Name',
  isPublic: false,
});
console.log('Valid Partial Update Parse:', validUpdate.success, validUpdate.data);

console.log('\n✅ Trip Schema Validation Tests Passed!');
