"use client";

import { useState } from "react";
import {  useRouter, useSearchParams } from "next/navigation";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { useOrdersByPhone } from "@/query/order.query";

import { Editable } from "@/components/ui/Editable";
import {  OrderDetails  } from "@/components/order/OrderDetails";



const OrderStatusPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("phone");


  
  const [phone, setPhone] = useState(orderIdParam|| "");
  const [searchPhone, setSearchphone] = useState(orderIdParam || "");
  const [errors, setErrors] = useState({
    phone: "",
  });
  
  const { data, error, isLoading  :loading} = useOrdersByPhone(searchPhone)
  
  const orders = data?.data || [];


  const customer = {
    name : orders[0]?.customerName,
    address: orders[0]?.address,
    phone: orders[0]?.phone,
  }
  const handlePhoneChange = (e) => {

    const phone = e.target.value;
    const newErrors :{phone? : string} = { };

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(customer.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    setPhone(e.target.value);
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex gap-x-1 justify-between">
        <div className="flex">
        <Label className="font-bold min-w-40">Enter Phone Number</Label>
        <Editable
          value={phone}
          onChange={handlePhoneChange}
          handleKeyDownProp={(e) => setSearchphone(e.target.value) }
          inputClassName="font-bold text-blue-900 bg-blue-200/40"
          previewClassName=" min-w-60 font-bold text-blue-900 bg-blue-200/40 p-2 rounded cursor-pointer"
        />
        </div>
         <Button  className="bg-pink-600" onClick={() => router.push("/")}>
                + Order More Food
              </Button>
      </div>

        {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone}
                      </p>
         )}
      {/* Loading */}
      {loading && (
        <p className="text-center text-sm text-muted-foreground">
          Fetching order details…
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-500">{error.message}</p>
      )}

      {/* Order Card */}
      {orders.length > 0 && orders?.map((order, index) =>{
        return (
       <OrderDetails key={order.id} order={order} />
      )
      })}
    </div>
  );
};

export default OrderStatusPage;
