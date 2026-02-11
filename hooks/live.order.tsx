//hooks/live.order.tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Order } from '@prisma/client';

type OrderSSEEvent = {
  orderId: string;
  status: Order['status'];
};

export enum OrderStatus {
    PENDING = "PENDING",
    PREPARING= "PREPARING",
    OUT_FOR_DELIVERY= "OUT_FOR_DELIVERY",
    DELIVERED= "DELIVERED",
    CANCELLED= "CANCELLED",
}


export const useOrderLiveUpdates = (orderId: string, phone?: string, status? : string) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
   

    if ( !orderId ||status === OrderStatus.CANCELLED || status === OrderStatus.DELIVERED) return;

    const source = new EventSource(`/api/order/live/${orderId}`);

    source.onmessage = (event) => {
      const data: OrderSSEEvent = JSON.parse(event.data);

      console.log("event data", {data});
      
     queryClient.setQueryData<Order[]>(
        ['orders', phone],
        (old) => {
          if (!old) return old;

          return old.map((order) =>
            order.id === orderId
              ? { ...order, status: data.status }
              : order
          );
        }
      );
      if (
    data.status === OrderStatus.DELIVERED ||
    data.status === OrderStatus.CANCELLED
  ) {
    source.close();
  }
    };

    source.onerror = (e) => {
      console.error('EventSource error',e);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [orderId, queryClient, phone, status]);
};
