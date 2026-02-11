"use client";

import { Suspense } from "react";
import OrderStatusDetails from "./Layout";

export const dynamic = "force-dynamic";

const OrderStatusPage = () => {
  

  return ( <Suspense fallback={<p className="text-center">Loading search...</p>}>
      <OrderStatusDetails />
    </Suspense>)
};

export default OrderStatusPage;
