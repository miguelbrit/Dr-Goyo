
import prisma from './src/utils/prisma.js';

async function clearProfiles() {
  console.log("Deleting all records...");
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.pharmacy.deleteMany({});
  await prisma.laboratory.deleteMany({});
  await prisma.profile.deleteMany({});
  console.log("All records deleted from public schema.");
}

clearProfiles().catch(console.error);
