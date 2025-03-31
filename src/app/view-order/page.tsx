'use client'
import { Button } from "@/components/ui/button";
import { RiBankCardLine, RiBankCard2Line, RiAppleLine } from "react-icons/ri";
import OrderCard from "@/components/orderCard";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderSubmission } from '../service/types';
import { useOrders } from "../hooks/useOrders";


export default function ViewOrder() {
  interface Order {
    drinkName: string;
    drinkCategory: string;
    drinkPrice: number;
    imageSrc: string;
    sugarLevel: string;
    iceLevel: string;
    toppings: string[];
    toppingIds: number[];
    drinkId: number;
    itemId: number;
  }
  
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderPrice, setOrderPrice] = useState(0);

  const {
    submitOrder,
  } = useOrders();

  useEffect(() => {
    const storedOrders = localStorage.getItem("orderItems");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    const storedPrice = parseFloat(localStorage.getItem("orderprice") || "0");
    setOrderPrice(storedPrice);
  }, []);

    /// Function to handle order submission (is a button click handler for the submit order button)
    function submitOrderHook() {
      const orderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
      const orderPrice = parseFloat(localStorage.getItem("orderprice") || "0");
      
      const orderSubmission = {
        totalPrice: orderPrice,
        customerName: "John Doe", // Adding the customer name field
        employeeId: 1, // Self-service kiosk
        paymentMethod: "Credit Card",
        drinks: orderItems.map((item: any) => ({
          drink_id: item.drinkId,
          toppings: item.toppingIds,
        })),
      };
      
      console.log("Order Submission Object:", orderSubmission);
      //Clear the ordered items from local storage
      localStorage.setItem("orderItems", "[]");
      localStorage.setItem("orderprice", "0");
      submitOrder(orderSubmission);

    }


  const tax = orderPrice * 0.1;
  const total = orderPrice + tax;

  return (
    <main className="flex px-16 gap-2 items-start pb-8">
      <div className="w-2/3 flex flex-col gap-2">
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            drinkName={order.drinkName}
            drinkCategory={order.drinkCategory} 
            iceLevel={order.iceLevel}
            sugarLevel={order.sugarLevel}
            toppings={order.toppings}
            toppingIds={order.toppingIds}
            price={order.drinkPrice}
            imageSrc={order.imageSrc}
            drinkId={order.drinkId}
            itemId={order.itemId}
          />
        ))}
      </div>
      <div className="border border-[#6F403A] p-2 px-4 w-1/3 rounded-xl">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-sm">${orderPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Tax (10%)</p>
          <p className="text-sm text-gray-400">${tax.toFixed(2)}</p>
        </div>
        <hr className="mt-4 mb-4 border-[#6F403A]" />
        <div className="flex justify-between">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">${total.toFixed(2)}</p>
        </div>
        <div className="mt-2">
          <p className="font-semibold">Payment Method</p>
          <div className="flex gap-2 mt-2">
            <div className="border border-[#6F403A] p-2 rounded-xl w-1/3 flex flex-col items-center justify-center">
              <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center">
                <RiBankCardLine className="text-white" size={20} />
              </div>
              <p className="text-sm">Credit Card</p>
            </div>
            <div className="border border-[#6F403A] p-2 rounded-xl w-1/3 flex flex-col items-center justify-center">
              <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center">
                <RiBankCard2Line className="text-white" size={20} />
              </div>
              <p className="text-sm">Gift Card</p>
            </div>
            <div className="border border-[#6F403A] p-2 rounded-xl w-1/3 flex flex-col items-center justify-center">
              <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center">
                <RiAppleLine className="text-white" size={20} />
              </div>
              <p className="text-sm">Apple Pay</p>
            </div>
          </div>
        </div>
        <Dialog onOpenChange={(open) => {
            // When dialog closes (open becomes false), refresh the window
            if (!open) {
              window.location.reload();
            }
          }}>
          <DialogTrigger className="w-full" asChild>
            <div onClick={() => submitOrderHook()}>
              <Button className="bg-[#6F403A] w-full mb-4 mt-4">
                Submit Order
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className=" flex justify-center text-3xl">${total}</DialogTitle>
            <div className=" flex flex-col justify-center text-center">
              <p>Transaction Complete</p>
              <p className=" text-sm text-gray-400">Order #69</p>
            </div>
            <div className=" flex flex-col gap-4 mt-4">
              <Button className="bg-[#6F403A]">Print Reciept</Button>
              <Button className="bg-[#6F403A]">Email Reciept</Button>
              <Button className="bg-[#6F403A]">Text Reciept</Button>
              <Button className="bg-[#6F403A]">No Reciept</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}