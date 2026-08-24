async function testTripCreation() {
  console.log("=== Testing Trip Creation Flow ===");
  const baseUrl = 'http://localhost:5000/api';

  // 1. Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'aarav@globetrotter.in',
      password: 'Explorer@2026'
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log("✓ Logged in as Aarav. Token acquired.");

  // 2. Fetch Cities
  const citiesRes = await fetch(`${baseUrl}/cities`);
  const citiesData = await citiesRes.json();
  const cities = citiesData.data?.cities || citiesData.cities || citiesData.data || citiesData;
  const goa = cities.find(c => c.name.toLowerCase() === 'goa') || cities[0];
  console.log(`✓ Found city: ${goa.name} (UUID: ${goa.id})`);

  // 3. Create Trip
  const tripRes = await fetch(`${baseUrl}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Goa Sun & Sand Getaway',
      startDate: '2026-11-01',
      endDate: '2026-11-07',
      description: 'Beach holiday & watersports in Goa',
      coverPhoto: goa.imageUrl,
      isPublic: true
    })
  });

  const tripData = await tripRes.json();
  const trip = tripData.data.trip;
  console.log("✓ Trip Created! ID:", trip.id, "| Name:", trip.name);

  // 4. Add Stop
  const stopRes = await fetch(`${baseUrl}/trips/${trip.id}/stops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cityId: goa.id,
      arrivalDate: '2026-11-01',
      departureDate: '2026-11-07',
      notes: 'South Goa beach stay'
    })
  });

  const stopData = await stopRes.json();
  if (!stopData.data?.stop) {
    console.error("Stop creation failed:", stopData);
    throw new Error("Stop creation error");
  }
  const stop = stopData.data.stop;
  console.log("✓ Stop Added! ID:", stop.id, "| City:", stop.city?.name || stop.cityName);

  // 5. Add Activity if city has activities
  const actRes = await fetch(`${baseUrl}/cities/${goa.id}/activities`);
  const actResData = await actRes.json();
  const actList = actResData.data?.activities || actResData.activities || actResData.data || [];
  if (actList && actList.length > 0) {
    const actToBook = actList[0];
    const addActRes = await fetch(`${baseUrl}/stops/${stop.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        activityId: actToBook.id,
        scheduledDate: '2026-11-02',
        timeSlot: '09:00',
        costSnapshot: Number(actToBook.cost || 2500),
        notes: 'Morning session'
      })
    });
    const addActData = await addActRes.json();
    console.log("✓ Activity Added! ID:", addActData.data.tripActivity.id);
  }

  // 6. Verify User Trips list
  const userTripsRes = await fetch(`${baseUrl}/trips`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const userTripsData = await userTripsRes.json();
  const allTrips = userTripsData.data?.trips || userTripsData;
  const isPresent = allTrips.some(t => t.id === trip.id);
  console.log(`✓ Fetched ${allTrips.length} trips for user. Newly created trip present in list:`, isPresent);

  if (!isPresent) {
    throw new Error("Newly created trip is not present in user's trips list!");
  }

  console.log("=== ALL TRIP CREATION CHECKS PASSED 100%! ===");
}

testTripCreation().catch(err => {
  console.error("❌ Test Failed:", err.stack || err);
  process.exit(1);
});
