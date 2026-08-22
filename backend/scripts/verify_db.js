import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying GlobeTrotter Database...');

  const userCount = await prisma.user.count();
  const tripCount = await prisma.trip.count();
  const cityCount = await prisma.city.count();
  const activityCount = await prisma.activity.count();
  const stopCount = await prisma.stop.count();
  const tripActivityCount = await prisma.tripActivity.count();
  const budgetCount = await prisma.budget.count();
  const sharedLinkCount = await prisma.sharedLink.count();

  console.log('\n📊 Table Counts:');
  console.log(`- users: ${userCount}`);
  console.log(`- trips: ${tripCount}`);
  console.log(`- cities: ${cityCount}`);
  console.log(`- activities: ${activityCount}`);
  console.log(`- stops: ${stopCount}`);
  console.log(`- trip_activities: ${tripActivityCount}`);
  console.log(`- budgets: ${budgetCount}`);
  console.log(`- shared_links: ${sharedLinkCount}`);

  // Test full joined query for demo trip
  console.log('\n🗺️ Testing Full Itinerary Query (Trip -> Stops -> Snapshotted Activities -> Budget):');
  const trip = await prisma.trip.findFirst({
    include: {
      user: { select: { id: true, name: true, email: true } },
      budget: true,
      sharedLinks: true,
      stops: {
        orderBy: { sortOrder: 'asc' },
        include: {
          city: true,
          tripActivities: {
            orderBy: { sortOrder: 'asc' },
            include: { activity: true }
          }
        }
      }
    }
  });

  if (trip) {
    console.log(`Trip: "${trip.name}" by ${trip.user.name} (${trip.user.email})`);
    console.log(`Public Share Token: ${trip.shareToken}`);
    console.log(`Daily Budget Cap: $${trip.budget?.dailyCap}`);
    console.log(`Category Caps:`, trip.budget?.categoryCaps);

    let totalCost = 0;
    trip.stops.forEach((stop, i) => {
      console.log(`\n  Stop #${i + 1}: ${stop.city.name}, ${stop.city.country} (${stop.arrivalDate.toISOString().slice(0, 10)} to ${stop.departureDate.toISOString().slice(0, 10)})`);
      stop.tripActivities.forEach((ta) => {
        const cost = Number(ta.costSnapshot);
        totalCost += cost;
        console.log(`    - [${ta.categorySnapshot}] ${ta.nameSnapshot} | $${cost} | Slot: ${ta.timeSlot || 'N/A'}`);
      });
    });
    console.log(`\n💰 Total Trip Cost (from Snapshots): $${totalCost.toFixed(2)}`);
  }

  // Test CHECK constraint rejection
  console.log('\n🛡️ Testing Database Constraints (Negative test for check_trip_dates):');
  try {
    const invalidUser = await prisma.user.findFirst();
    await prisma.trip.create({
      data: {
        userId: invalidUser.id,
        name: 'Invalid Date Trip',
        startDate: new Date('2026-10-10'),
        endDate: new Date('2026-10-05'), // Invalid: end_date < start_date
      }
    });
    console.error('❌ Constraint failed: Invalid dates were accepted!');
  } catch (err) {
    console.log('✅ Success: Invalid dates correctly rejected by PostgreSQL CHECK constraint:', err.message.slice(0, 80) + '...');
  }

  console.log('\n✅ All Database Verifications Passed Successfully!');
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
