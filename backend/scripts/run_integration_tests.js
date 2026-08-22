import app from '../src/app.js';
import prisma from '../src/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_super_secure_jwt_secret_dev_key_2026';

let server;
let baseUrl;

function generateTestToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
}

async function runTests() {
  console.log('🧪 Starting Stop Endpoints HTTP Integration Tests...\n');

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
    // 1. Fetch seed user A (Aarav) and seed city (Goa)
    const userA = await prisma.user.findFirst({ where: { email: 'aarav@globetrotter.in' } });
    const userB = await prisma.user.findFirst({ where: { email: 'admin@globetrotter.in' } });
    const cityGoa = await prisma.city.findFirst({ where: { name: 'Goa' } });

    // Create a dedicated trip for User A
    const tripA = await prisma.trip.create({
      data: {
        userId: userA.id,
        name: 'Integration Test Trip A',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-10'),
      },
    });

    const tokenA = generateTestToken(userA.id, userA.email);
    const tokenB = generateTestToken(userB.id, userB.email);

    console.log('\n--- 1. Authentication Integration Tests ---');

    // Auth Test 1: Request without Authorization header
    let res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityId: cityGoa.id, arrivalDate: '2026-09-01', departureDate: '2026-09-05' }),
    });
    recordResult('Missing Authorization Header', res.status === 401, res.status, 401);

    // Auth Test 2: Request with invalid JWT
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_jwt_token_string',
      },
      body: JSON.stringify({ cityId: cityGoa.id, arrivalDate: '2026-09-01', departureDate: '2026-09-05' }),
    });
    recordResult('Invalid JWT Bearer Token', res.status === 403, res.status, 403);

    console.log('\n--- 2. POST /api/trips/:tripId/stops Integration Tests ---');

    // POST Test 1: Authenticated owner successfully creates a stop
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        cityId: cityGoa.id,
        arrivalDate: '2026-09-01',
        departureDate: '2026-09-05',
        notes: 'Hotel on Calangute beach',
      }),
    });
    const createdData = await res.json();
    const createdStop = createdData.data?.stop;
    recordResult(
      'Owner creates stop for own trip',
      res.status === 201 && createdStop?.city?.name === 'Goa',
      res.status,
      201
    );

    // POST Test 2: Non-existent trip
    res = await fetch(`${baseUrl}/api/trips/00000000-0000-0000-0000-000000000000/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ cityId: cityGoa.id, arrivalDate: '2026-09-01', departureDate: '2026-09-05' }),
    });
    recordResult('Non-existent trip ID', res.status === 404, res.status, 404);

    // POST Test 3: Authenticated user cannot create stop in another user\'s trip
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ cityId: cityGoa.id, arrivalDate: '2026-09-01', departureDate: '2026-09-05' }),
    });
    recordResult('User B creates stop in User A trip (Forbidden)', res.status === 404, res.status, 404);

    // POST Test 4: Non-existent city
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        cityId: '00000000-0000-0000-0000-000000000000',
        arrivalDate: '2026-09-01',
        departureDate: '2026-09-05',
      }),
    });
    recordResult('Non-existent city ID', res.status === 404, res.status, 404);

    // POST Test 5: Invalid cityId format
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        cityId: 'not-a-valid-uuid',
        arrivalDate: '2026-09-01',
        departureDate: '2026-09-05',
      }),
    });
    recordResult('Invalid cityId UUID format', res.status === 400, res.status, 400);

    // POST Test 6: Invalid arrival/departure dates
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        cityId: cityGoa.id,
        arrivalDate: 'not-a-date',
        departureDate: '2026-09-05',
      }),
    });
    recordResult('Invalid date string format', res.status === 400, res.status, 400);

    // POST Test 7: arrivalDate after departureDate
    res = await fetch(`${baseUrl}/api/trips/${tripA.id}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        cityId: cityGoa.id,
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-05',
      }),
    });
    recordResult('arrivalDate after departureDate', res.status === 400, res.status, 400);

    console.log('\n--- 3. DELETE /api/stops/:id Integration Tests ---');

    // DELETE Test 1: Non-existent stop
    res = await fetch(`${baseUrl}/api/stops/00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    recordResult('Delete non-existent stop ID', res.status === 404, res.status, 404);

    // DELETE Test 2: User B cannot delete User A\'s stop
    res = await fetch(`${baseUrl}/api/stops/${createdStop.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    recordResult('User B deletes User A stop (Forbidden)', res.status === 403, res.status, 403);

    // DELETE Test 3: Authenticated owner deletes their own stop
    res = await fetch(`${baseUrl}/api/stops/${createdStop.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    recordResult('Owner deletes own stop', res.status === 200, res.status, 200);

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
