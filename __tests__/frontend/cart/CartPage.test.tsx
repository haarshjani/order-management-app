//import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "@/app/cart/page"; // Adjust path
import { useAppState } from "@/store/useAppState";
import { useCreateOrder } from "@/query/order.query";
import { useRouter } from "next/navigation";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/useAppState");
jest.mock("@/query/order.query");

describe("CartPage UI Tests", () => {
  const mockPush = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });


    (useAppState as jest.Mock).mockReturnValue({
      state: {
        cart: [{ id: "1", name: "Dhokla", price: 100 }],
      },
      addItemToCart: jest.fn(),
      removeItemFromCart: jest.fn(),
      resetCart: jest.fn(),
    });

   
    (useCreateOrder as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    });
  });


  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    const submitButton = screen.getByRole("button", { name: /place order/i });
    await user.click(submitButton);

  
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/enter a valid 10-digit/i)).toBeInTheDocument();
    
  
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it(" shows error for typing invalid details", async () => {
    const user = userEvent.setup();
    render(<CartPage />);

    const addressInput = screen.getByLabelText(/address/i);
    const phoneInput = screen.getByLabelText(/phone/i)
    const nameInput = screen.getByLabelText(/name/i)
     const submitButton = screen.getByRole("button", { name: /place order/i })
  
    await user.type(addressInput, "Gujarat");
    await user.type(phoneInput, "123");
     
    
   
    await user.click(submitButton);

    expect(await screen.findByText(/enter a valid 10-digit/i)).toBeInTheDocument();
    expect(await screen.findByText(/Address must be at least /i)).toBeInTheDocument();
    expect(await screen.findByText(/is required/i)).toBeInTheDocument();

    await user.clear(addressInput)
     await user.type(addressInput, "GujaratGujaratGujaratGujaratGujaratGujaratGujaratGujaratGujaratGujaratGujaratGujaratGujarat");
      await user.click(submitButton);

     expect(await screen.findByText(/Address must be less then/i)).toBeInTheDocument();
  });

it("should show an alert if total cart items exceed 25", async () => {
  const user = userEvent.setup();
  
  (useAppState as jest.Mock).mockReturnValue({
    state: { cart: Array(26).fill({ id: "1", name: "Dhokla", price: 10 }) },
  });
   (useCreateOrder as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: true,
      error : {data :{message : "Maximum Allowed Items are 25"}},
      
    });

  render(<CartPage />);

  await user.type(screen.getByLabelText(/name/i), "Harsh");
  await user.type(screen.getByLabelText(/address/i), "Gujarat 370000111");
  await user.type(screen.getByLabelText(/phone/i), "9876543210");
  
  await user.click(screen.getByRole("button", { name: /place order/i }));
  await user.click(screen.getByRole("button", { name: /yes, place order/i }));
  
  
  expect(await screen.findByText(/order failed/i)).toBeInTheDocument();
  expect(await screen.findByText(/Maximum Allowed Items are 25/i)).toBeInTheDocument();
});

});
