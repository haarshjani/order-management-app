// services/order.service.ts
import { orderEmitter } from '@/backend/events/order.events';
import { OrderRepository } from '@/backend/respositories/order/order.respository';
import { MenuItemService } from '@/backend/services/menu/menu_service';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/backend/uitls/errorhadlers/errors';
import { OrderStatus } from '@prisma/client';

const MAX_ALLOWED_ITEMS = 25;

export class OrderService {
  private orderRepo = new OrderRepository();
  private menuItemService = new MenuItemService();

  private async simulateStatusFlow(orderId: string) {
    const statusFlow: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    for (const status of statusFlow) {
      await this.orderRepo.updateOrderStatus(orderId, status);
     
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Create order with item validation
  async createOrder(data: {
    customerName: string;
    address: string;
    phone: string;
    totalAmount: number;
    items: { id: string; quantity: number }[];
  }) {
    if(!data.customerName || !data.address || !data.phone){
        throw new BadRequestError("Missiong customer Info!")
    }
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must have at least one item.');
    }

    if(data.items.length > MAX_ALLOWED_ITEMS){
      throw new ForbiddenError(`Maximu Allowed Items are ${MAX_ALLOWED_ITEMS}`);
    }
    // Rebuild items array with validated unitPrice
    const validatedItems = [];

    for (const item of data.items) {
      const menuItem = await this.menuItemService.getMenuItemById(item.id);

      if (!menuItem.isActive) {
        throw new BadRequestError(`MenuItem "${menuItem.name}" is currently inactive.`);
      }

      if (item.quantity > Number(menuItem.maxAllowedQuantity)) {
        throw new ForbiddenError(
          `Quantity for "${menuItem.name}" exceeds max allowed (${menuItem.maxAllowedQuantity}).`,
          {id:menuItem?.id,
            maxAllowedQuantity : `exceeds max allowed (${menuItem.maxAllowedQuantity})` 
          }
        );
      }

      validatedItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: Number(menuItem.price), 
      });
    }

    const totalAmount = validatedItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const order = await this.orderRepo.createOrder({
      customerName: data.customerName,
      address: data.address,
      phone: data.phone,
      totalAmount,
      items: validatedItems,
    });

    
    this.simulateStatusFlow(order.id);

    return order;
  }

  // Update only order status
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepo.updateOrderStatus(orderId, status);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepo.getOrderById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

   async getOrderByIdLive(
    orderId: string,
    onUpdate: (event: { orderId: string; status: OrderStatus }) => void
  ) {
    const order = await this.getOrderById(orderId);

    const listener = (event: { orderId: string; status: OrderStatus }) => {
      onUpdate(event);
    };

    orderEmitter.onOrderStatusChange(orderId, listener);

    return () => {
      orderEmitter.offOrderStatusChange(orderId, listener);
    };
  }
  async getAllOrderByPhone(phone: string) {
    const orders = await this.orderRepo.getAllOrderByPhone(phone);
    if (orders.length === 0) throw new NotFoundError('Orders not found');
    return orders;
  }
 
  async updateOrder(orderId: string, data: Partial<{
    customerName: string;
    address: string;
    phone: string;
    totalAmount: number;
    status: OrderStatus;
  }>) {
    const order = await this.orderRepo.updateOrder(orderId, data);
    if (!order) throw new NotFoundError('Order not found');

    orderEmitter.emitOrderStatusChange({ orderId, status });
    return order;
  }
}
