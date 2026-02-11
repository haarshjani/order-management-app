/** @jest-environment node */

import { GET } from "@/app/api/menu-items/route";
import { MenuItemService } from "@/backend/services/menu/menu_service";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

 // Mock the service
// jest.mock("@/backend/services/menu/menu_service");

// describe("GET /api/menu-items", () => {
//   let mockFindAll: jest.Mock;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     // Mock the method on the service prototype
//     mockFindAll = (MenuItemService.prototype.findAll as jest.Mock).mockResolvedValue([
//       {
//         id: "1",
//         name: "Dhokla",
//         description: "Steamed gram flour snack",
//         price: 2.99,
//         image_url: "",
//         cuisine: "gujarati",
//         isActive: true,
//       },
//       {
//         id: "2",
//         name: "Khandvi",
//         description: "Rolled gram flour snack with spices",
//         price: 3.49,
//         image_url: "",
//         cuisine: "gujarati",
//         isActive: true,
//       },
//       {
//         id: "3",
//         name: "Undhiyu",
//         description: "Mixed vegetable curry",
//         price: 10.99,
//         image_url: "",
//         cuisine: "gujarati",
//         isActive: true,
//       },
//     ]);
//   });

//   it("should return 200 and list of menu-items", async () => {
//     const req = { nextUrl: new URL("http://localhost/api/menu-items") } as unknown as NextRequest;
//     const res = await GET(req);
//     const json = await res.json();

//     expect(res.status).toBe(200);
//     expect(json[0].name).toBe("Dhokla");
//   });

// //   it("should return 400 for invalid query", async () => {
// //     const req = { nextUrl: new URL("http://localhost/api/menu-items?invalidField=1") } as unknown as NextRequest;
// //     const res = await GET(req);
// //     const json = await res.json();

// //     expect(res.status).toBe(400);
// //     expect(json).toHaveProperty("error");
// //   });
// });

describe("GET /api/menu-items", () => {

  beforeAll(async () => {

    
    await db.menuItem.createMany({data : [
      {
        id: "1",
        name: "Dhokla",
        description: "Steamed gram flour snack",
        price: 2.99,
        image_url: "",
        cuisine: "gujarati",
        isActive: true,
      },
      {
        id: "2",
        name: "Khandvi",
        description: "Rolled gram flour snack with spices",
        price: 3.49,
        image_url: "",
        cuisine: "gujarati",
        isActive: true,
      },
      {
        id: "3",
        name: "Undhiyu",
        description: "Mixed vegetable curry",
        price: 10.99,
        image_url: "",
        cuisine: "gujarati",
        isActive: true,
      },
    ]});
  });

  it("should return 200 and list of menu-items", async () => {
    const req = new NextRequest("http://localhost/api/menu-items") ;
    const res = await GET(req);
    const json = await res.json();


    
    expect(res.status).toBe(200);
    expect(json?.data[0].name).toBe("Dhokla");
  });

   it("should return 200 and list of menu-items with filters and paramaters", async () => {
    const req = new NextRequest("http://localhost/api/menu-items?cuisine=gujarati&page=1&limit=2") ;
    const res = await GET(req);
    const json = await res.json();

    
    expect(res.status).toBe(200);
    expect(json?.data.length).toBeGreaterThan(0);
  });
  it("should return 400 for invalid query", async () => {
    const req = new NextRequest("http://localhost/api/menu-items?invalidField=1");
    const res = await GET(req);
    const json = await res.json();

    console.log({json: JSON.stringify(json)});
    
    expect(res.status).toBe(400);
    expect(json.name).toBe("Error");
  });
});