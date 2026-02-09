// import request from 'supertest';
// import { createServer } from 'node:http';
// import {GET as handler} from '@/app/api/menu-items/route';

// const server = createServer((req, res) => handler(req, res));

// describe('GET /api/menu-items', () => {
//   it('returns 200 and menu items', async () => {
//     const res = await request(server).get('/api/menu-items');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body.data)).toBe(true);
//   });

//   it('returns 400 for invalid filter', async () => {
//     const res = await request(server).get('/api/menu-items?invalidField=1');
//     expect(res.status).toBe(400);
//   });
// });

import { GET } from '@/app/api/menu-items/route';
import { testApiHandler } from 'next-test-api-route-handler';

describe('GET /api/menu-items', () => {
  it('returns 200 and menu items', async () => {
    await testApiHandler({
      handler: GET,
      test: async ({ fetch }) => {
        const res = await fetch('/api/menu-items');
        const json = await res.json();

        expect(res.status).toBe(200);
        // Adjust this based on what your handler actually returns
        expect(Array.isArray(json)).toBe(true); 
        // Or if your handler wraps in { data: [...] }
        // expect(Array.isArray(json.data)).toBe(true);
      },
    });
  });

  it('returns 400 for invalid query', async () => {
    await testApiHandler({
      handler: GET,
      url: '/api/menu-items?invalidField=1',
      test: async ({ fetch }) => {
        const res = await fetch('/api/menu-items?invalidField=1');
        expect(res.status).toBe(400);
      },
    });
  });
});
