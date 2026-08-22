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
  console.log('🧪 Starting Phase 3 Backend Integration Tests...\n');

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

    const cityJaipur = await prisma.city.findFirst({ where: { name: 'Jaipur' }, include: { activities: true } });

    const tokenA = generateTestToken(userA.id, userA.email);
    const tokenB = generateTestToken(userB.id, userB.email);

    // Create a public test trip with shareToken
    const publicShareToken = `test-share-token-${Date.now()}`;
    const publicTrip = await prisma.trip.create({
      data: {
        userId: userA.id,
        name: 'Public Royal Rajasthan Shared Tour',
        startDate: new Date('2026-11-01'),
        endDate: new Date('2026-11-10'),
        isPublic: true,
        shareToken: publicShareToken,
        stops: {
          create: {
            cityId: cityJaipur.id,
            arrivalDate: new Date('2026-11-01'),
            departureDate: new Date('2026-11-05'),
            sortOrder: 1,
            tripActivities: {
              create: {
                activityId: cityJaipur.activities[0].id,
                nameSnapshot: cityJaipur.activities[0].name,
                categorySnapshot: cityJaipur.activities[0].category,
                costSnapshot: 1200,
                timeSlot: '09:00',
              },
            },
          },
        },
      },
    });

    // Create a private test trip with shareToken
    const privateShareToken = `test-private-token-${Date.now()}`;
    const privateTrip = await prisma.trip.create({
      data: {
        userId: userA.id,
        name: 'Private Secret Tour',
        startDate: new Date('2026-12-01'),
        endDate: new Date('2026-12-05'),
        isPublic: false,
        shareToken: privateShareToken,
      },
    });

    console.log('\n--- 1. CITY ACTIVITIES ENDPOINT (GET /api/cities/:id/activities) ---');

    // Test 1: Fetch activities for valid city
    let res = await fetch(`${baseUrl}/api/cities/${cityJaipur.id}/activities`);
    const jaipurActivities = await res.json();
    recordResult(
      'Get city activities for valid city',
      res.status === 200 && Array.isArray(jaipurActivities) && jaipurActivities.length > 0,
      res.status,
      200
    );

    // Test 2: Fetch activities for non-existent city
    res = await fetch(`${baseUrl}/api/cities/00000000-0000-0000-0000-000000000000/activities`);
    recordResult('Get city activities for non-existent city (404)', res.status === 404, res.status, 404);

    console.log('\n--- 2. PUBLIC SHARED TRIP ENDPOINT (GET /api/trips/shared/:token) ---');

    // Test 3: Public trip fetched without authentication header
    res = await fetch(`${baseUrl}/api/trips/shared/${publicShareToken}`);
    const sharedData = await res.json();
    const fetchedTrip = sharedData.data?.trip;
    recordResult(
      'Fetch public shared trip without auth',
      res.status === 200 &&
        fetchedTrip?.name === 'Public Royal Rajasthan Shared Tour' &&
        fetchedTrip?.stops?.length > 0 &&
        fetchedTrip?.stops[0]?.tripActivities?.length > 0,
      res.status,
      200
    );

    // Test 4: Private trip cannot be accessed via shared endpoint
    res = await fetch(`${baseUrl}/api/trips/shared/${privateShareToken}`);
    recordResult('Private trip cannot be fetched via shared endpoint (404)', res.status === 404, res.status, 404);

    // Test 5: Non-existent share token
    res = await fetch(`${baseUrl}/api/trips/shared/non-existent-token-xyz`);
    recordResult('Non-existent share token (404)', res.status === 404, res.status, 404);

    console.log('\n--- 3. PUT /api/trips/:id COMPATIBILITY ---');

    // Test 6: Owner updates trip using PUT
    res = await fetch(`${baseUrl}/api/trips/${publicTrip.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        name: 'Updated Public Tour via PUT',
        description: 'Updated with PUT request',
      }),
    });
    const putData = await res.json();
    recordResult(
      'Owner updates trip via PUT',
      res.status === 200 && putData.data?.trip?.name === 'Updated Public Tour via PUT',
      res.status,
      200
    );

    // Test 7: PUT trip update with invalid dates
    res = await fetch(`${baseUrl}/api/trips/${publicTrip.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        startDate: '2026-11-20',
        endDate: '2026-11-10',
      }),
    });
    recordResult('PUT with invalid date range returns 400', res.status === 400, res.status, 400);

    // Test 8: PUT trip update without auth
    res = await fetch(`${baseUrl}/api/trips/${publicTrip.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacked Title' }),
    });
    recordResult('PUT without Authorization returns 401', res.status === 401, res.status, 401);

    // Test 9: PUT trip update by unauthorized user
    res = await fetch(`${baseUrl}/api/trips/${publicTrip.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ name: 'Hacked Title' }),
    });
    recordResult('PUT by non-owner returns 404', res.status === 404, res.status, 404);

    console.log('\n--- 4. PATCH /api/trips/:id COMPATIBILITY (PRESERVED) ---');

    // Test 10: Owner updates trip using PATCH (regression check)
    res = await fetch(`${baseUrl}/api/trips/${publicTrip.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        name: 'Updated Public Tour via PATCH',
      }),
    });
    const patchData = await res.json();
    recordResult(
      'Owner updates trip via PATCH (preserved)',
      res.status === 200 && patchData.data?.trip?.name === 'Updated Public Tour via PATCH',
      res.status,
      200
    );

    // Cleanup test trips
    await prisma.trip.delete({ where: { id: publicTrip.id } });
    await prisma.trip.delete({ where: { id: privateTrip.id } });

    console.log('\n==================================================');
    const passedCount = testResults.filter((r) => r.passed).length;
    console.log(`📊 Phase 3 Integration Tests: ${passedCount}/${testResults.length} PASSED`);
    console.log('==================================================\n');
  } catch (err) {
    console.error('❌ Integration Test Error:', err);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
}

runTests();
