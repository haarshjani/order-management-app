// services/order.query.ts
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  createOrder ,
  getOrder ,
  CreateOrderParams,
  getOrderByPhone
} from '@/axios/order/order.axios';
import { Order } from '@prisma/client';
import { useOrderLiveUpdates } from '../hooks/live.order';


// ---- CREATE ORDER ----
export const useCreateOrder = () => {
  return useMutation<Order, Error, CreateOrderParams>({
    mutationFn: (data) => createOrder(data),
  });
};

// ---- GET ORDER  ----
export const useOrder = (
  orderId: string,
  options?: UseQueryOptions<Order, Error, Order, ['order', string]>
) => {
  return useQuery<Order, Error, Order, ['order', string]>({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    ...options,
  } as UseQueryOptions<Order, Error, Order, ['order', string]>);
};

// ---- GET ORDER (for live updates by polling) ----
export const useOrderByIdPolling = (
  orderId: string,
  options?: UseQueryOptions<Order, Error, Order, ['order', string]>
) => {
  return useQuery<Order, Error, Order, ['order', string]>({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    refetchInterval:5500,
    enabled : !!orderId && options?.enabled,
    ...options,
  } as UseQueryOptions<Order, Error, Order, ['order', string]>);
};

export const useOrdersByPhone = (
  phone: string,
  options?: UseQueryOptions<Order, Error, Order, ['phone', string]>
) => {
  return useQuery<Order, Error, Order, ['order', string]>({
    queryKey: ['order', phone],
    queryFn: () => getOrderByPhone(phone),
    ...options,
  } as UseQueryOptions<Order, Error, Order, ['order', string]>);
};

export const useOrderWithLiveUpdates = (orderId: string, phone: string, status: string) => {
  const query = useOrdersByPhone(phone);

  useOrderLiveUpdates(orderId, phone , status);

  return query;
};