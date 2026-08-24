import prisma from '../backend/src/db.js';

async function checkCities() {
  const cities = await prisma.city.findMany();
  console.log(`=== ${cities.length} Cities in DB ===`);
  cities.forEach(c => {
    console.log(`- ID: ${c.id} | Name: ${c.name} | Country: ${c.country}`);
  });
  await prisma.$disconnect();
}

checkCities().catch(err => {
  console.error(err);
  process.exit(1);
});
