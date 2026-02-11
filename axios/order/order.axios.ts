import { api } from '../api';
import { Order } from '@prisma/client';

export interface CreateOrderParams {
  customerName: string;
  address: string;
  phone: string;
  items: { menuItemId: string; quantity: number }[];
  totalAmount?: number; 
}

export const createOrder = async (data: CreateOrderParams) => {
    console.log("create order axios")    
  const response = await api.post('/order', data);
  return response.data;
};

export const getOrder = async (orderId: string) => {
  const response = await api.get<Order>(`/order/id/${orderId}`);
  return response.data;
};

export const getOrderByPhone = async (phone: string) => {
  const response = await api.get<Order>(`/order/phone/${phone}`);
  return response.data;
};

