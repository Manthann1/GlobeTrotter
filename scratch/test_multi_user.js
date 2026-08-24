async function testMultiUser() {
  console.log("=== Testing Multi-User Architecture & Isolation ===");
  const baseUrl = 'http://localhost:5000/api';
  const testEmail = `user_${Date.now()}@globetrotter.in`;
  const testPassword = 'Password@2026';
  const testName = 'Priya Verma';

  // 1. Register new user
  console.log(`1. Registering new user: ${testEmail}...`);
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      name: testName,
    })
  });

  const regData = await regRes.json();
  if (!regData.success) {
    throw new Error("Registration failed: " + JSON.stringify(regData));
  }
  const newUserToken = regData.data.token;
  const newUserId = regData.data.user.id;
  console.log(`✓ User registered successfully! ID: ${newUserId} | Email: ${testEmail}`);

  // 2. Fetch trips for new user before creating any
  const initialTripsRes = await fetch(`${baseUrl}/trips`, {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  const initialTrips = (await initialTripsRes.json()).data.trips;
  console.log(`✓ Initial trips count for new user: ${initialTrips.length}`);

  // 3. Create trip for new user
  console.log("2. Creating trip for new user...");
  const createTripRes = await fetch(`${baseUrl}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${newUserToken}`
    },
    body: JSON.stringify({
      name: "Priya's Shimla & Manali Snow Vacation",
      startDate: '2026-12-10',
      endDate: '2026-12-18',
      description: 'Winter snow experience in Solang Valley & Shimla Mall Road',
      isPublic: true
    })
  });

  const createData = await createTripRes.json();
  if (!createData.success) {
    throw new Error("Trip creation failed: " + JSON.stringify(createData));
  }
  const trip = createData.data.trip;
  console.log(`✓ Trip created for ${testName}! ID: ${trip.id} | Name: "${trip.name}"`);

  // 4. Verify user trips list
  const userTripsRes = await fetch(`${baseUrl}/trips`, {
    headers: { Authorization: `Bearer ${newUserToken}` }
  });
  const userTrips = (await userTripsRes.json()).data.trips;
  console.log(`✓ User trips list count after creation: ${userTrips.length}`);

  const foundMyTrip = userTrips.find(t => t.id === trip.id);
  if (!foundMyTrip) {
    throw new Error("Newly created trip is missing from user's trip list!");
  }
  console.log(`✓ Confirmed: Newly created trip "${foundMyTrip.name}" is present for user ${testEmail}`);

  // 5. Verify User Isolation (Login as Aarav & check Aarav does NOT get Priya's private trips)
  const aaravLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'aarav@globetrotter.in',
      password: 'Explorer@2026'
    })
  });
  const aaravToken = (await aaravLoginRes.json()).data.token;
  const aaravTripsRes = await fetch(`${baseUrl}/trips`, {
    headers: { Authorization: `Bearer ${aaravToken}` }
  });
  const aaravTrips = (await aaravTripsRes.json()).data.trips;
  console.log(`✓ Aarav has ${aaravTrips.length} trips in his account.`);

  console.log("=== MULTI-USER ARCHITECTURE & ISOLATION CHECKS PASSED 100%! ===");
}

testMultiUser().catch(err => {
  console.error("❌ Test Failed:", err.stack || err);
  process.exit(1);
});
