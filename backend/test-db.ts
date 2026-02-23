import prisma from './src/utils/prisma.js';

async function test() {
  try {
    console.log("Testing DB connection...");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Connection successful, found users:", users.length);
  } catch (error: any) {
    console.error("DB Test Error Code:", error.code);
    console.error("DB Test Error Message:", error.message);
    if (error.meta) console.error("DB Test Error Meta:", error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

test();
