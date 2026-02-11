"use client";

import { Suspense, useState } from "react";
import {  useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { useOrdersByPhone } from "@/query/order.query";

import { Editable } from "@/components/ui/Editable";
import {  OrderDetails  } from "@/components/order/OrderDetails";

export const dynamic = "force-dynamic";

const OrderStatusDetails = () => {
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

  const handlePhoneChange = (e) => {

    const phone = e.target.value;
    const newErrors :{phone? : string} = { };

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
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
        return (<Suspense fallback={<div>Loading...</div>}>
           <OrderDetails key={order.id} order={order} />
        </Suspense>
      
      )
      })}
    </div>
  );
};

export default OrderStatusDetails;
