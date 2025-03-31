import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
import { useExtras } from "@/app/hooks/useExtras";
import { Extra } from "@/app/service/types";

interface DrinkCardProps {
  drinkName: string;
  drinkCategory: string | undefined;
  drinkPrice: number | string;
  imageSrc: string;
  drinkId: number;
  itemId: number;
}

export default function DrinkCard({
  drinkName,
  drinkCategory,
  drinkPrice,
  imageSrc,
  drinkId,
  itemId,
}: DrinkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryColors: Record<string, { badgeBg: string; badgeText: string}> = {
    "Milk Teas": { badgeBg: "bg-[#DBC89E]", badgeText: "text-[#6F403A]"},
    "Brewed Tea": { badgeBg: "bg-amber-200", badgeText: "text-amber-800" },
    "Fruit Tea": { badgeBg: "bg-rose-200", badgeText: "text-rose-800"},
    "Fresh Milk": { badgeBg: "bg-zinc-200", badgeText: "text-zinc-800"},
    "Ice Blended": { badgeBg: "bg-cyan-200", badgeText: "text-cyan-800"},
    "Tea Mojito": { badgeBg: "bg-green-200", badgeText: "text-green-800"},
    "Creama": { badgeBg: "bg-yellow-200", badgeText: "text-yellow-800"},
  };

  // If drinkCategory is undefined or not in our mapping, fallback to a default color.
  const categoryColor =
    (drinkCategory && categoryColors[drinkCategory]) || { badgeBg: "bg-gray-200", badgeText: "text-gray-800", buttonBg: "bg-gray-800" };
  return (
    <div className="border border-[#6F403A] p-2 rounded-xl flex flex-col justify-between">
      <div className={`${categoryColor.badgeBg} rounded-xl flex justify-center py-4`}>
        <Image
          src={imageSrc} 
          alt={drinkName}
          width={75} 
          height={75} 
        />
      </div>
      <p className="mt-2 font-semibold">{drinkName}</p>
      <div className="flex justify-between mt-1">
        <Badge className={`${categoryColor.badgeBg} ${categoryColor.badgeText} font-normal px-3 rounded-3xl`}>
          {drinkCategory}
        </Badge>
        <p className="text-sm">${Number(drinkPrice).toFixed(2)}</p>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mt-6 w-full bg-[#6F403A]">Select Item</Button>
        </DialogTrigger>
        {isOpen && <DrinkCustomizationDialog 
          drinkName={drinkName}
          drinkCategory={drinkCategory}
          drinkPrice={drinkPrice}
          imageSrc={imageSrc}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          drinkId={drinkId}
          itemId= {itemId}
        />}
      </Dialog>
    </div>
  );
}

// Separate component for the dialog contents
function DrinkCustomizationDialog({
  drinkName,
  drinkCategory,
  drinkPrice,
  imageSrc,
  isOpen,
  drinkId,
  setIsOpen
}: DrinkCardProps & { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const {
    extras,
    loading: extrasLoading,
    fetchExtras
  } = useExtras();
  
  // Fetch extras when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchExtras();
    }
  }, [isOpen, fetchExtras]);
  
  const filterExtraByCategoryId = (extras: Extra[], categoryId: number): Extra[] => {
    return extras.filter(extra => extra.extra_category_id.extra_category_id === categoryId);
  }
  const sugarOptions: Extra[] = filterExtraByCategoryId(extras || [], 2);
  const iceOptions: Extra[] = filterExtraByCategoryId(extras || [], 1);
  const toppings: Extra[] = filterExtraByCategoryId(extras || [], 3);

  // store the full Extra objects
  const [selectedSugarObj, setSelectedSugarObj] = useState<Extra | null>(null);
  const [selectedIceObj, setSelectedIceObj] = useState<Extra | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Extra[]>([]);

  // initialize defaults when extras data is available
  useEffect(() => {
    if (sugarOptions.length > 0 && !selectedSugarObj) {
      setSelectedSugarObj(sugarOptions.length > 1 ? sugarOptions[1] : sugarOptions[0]);
    }
    if (iceOptions.length > 0 && !selectedIceObj) {
      setSelectedIceObj(iceOptions[0]);
    }
  }, [sugarOptions, iceOptions, selectedSugarObj, selectedIceObj]);


  // handle sugar selection
  const handleSugarChange = (value: string) => {
    const sugar = sugarOptions.find(option => option.extra_name === value);
    if (sugar) {
      setSelectedSugarObj(sugar);
    }
  };

  // handle ice selection
  const handleIceChange = (value: string) => {
    const ice = iceOptions.find(option => option.extra_name === value);
    if (ice) {
      setSelectedIceObj(ice);
    }
  };

  // handle topping selection
  const handleToppingSelection = (topping: Extra) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.extra_id === topping.extra_id);
      if (exists) {
        return prev.filter(t => t.extra_id !== topping.extra_id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToOrder = () => {
    const orderItem = {
      drinkName,
      drinkCategory,
      drinkPrice,
      imageSrc,
      sugarLevel: selectedSugarObj?.extra_name || "No Sugar",
      iceLevel: selectedIceObj?.extra_name || "No Ice",
      toppings: selectedToppings.length === 0 ? ["None"] : selectedToppings.map(t => t.extra_name),
      toppingIds: selectedToppings.map(t => t.extra_id),
      /* sugarObject: selectedSugarObj,
      iceObject: selectedIceObj,
      toppingObjects: selectedToppings, */
      drinkId,
      itemId: Date.now(),
    };
    
    // Edit the price total Local Variable
    const toppingPrice = selectedToppings.reduce((acc, topping) => acc + topping.extra_price, 0);
    const currentTotal = parseFloat(localStorage.getItem("orderprice") || "0");
    const newTotal = currentTotal + parseFloat(drinkPrice as string) + toppingPrice;
    localStorage.setItem("orderprice", newTotal.toString());

    //Save the total drink price as the price of the drink + toppings (this is 7 billion times easier than the alternative)
    orderItem.drinkPrice = parseFloat(drinkPrice as string) + toppingPrice;

    const existingOrders = JSON.parse(localStorage.getItem("orderItems") || "[]");
    existingOrders.push(orderItem);
    localStorage.setItem("orderItems", JSON.stringify(existingOrders));
    
    
    setIsOpen(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{drinkName}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-8 py-4">
        <div className="items-center gap-4">
          <Label className="mb-2">
            Sugar
          </Label>
          <Select onValueChange={handleSugarChange} value={selectedSugarObj?.extra_name}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={extrasLoading ? "Loading options..." : "Select an Option"} />
            </SelectTrigger>
            <SelectContent>
              {sugarOptions.length > 0 ? (
                sugarOptions.map((option) => (
                  <SelectItem key={option.extra_id} value={option.extra_name}>
                    {option.extra_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="loading">
                  {extrasLoading ? "Loading options..." : "No options available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="items-center gap-4">
          <Label className="mb-2">
            Ice
          </Label>
          <Select onValueChange={handleIceChange} value={selectedIceObj?.extra_name}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={extrasLoading ? "Loading options..." : "Select an Option"} />
            </SelectTrigger>
            <SelectContent>
              {iceOptions.length > 0 ? (
                iceOptions.map((option) => (
                  <SelectItem key={option.extra_id} value={option.extra_name}>
                    {option.extra_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="loading">
                  {extrasLoading ? "Loading options..." : "No options available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2">
            Toppings
          </Label>
          <div className="flex flex-wrap gap-2">
            {toppings.length > 0 ? (
              toppings.map((topping) => {
                const isSelected = selectedToppings.some(t => t.extra_id === topping.extra_id);
                return (
                  <Badge
                    key={topping.extra_id}
                    className="rounded-4xl px-2 bg-white text-black border-gray-200 flex items-center"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleToppingSelection(topping)}
                  >
                    <div className={isSelected ? "w-4 h-4 rounded-full border mr-1 bg-black border-black" : "w-4 h-4 rounded-full border mr-1"}></div>
                    <p className="text-sm font-normal">{topping.extra_name}</p>
                  </Badge>
                );
              })
            ) : (
              <div>{extrasLoading ? "Loading toppings..." : "No toppings available"}</div>
            )}
          </div>
        </div>
      </div>
      <Button 
        type="submit" 
        className="bg-[#6F403A]" 
        onClick={handleAddToOrder}
        disabled={extrasLoading}
      >
        Add Item to Order
      </Button>
    </DialogContent>
  );
}