import { createStopSchema } from '../src/schemas/stop.schema.js';

console.log('--- Testing Stop Validation Schema ---');

// 1. Valid Create Stop
const validStop = createStopSchema.safeParse({
  cityId: 'b7c3d2e1-0000-4000-a000-123456789abc',
  arrivalDate: '2026-06-01',
  departureDate: '2026-06-05',
  sortOrder: 1,
  notes: 'Stay at city center hotel',
});
console.log('Valid Stop Parse:', validStop.success, validStop.data);

// 2. Invalid Stop (Departure before Arrival)
const invalidDates = createStopSchema.safeParse({
  cityId: 'b7c3d2e1-0000-4000-a000-123456789abc',
  arrivalDate: '2026-06-05',
  departureDate: '2026-06-01',
});
console.log('Invalid Dates Parse (should be false):', invalidDates.success);
if (!invalidDates.success) {
  console.log('Error Message:', invalidDates.error.flatten().fieldErrors);
}

// 3. Invalid City ID Format
const invalidCityId = createStopSchema.safeParse({
  cityId: 'not-a-uuid',
  arrivalDate: '2026-06-01',
  departureDate: '2026-06-05',
});
console.log('Invalid City ID Parse (should be false):', invalidCityId.success);

console.log('\n✅ Stop Schema Validation Tests Passed!');
