import { OrderService } from '@/backend/services/order/order.service';
import { OrderRepository } from '@/backend/respositories/order/order.respository';
import { MenuItemService } from '@/backend/services/menu/menu_service';
import { BadRequestError, ForbiddenError } from '@/backend/uitls/errorhadlers/errors';


jest.mock('@/backend/respositories/order/order.respository');
jest.mock('@/backend/services/menu/menu_service');

describe('OrderService - createOrder Validation', () => {
  let orderService: OrderService;
  let mockedRepo: jest.Mocked<OrderRepository>;
  let mockedMenuService: jest.Mocked<MenuItemService>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); 
    
    orderService = new OrderService();
  
    mockedRepo = (OrderRepository as jest.Mock).prototype;
    mockedMenuService = (MenuItemService as jest.Mock).prototype;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

 

  it('should throw BadRequestError if customer info is missing', async () => {
    const incompleteData = {
      customerName: "", 
      address: "123 Street",
      phone: "9876543210",
      totalAmount: 0,
      items: [{ id: "m1", quantity: 1 }]
    };

    await expect(orderService.createOrder(incompleteData as any))
      .rejects.toThrow(BadRequestError);
    
    await expect(orderService.createOrder(incompleteData as any))
      .rejects.toThrow("Missiong customer Info!");
  });

  it('should throw error if items list is empty', async () => {
    const noItemsData = {
      customerName: "Harsh",
      address: "Gujarat",
      phone: "9876543210",
      totalAmount: 0,
      items: [] 
    };

    await expect(orderService.createOrder(noItemsData))
      .rejects.toThrow('Order must have at least one item.');
  });

  it('should throw ForbiddenError if total items exceed MAX_ALLOWED_ITEMS (25)', async () => {
    const tooManyItems = Array(26).fill({ id: "1", quantity: 1 });
    const data = {
      customerName: "Harsh",
      address: "Gujarat",
      phone: "9876543210",
      totalAmount: 0,
      items: tooManyItems
    };

    await expect(orderService.createOrder(data))
      .rejects.toThrow(ForbiddenError);
  });



  it('should throw ForbiddenError if quantity exceeds MenuItem maxAllowedQuantity', async () => {
    const data = {
      customerName: "Harsh",
      address: "Gujarat",
      phone: "9876543210",
      totalAmount: 0,
      items: [{ id: "m1", quantity: 20 }] 
    };

    mockedMenuService.getMenuItemById.mockResolvedValue({
      id: "m1",
      name: "Samosa",
      isActive: true,
      price: 2.0,
      maxAllowedQuantity: 5 
    } as any);

    await expect(orderService.createOrder(data))
      .rejects.toThrow(ForbiddenError);
  });

  it('should calculate totalAmount correctly and call repository with validated data', async () => {
    const data = {
      customerName: "Harsh",
      address: "India",
      phone: "12345",
      totalAmount: 0, 
      items: [
        { id: "item1", quantity: 2 },
        { id: "item2", quantity: 1 }
      ]
    };

    mockedMenuService.getMenuItemById
      .mockResolvedValueOnce({ id: "item1", name: "I1", isActive: true, price: 10, maxAllowedQuantity: 5 } as any)
      .mockResolvedValueOnce({ id: "item2", name: "I2", isActive: true, price: 5, maxAllowedQuantity: 5 } as any);

    mockedRepo.createOrder.mockResolvedValue({ id: "new-order-id", ...data } as any);

    const result = await orderService.createOrder(data);

    expect(mockedRepo.createOrder).toHaveBeenCalledWith(expect.objectContaining({
      totalAmount: 25,
      items: [
        { menuItemId: "item1", quantity: 2, unitPrice: 10 },
        { menuItemId: "item2", quantity: 1, unitPrice: 5 }
      ]
    }));
    
    expect(result.id).toBe("new-order-id");
  });
});
