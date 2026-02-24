import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUpdate() {
  const userId = "3537ec5e-34cc-4a73-b591-c651d27c3d92";
  const name = "Juan";
  const surname = "Contreras Actualizado";
  const birthDate = "1981-01-01";
  
  try {
    console.log("Starting test update for userId:", userId);
    
    // 1. Update Profile table
    const updateData: any = {};
    if (name) updateData.name = name;
    if (surname !== undefined) updateData.surname = surname;
    
    const updatedProfile = await prisma.profile.update({
      where: { id: userId },
      data: updateData
    });
    console.log("Profile updated");

    // 2. Update specific entity profile if needed
    if (updatedProfile.type === 'Paciente') {
      console.log("Updating Patient entry...");
      await prisma.patient.upsert({
        where: { profileId: userId },
        update: {
          birthDate: birthDate ? new Date(birthDate) : undefined,
        },
        create: {
          profileId: userId,
          birthDate: birthDate ? new Date(birthDate) : undefined,
        }
      });
      console.log("Patient entry updated/created");
    }

    console.log("Test Success!");
  } catch (error: any) {
    console.error('Update Profile Error Details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
