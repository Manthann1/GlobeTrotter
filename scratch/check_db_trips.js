import prisma from '../backend/src/db.js';

async function checkDb() {
  console.log("=== Checking Database Trips ===");
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: { select: { email: true, name: true } }
    }
  });

  console.log(`Found ${trips.length} recent trips in DB:`);
  trips.forEach(t => {
    console.log(`- ID: ${t.id} | Name: "${t.name}" | User: ${t.user?.email || t.userId} | Dates: ${t.startDate.toISOString().slice(0, 10)} to ${t.endDate.toISOString().slice(0, 10)}`);
  });

  await prisma.$disconnect();
}

checkDb().catch(err => {
  console.error(err);
  process.exit(1);
});
