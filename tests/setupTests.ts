// setupTests.js
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { db } from '@/lib/db';

beforeAll(async () => {
  await db.$connect();


});


beforeEach(async () => {
  await db.menuItem.deleteMany();
   await db.menuItem.createMany({
    data: [
    { name: 'Dhokla', description: 'Steamed gram flour snack', price: 2.99, image_url: '', cuisine: 'gujarati', isActive: true },
  { name: 'Khandvi', description: 'Rolled gram flour snack with spices', price: 3.49, image_url: '', cuisine: 'gujarati', isActive: true },
  { name: 'Undhiyu', description: 'Mixed vegetable curry', price: 10.99, image_url: '', cuisine: 'gujarati', isActive: true },
  { name: 'Thepla', description: 'Spiced flatbread', price: 4.49, image_url: '', cuisine: 'gujarati', isActive: true },
  { name: 'Fafda', description: 'Crispy gram flour snack', price: 2.99, image_url: '', cuisine: 'gujarati', isActive: true },
  { name: 'Handvo', description: 'Savory vegetable cake', price: 5.49, image_url: '', cuisine: 'gujarati', isActive: true },
    ],
  });
});

afterAll(async () => {
  await db.$disconnect();
});

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

