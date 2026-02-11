
import {execSync} from "child_process";

export default async () => {
  console.log('\nSetting up test database...');
  
  // 1. Force the test environment variable if not already set
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./database/test.db";
  
  
  // 2. Push the schema to the database (skipping migrations for speed)
  // --accept-data-loss is required to bypass prompts in a non-interactive shell
  execSync('npx prisma db push --accept-data-loss ', {
    stdio: 'inherit',
  });
  
  console.log('Test database is ready.\n');
};
