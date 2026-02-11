import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";
import MenuItems from "./DBscripts/menuItems";



const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });



async function main() {
  console.log('Seeding menu items with upsert...');

  for (const item of MenuItems) {
    await prisma.menuItem.upsert({
      where: {
        name_cuisine: {
          name: item.name,
          cuisine: item.cuisine,
        },
      },
      update: {
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        isActive: item.isActive,
      },
      create: item,
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
