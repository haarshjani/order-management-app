import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrderDetails } from "../OrderDetails";
import { OrderStatus } from "@prisma/client";


jest.mock("@/query/order.query", () => ({
  useOrderByIdPolling: jest.fn(),
}));

import { useOrderByIdPolling } from "@/query/order.query";

const mockOrder = {
  id: "order-123",
  status: OrderStatus.PENDING,
  createdAt: new Date("2024-01-01T10:00:00Z"),
  totalAmount: 500,
  customerName: "John Doe",
  phone: "1234567890",
  address: "123 Test Street",
  items: [
    {
      quantity: 2,
      menuItem: {
        name: "Burger",
        price: 100,
      },
    },
    {
      quantity: 3,
      menuItem: {
        name: "Pizza",
        price: 100,
      },
    },
  ],
} as any;

describe("OrderDetails Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 

  it("updates UI when polling returns new order status", async () => {
    const updatedOrder = {
      ...mockOrder,
      status: OrderStatus.DELIVERED,
    };

    (useOrderByIdPolling as jest.Mock).mockReturnValue({
      data: { data: updatedOrder },
      isLoading: false,
    });

    render(<OrderDetails order={mockOrder} />);

    await waitFor(() => {
      expect(screen.getByText("Delivered")).toBeInTheDocument();
    });
  });

  it("does not enable polling when order is delivered", () => {
    const deliveredOrder = {
      ...mockOrder,
      status: OrderStatus.DELIVERED,
    };

    (useOrderByIdPolling as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<OrderDetails order={deliveredOrder} />);

    expect(useOrderByIdPolling).toHaveBeenCalledWith(
      deliveredOrder.id,
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
