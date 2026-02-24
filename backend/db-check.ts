import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('--- DIAGNOSTICO DE DATOS PENDIENTES ---');
  try {
    const doctors = await (prisma.doctor as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } });
    const pharmacies = await (prisma.pharmacy as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } });
    const labs = await (prisma.laboratory as any).findMany({ where: { status: 'PENDING' }, include: { profile: true } });

    console.log(`Doctores: ${doctors.length}`);
    doctors.forEach((d: any) => console.log(` - ${d.profile?.name} (${d.profile?.email})` + (d.status === 'PENDING' ? ' [PENDING]' : '')));

    console.log(`Farmacias: ${pharmacies.length}`);
    pharmacies.forEach((p: any) => console.log(` - ${p.businessName || p.profile?.name} (${p.profile?.email})`));

    console.log(`Laboratorios: ${labs.length}`);
    labs.forEach((l: any) => console.log(` - ${l.businessName || l.profile?.name} (${l.profile?.email})`));

    console.log('Total:', doctors.length + pharmacies.length + labs.length);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
