import { copyTripTransaction } from '../src/services/trip.service.js';
import prisma from '../src/db.js';

async function testCopy() {
  const user = await prisma.user.findFirst();
  const trip = await prisma.trip.findFirst({ where: { isPublic: true } });
  console.log('User:', user.id, 'Trip shareToken:', trip.shareToken);
  try {
    const res = await copyTripTransaction(user.id, trip.shareToken);
    console.log('Cloned trip success:', res.id, res.name);
  } catch (err) {
    console.error('Error copying trip:', err);
  }
}

testCopy().then(() => process.exit(0));
