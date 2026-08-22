import app from '../src/app.js';
import prisma from '../src/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_super_secure_jwt_secret_dev_key_2026';

let server;
let baseUrl;

function generateTestToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
}

async function runTests() {
  console.log('🧪 Starting TripActivity Endpoints Integration Tests...\n');

  // Start server on random port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`📡 Test Express server running on ${baseUrl}`);
      resolve();
    });
  });

  const testResults = [];

  function recordResult(name, passed, status, expectedStatus, details = null) {
    const result = { name, passed, status, expectedStatus, details };
    testResults.push(result);
    const icon = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} | ${name} | Got Status: ${status} (Expected: ${expectedStatus})`);
    if (details) console.log(`   Details: ${JSON.stringify(details)}`);
  }

  try {
    // 1. Fetch seed users and cities
    const userA = await prisma.user.findFirst({ where: { email: 'aarav@globetrotter.in' } });
    const userB = await prisma.user.findFirst({ where: { email: 'admin@globetrotter.in' } });

    const cityGoa = await prisma.city.findFirst({ where: { name: 'Goa' }, include: { activities: true } });
    const cityJaipur = await prisma.city.findFirst({ where: { name: 'Jaipur' }, include: { activities: true } });

    const activityGoa = cityGoa.activities[0];
    const activityJaipur = cityJaipur.activities[0];

    // Create a dedicated trip & stop for User A in Goa
    const tripA = await prisma.trip.create({
      data: {
        userId: userA.id,
        name: 'Activity Integration Test Trip',
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-10'),
      },
    });

    const stopA = await prisma.stop.create({
      data: {
        tripId: tripA.id,
        cityId: cityGoa.id,
        arrivalDate: new Date('2026-10-01'),
        departureDate: new Date('2026-10-05'),
        sortOrder: 1,
      },
    });

    const tokenA = generateTestToken(userA.id, userA.email);
    const tokenB = generateTestToken(userB.id, userB.email);

    console.log('\n--- 1. CREATE TRIP ACTIVITY (POST /api/stops/:stopId/activities) ---');

    // Test 1: Missing Authorization Header
    let res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Scuba Diving', category: 'Adventure', cost: 3500 }),
    });
    recordResult('Missing Authorization Header', res.status === 401, res.status, 401);

    // Test 2: Invalid JWT
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_jwt_token',
      },
      body: JSON.stringify({ name: 'Scuba Diving', category: 'Adventure', cost: 3500 }),
    });
    recordResult('Invalid JWT Token', res.status === 403, res.status, 403);

    // Test 3: Owner creates catalog activity successfully
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        activityId: activityGoa.id,
        timeSlot: '10:00 AM',
      }),
    });
    const catalogActData = await res.json();
    const createdCatalogAct = catalogActData.data?.tripActivity;
    recordResult(
      'Owner creates catalog activity successfully',
      res.status === 201 && createdCatalogAct?.nameSnapshot === activityGoa.name,
      res.status,
      201
    );

    // Test 4: Owner creates custom activity successfully
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        name: 'Custom Sunset Beach Walk',
        category: 'Leisure',
        cost: 0,
        timeSlot: '18:00',
        notes: 'Calangute Beach sunset',
      }),
    });
    const customActData = await res.json();
    const createdCustomAct = customActData.data?.tripActivity;
    recordResult(
      'Owner creates custom activity successfully',
      res.status === 201 && createdCustomAct?.nameSnapshot === 'Custom Sunset Beach Walk',
      res.status,
      201
    );

    // Test 5: Non-existent stop
    res = await fetch(`${baseUrl}/api/stops/00000000-0000-0000-0000-000000000000/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ name: 'Test', category: 'Test', cost: 100 }),
    });
    recordResult('Non-existent stop ID', res.status === 404, res.status, 404);

    // Test 6: Another user attempts to add activity to another user\'s stop
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ name: 'Test', category: 'Test', cost: 100 }),
    });
    recordResult('User B adds activity to User A stop (Forbidden)', res.status === 403, res.status, 403);

    // Test 7: Non-existent activityId
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ activityId: '00000000-0000-0000-0000-000000000000' }),
    });
    recordResult('Non-existent activityId', res.status === 404, res.status, 404);

    // Test 8: activityId belonging to a different city than the stop (Jaipur activity on Goa stop)
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ activityId: activityJaipur.id }),
    });
    recordResult('Activity belonging to a different city', res.status === 400, res.status, 400);

    // Test 9: Invalid activityId UUID format
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ activityId: 'not-a-uuid' }),
    });
    recordResult('Invalid activityId UUID format', res.status === 400, res.status, 400);

    // Test 10: Invalid cost string
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ name: 'Test', category: 'Test', cost: 'not-a-number' }),
    });
    recordResult('Invalid cost type', res.status === 400, res.status, 400);

    // Test 11: Negative cost
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ name: 'Test', category: 'Test', cost: -500 }),
    });
    recordResult('Negative cost', res.status === 400, res.status, 400);

    // Test 12: Invalid scheduledDate
    res = await fetch(`${baseUrl}/api/stops/${stopA.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ name: 'Test', category: 'Test', cost: 100, scheduledDate: 'invalid-date' }),
    });
    recordResult('Invalid scheduledDate format', res.status === 400, res.status, 400);

    console.log('\n--- 2. DELETE TRIP ACTIVITY (DELETE /api/trip-activities/:id) ---');

    // DELETE Test 1: Missing Authorization Header
    res = await fetch(`${baseUrl}/api/trip-activities/${createdCatalogAct.id}`, {
      method: 'DELETE',
    });
    recordResult('Missing Authorization Header on Delete', res.status === 401, res.status, 401);

    // DELETE Test 2: Invalid JWT
    res = await fetch(`${baseUrl}/api/trip-activities/${createdCatalogAct.id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer invalid_token' },
    });
    recordResult('Invalid JWT Token on Delete', res.status === 403, res.status, 403);

    // DELETE Test 3: Non-existent TripActivity ID
    res = await fetch(`${baseUrl}/api/trip-activities/00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    recordResult('Delete non-existent TripActivity ID', res.status === 404, res.status, 404);

    // DELETE Test 4: User B attempts to delete User A\'s TripActivity
    res = await fetch(`${baseUrl}/api/trip-activities/${createdCatalogAct.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    recordResult('User B deletes User A TripActivity (Forbidden)', res.status === 403, res.status, 403);

    // DELETE Test 5: Owner deletes own TripActivity
    res = await fetch(`${baseUrl}/api/trip-activities/${createdCatalogAct.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    recordResult('Owner deletes own TripActivity', res.status === 200, res.status, 200);

    // Clean up test trip
    await prisma.trip.delete({ where: { id: tripA.id } });

    console.log('\n==================================================');
    const passedCount = testResults.filter((r) => r.passed).length;
    console.log(`📊 Integration Test Results: ${passedCount}/${testResults.length} PASSED`);
    console.log('==================================================\n');
  } catch (err) {
    console.error('❌ Integration Test Error:', err);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
}

runTests();
