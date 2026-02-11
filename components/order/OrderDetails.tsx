
import { useOrderByIdPolling, useOrderWithLiveUpdates } from "@/query/order.query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Order, OrderStatus } from "@prisma/client"
import { Label } from "../ui/label";
import { useEffect, useState } from "react";



const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Order Placed", color: "bg-yellow-100 text-yellow-800" },
  PREPARING: { label: "Preparing", color: "bg-blue-100 text-blue-800" },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-purple-100 text-purple-800",
  },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
};

export interface OrderDetailsPropsTypes{
    order : Order;
}

export const OrderDetails  = ({order } :OrderDetailsPropsTypes) => {

   //useOrderWithLiveUpdates(order.id, order?.phone,order.status);

   const [currentOrder, setCurrentOrder] = useState(order)

     const {data : liveOrderPolling, isLoading} = useOrderByIdPolling(order?.id,{
      enabled : currentOrder.status !== OrderStatus.DELIVERED && 
                currentOrder.status !== OrderStatus.CANCELLED
     })
 
  
    useEffect(() => {
      if(liveOrderPolling?.data){
        setCurrentOrder(liveOrderPolling?.data)
      }
    },[liveOrderPolling?.data])

   console.log("polling order", liveOrderPolling);
   

    return (
        <Card key={order.id}>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center justify-between">
              <span>Order Status</span>
              <Badge className={statusConfig[currentOrder.status].color}>
                {statusConfig[currentOrder?.status].label}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-medium">{order.id}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-2">Order Details</h3>
              <div className="space-y-2">
                {order?.items.map((item, idx) =>{ 
                  
                  return (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.menuItem?.name} × {item.quantity}
                    </span>
                    <span>₹{(item.quantity * item.menuItem?.price).toFixed(2)}</span>
                  </div>
                )})}
              </div>

              <Separator className="my-3" />

              <div className="flex gap-x-4 justify-end font-bold">
                <span className="text-blue-800">Total</span>
                <span className="text-green-400">₹{Number(order?.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
            
            {/* Customer Details */}
            <h3 className="font-semibold mb-2">Customer Details</h3>
             <div className="space-y-3">
                <p className="flex gap-x-1">
                  <span className="text-sm text-muted-foreground">Name:</span>{" "}
                  <Label>{order?.customerName}</Label>
                </p>
                <p className="flex gap-x-1">
                  <span className="text-sm text-muted-foreground">Phone:</span>{" "}
                  <Label>{order?.phone}</Label>
                </p>
                <p className="flex gap-x-1">
                  <span className="text-sm text-muted-foreground">Address:</span>{" "}
                  <Label>{order.address}</Label>
                </p>
        </div>
          </CardContent>
        </Card>
    )
}