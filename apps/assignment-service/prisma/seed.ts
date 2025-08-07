import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Отримуємо всі завдання без налаштувань
  const assignmentsWithoutSettings = await prisma.assignment.findMany({
    where: {
      settings: null,
    },
  });

  console.log(
    `Found ${assignmentsWithoutSettings.length} assignments without settings`,
  );

  // Додаємо налаштування за замовчуванням до кожного завдання
  for (const assignment of assignmentsWithoutSettings) {
    await prisma.assignmentSettings.create({
      data: {
        assignmentId: assignment.id,
        timeout: 2000, // 2 секунди за замовчуванням
        maxAttempts: null, // Необмежено за замовчуванням
        passingThreshold: 80.0,
        allowPartialScore: true,
        strictMode: false,
      },
    });
    console.log(`✅ Added default settings to assignment: ${assignment.title}`);
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
