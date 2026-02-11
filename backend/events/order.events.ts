
import { EventEmitter } from 'node:events';
import { OrderStatus } from '@prisma/client';

export interface OrderEvent {
  orderId: string;
  status: OrderStatus;
}

class OrderEmitter extends EventEmitter {
  emitOrderStatusChange(event: OrderEvent) {
    this.emit(event.orderId, event);
  }

  onOrderStatusChange(orderId: string, listener: (event: OrderEvent) => void) {
    this.on(orderId, listener);
  }

  offOrderStatusChange(orderId: string, listener: (event: OrderEvent) => void) {
    this.off(orderId, listener);
  }
}

export const orderEmitter = new OrderEmitter();
