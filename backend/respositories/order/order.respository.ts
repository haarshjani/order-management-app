// repositories/order.repository.ts
import { Order, OrderStatus } from '@prisma/client';
import { db } from '@/lib/db';


export class OrderRepository {
  async createOrder(data: {
    customerName: string;
    address: string;
    phone: string;
    totalAmount: number;
    items: { menuItemId: string; quantity: number; unitPrice: number }[];
  }): Promise<Order> {
    return db.order.create({
      data: {
        customerName: data.customerName,
        address: data.address,
        phone: data.phone,
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    return db.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return db.order.findUnique({
      where: { id: orderId },
      include: { items: {include: {
        menuItem: true, 
      }, },}
    });
  }

  async getAllOrderByPhone(phone: string): Promise<Order[]> {
    return db.order.findMany({
      where: { phone },
      orderBy: { updatedAt: 'desc' },
      include: { items: {include: {
        menuItem: true, 
      }, },}
    });
  }

  async updateOrder(
    orderId: string,
    data: Partial<{
      customerName: string;
      address: string;
      phone: string;
      totalAmount: number;
      status: OrderStatus;
    }>
  ): Promise<Order | null> {
    return db.order.update({
      where: { id: orderId },
      data,
      include: { items: true },
    });
  }
}
