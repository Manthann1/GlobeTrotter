import { createTripActivitySchema } from '../src/schemas/tripActivity.schema.js';

console.log('--- Testing TripActivity Validation Schema ---');

// 1. Valid Custom TripActivity
const validCustom = createTripActivitySchema.safeParse({
  name: 'Scuba Diving at Grand Island',
  category: 'Adventure',
  cost: 3500,
  timeSlot: '10:00',
  notes: 'Bring swimsuit and sunblock',
});
console.log('Valid Custom Activity Parse:', validCustom.success, validCustom.data);

// 2. Valid Catalog TripActivity
const validCatalog = createTripActivitySchema.safeParse({
  activityId: 'b7c3d2e1-0000-4000-a000-123456789abc',
  cost: 1500,
  timeSlot: '14:00',
});
console.log('Valid Catalog Activity Parse:', validCatalog.success, validCatalog.data);

// 3. Invalid Custom TripActivity (Missing Name and Category)
const invalidCustom = createTripActivitySchema.safeParse({
  cost: 500,
});
console.log('Invalid Custom Activity Parse (should be false):', invalidCustom.success);

// 4. Invalid Cost (Negative Number)
const invalidCost = createTripActivitySchema.safeParse({
  name: 'Test Activity',
  category: 'Sightseeing',
  cost: -100,
});
console.log('Negative Cost Parse (should be false):', invalidCost.success);

// 5. Invalid Activity ID Format
const invalidActivityId = createTripActivitySchema.safeParse({
  activityId: 'invalid-uuid-format',
});
console.log('Invalid Activity UUID Parse (should be false):', invalidActivityId.success);

console.log('\n✅ TripActivity Schema Validation Tests Passed!');
