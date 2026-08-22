const fs = require('fs');
let content = fs.readFileSync('./backend/prisma/seed.js', 'utf-8');

// Change one trip's date to August 2026 (Trip 1: Royal Rajasthan)
content = content.replace(/new Date\('2026-10-15'\)/g, "new Date('2026-08-15')");
content = content.replace(/new Date\('2026-10-16'\)/g, "new Date('2026-08-16')");
content = content.replace(/new Date\('2026-10-17'\)/g, "new Date('2026-08-17')");
content = content.replace(/new Date\('2026-10-18'\)/g, "new Date('2026-08-18')");
content = content.replace(/new Date\('2026-10-19'\)/g, "new Date('2026-08-19')");
content = content.replace(/new Date\('2026-10-20'\)/g, "new Date('2026-08-20')");
content = content.replace(/new Date\('2026-10-21'\)/g, "new Date('2026-08-21')");
content = content.replace(/new Date\('2026-10-22'\)/g, "new Date('2026-08-22')");
content = content.replace(/new Date\('2026-10-23'\)/g, "new Date('2026-08-23')");
content = content.replace(/new Date\('2026-10-24'\)/g, "new Date('2026-08-24')");
content = content.replace(/new Date\('2026-10-25'\)/g, "new Date('2026-08-25')");
content = content.replace(/new Date\('2026-10-26'\)/g, "new Date('2026-08-26')");
content = content.replace(/new Date\('2026-10-27'\)/g, "new Date('2026-08-27')");

// Create more users and trips for the community
const moreUsersAndTrips = `
  const user3 = await prisma.user.create({
    data: { name: 'Priya Patel', email: 'priya@globetrotter.in', passwordHash: 'hashed_password' }
  });
  const user4 = await prisma.user.create({
    data: { name: 'Rohan Gupta', email: 'rohan@globetrotter.in', passwordHash: 'hashed_password' }
  });
  
  await prisma.trip.create({
    data: {
      userId: user3.id,
      name: 'Spiritual Retreat in Varanasi',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-05'),
      description: 'A 5-day journey through the ancient ghats.',
      coverPhoto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/960px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg',
      isPublic: true
    }
  });
  
  await prisma.trip.create({
    data: {
      userId: user4.id,
      name: 'Dubai Luxury Escape',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-08'),
      description: 'Shopping and skyscrapers in the UAE.',
      coverPhoto: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/960px-Burj_Khalifa_2021.jpg',
      isPublic: true
    }
  });
`;

if (!content.includes('Priya Patel')) {
  content = content.replace('// 6. Create shared links', moreUsersAndTrips + '\n  // 6. Create shared links');
}

fs.writeFileSync('./backend/prisma/seed.js', content);
console.log('Seed file updated successfully.');
