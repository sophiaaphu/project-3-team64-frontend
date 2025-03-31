import Image from "next/image";
import { RiPencilLine, RiFileCopyLine, RiDeleteBin5Line } from "react-icons/ri";

interface OrderCardProps {
  drinkName: string;
  drinkCategory: string;
  sugarLevel: string;
  iceLevel: string;
  toppings: string[]; 
  toppingIds: number[];
  price: number;
  imageSrc: string;
  drinkId: number;
  itemId: number;
}

interface OrderItem{
  drinkName: string;
  drinkCategory: string;
  sugarLevel: string;
  iceLevel: string;
  toppings: string[];
  toppingIds: number[];
  price: number;
  imageSrc?: string;
  drinkId: number;
  itemId: number;
}

export default function OrderCard({
  drinkName,
  drinkCategory,
  sugarLevel,
  iceLevel,
  toppings,
  toppingIds,
  price,
  imageSrc,
  drinkId,
  itemId = Date.now(),
}: OrderCardProps) {
  const categoryBackgrounds: Record<string, string> = {
    "Milk Teas": "bg-[#DBC89E]",
    "Brewed Tea": "bg-amber-200",
    "Fruit Tea": "bg-rose-200",
    "Fresh Milk": "bg-zinc-200",
    "Ice Blended": "bg-cyan-200",
    "Tea Mojito": "bg-green-200",
    "Creama": "bg-yellow-200",
    // fallback color if no match:
    default: "bg-gray-200",
  };
  console.log(drinkCategory);
  const imageBgColor = categoryBackgrounds[drinkCategory] || categoryBackgrounds.default;
  const handleDelete = () => {
    let orderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    orderItems = orderItems.filter(
      (item: OrderItem) => 
      item.itemId !== itemId
    );
    localStorage.setItem("orderItems", JSON.stringify(orderItems));

    //Update order price
    const currentTotal = parseFloat(localStorage.getItem("orderprice") || "0");
    const newTotal = currentTotal - price;
    localStorage.setItem("orderprice", newTotal.toString());

    //Reload the window
    window.location.reload();
  };

  const handleCopy = () => {
    const newOrder = {
      drinkName,
      drinkCategory,
      drinkPrice: price,
      imageSrc,
      sugarLevel: sugarLevel,
      iceLevel: iceLevel,
      toppings,
      toppingIds,
      drinkId,
      itemId: Date.now()
    };

    const existingOrders = JSON.parse(localStorage.getItem("orderItems") || "[]");
    existingOrders.push(newOrder);
    localStorage.setItem("orderItems", JSON.stringify(existingOrders));

    const currentTotal = parseFloat(localStorage.getItem("orderprice") || "0");
    const newTotal = currentTotal + newOrder.drinkPrice;
    localStorage.setItem("orderprice", newTotal.toString());

    window.location.reload();
  }

  return (
    <div className="flex gap-4 border border-[#6F403A] p-2 rounded-xl pr-4">
      <div className={`${imageBgColor} rounded-xl flex justify-center py-4 w-1/4`}>
        <Image src={imageSrc} alt={drinkName} width={60} height={75} />
      </div>
      <div className="flex justify-between w-3/4">
        <div>
          <p className="font-semibold text-[#6F403A]">{drinkName}</p>
          <p className="text-sm text-gray-400">{iceLevel}</p>
          <p className="text-sm text-gray-400">{sugarLevel}</p>
          <p className="text-sm text-gray-400">{toppings.join(", ")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-right text-[#6F403A] font-semibold">
            ${price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center mb-2">
              <RiPencilLine className="text-white" size={20} />
            </div>
            <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center mb-2 hover:bg-[#4E2D26] cursor-pointer"
                 onClick={handleCopy}>
              <RiFileCopyLine className="text-white" size={20} />
            </div>
            <div className="bg-[#6F403A] w-8 h-8 rounded-full flex items-center justify-center mb-2 hover:bg-[#4E2D26] cursor-pointer"
                 onClick={handleDelete}
            >
              <RiDeleteBin5Line className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
