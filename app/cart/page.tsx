"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { groupBy, capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import MenuItemCard from "@/components/ui/menu/ItemCard";
import { ConfirmDialog } from "@/components/ConfrimDialog";
import { useAppState } from "@/store/useAppState";
import { useCreateOrder } from "@/query/order.query";
import { OrderFormValues, orderSchema } from "@/validation/schema/order/customer.schema";

const CartPage = () => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { state, addItemToCart, removeItemFromCart, resetCart } = useAppState();
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      address: "",
      phone: "",
    },
  });


  const cartItems = useMemo(() => {
    const grouped = groupBy(state?.cart || [], "id");
    return Object.keys(grouped).map((id) => {
      const items = grouped[id];
      return {
        ...items[0],
        quantity: items.length,
        amount: items.length * items[0].price,
      };
    });
  }, [state?.cart]);

  const cartTotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.amount, 0), 
  [cartItems]);


  const onPreSubmit = () => {
    setConfirmOpen(true);
  };

  const onFinalConfirm = () => {
    const formData = getValues();
    const payload = {
      ...formData,
      totalAmount: cartTotal,
      items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
    };

    createOrderMutation.mutate(payload, {
      onSuccess: (order) => {
        setConfirmOpen(false);
        const phone = order?.data?.phone;
        resetCart();
        router.push(phone ? `/myorder?phone=${phone}` : "/myorder");
      },
      onError : (e) =>{
        console.error({error: createOrderMutation.error, actualerror : e })
        
      }
    });
  };

  return (
    <>
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Food Cart</h1>

        <div className="flex flex-col  lg:flex-row gap-6">
          <div className="flex-1">
          <div className="flex-1 h-150 space-y-4 pr-6 overflow-y-auto">
            {/* Global Error Alert */}
            {createOrderMutation.isError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Order Failed</AlertTitle>
                <AlertDescription>
                  {(createOrderMutation.error as any)?.data.message || "Something went wrong"}
                </AlertDescription>
              </Alert>
            )}

            {cartItems?.map((item, index) => (
              <MenuItemCard
                key={item.id}
                index={index}
                name={capitalize(item.name)}
                onAdd={() => addItemToCart(item)}
                onRemove={() => removeItemFromCart(item.id)}
                {...item}
              />
            ))}

            
          </div>
          <div>
            {cartItems?.length > 0 && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-right font-bold text-lg">
                Total: ₹{cartTotal.toFixed(2)}
              </div>
            )}

            <Item onClick={() => router.push("/")} className="cursor-pointer hover:bg-muted">
              <ItemContent>
                <ItemTitle className="font-bold text-red-300">+ Add More Items</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          </div>
          <Separator orientation="vertical" />

          <div className="w-full lg:w-1/3 p-4">
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onPreSubmit)}>
                  <div className="space-y-1">
                    <Label htmlFor="customerName">Name</Label>
                    <Input id="customerName" {...register("customerName")} />
                    {errors.customerName && <p className="text-sm text-red-500">{errors.customerName.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" className="resize-none min-h-20" {...register("address")} />
                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-[#FFEB3B] hover:bg-[#FDD835] text-black font-bold"
                    disabled={cartItems.length === 0 || createOrderMutation.isLoading}
                  >
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Order"
        description={`Place order worth ₹${cartTotal.toFixed(2)}?`}
        confirmText="Yes, Place Order"
        cancelText="Review Cart"
        loading={createOrderMutation?.isLoading}
        onConfirm={onFinalConfirm}
      />
    </>
  );
};

export default CartPage;
