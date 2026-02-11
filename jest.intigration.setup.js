

import { db } from '@/lib/db';
import '@testing-library/jest-dom';
import { execSync } from 'node:child_process';



beforeAll(async () =>{
    console.log('\nSetting up test database...');
  
  
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./database/test.db";
  
  console.log({db: process.env.DATABASE_URL});

  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
  });
  
 
  console.log('Test database is ready.\n');
} )

afterAll( async () => {
   await db.menuItem.deleteMany();
    await db.$disconnect();
    
})
