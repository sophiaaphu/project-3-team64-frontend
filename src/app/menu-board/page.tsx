"use client";
import { useEffect } from "react";
import { useDrinks, useDrinkCategories } from "../hooks/useDrinks";
import { useExtras } from "@/app/hooks/useExtras";
import { Extra } from "@/app/service/types";

export default function MenuBoard() {
  const {
    drinks,
    loading: drinksLoading,
    error: drinksError,
    fetchDrinks,
  } = useDrinks();

  const {
    drinkCategories: categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchDrinkCategories,
  } = useDrinkCategories();

  useEffect(() => {
    fetchDrinks();
    fetchDrinkCategories();
  }, [fetchDrinks, fetchDrinkCategories]);

  const {
      extras,
      loading: extrasLoading,
      fetchExtras
    } = useExtras();

  if (drinksLoading || categoriesLoading) {
    return <div className="px-16">Loading...</div>;
  }

  if (drinksError || categoriesError) {
    return <div className="px-16">Error: {drinksError || categoriesError}</div>;
  }

  const filterExtraByCategoryIdIce = (extras: Extra[], categoryId: number): string[] => {
      return extras
      .filter(extra => extra.extra_category_id.extra_category_id === categoryId)
      .map(extra=>extra.extra_name);
    }

  const filterExtraByCategoryIdSugar = (extras: Extra[]): string[][] => {
    return extras
    .filter(extra => extra.extra_category_id.extra_category_id === 2)
    .map(extra => {
      const [label, percentage] = extra.extra_name.split(" ");
      return [label, percentage];
    });
  }

  const filterExtraByCategoryIdToppings = (extras: Extra[]) : string[][] => {
    return extras
    .filter(extra => extra.extra_category_id.extra_category_id === 3)
    .map(extra => {
      const [name, price] = [extra.extra_name, JSON.stringify(extra.extra_price)];
      return [name, price];
    });
  }

  //const iceLevels = ["Regular Ice", "Less Ice", "No Ice"];
  const iceLevels: string[] = filterExtraByCategoryIdIce(extras || [], 1);
  /* const sugarLevels = [
    { percentage: "100%", label: "Normal" },
    { percentage: "80%", label: "Less" },
    { percentage: "50%", label: "Half" },
    { percentage: "30%", label: "Light" },
    { percentage: "0%", label: "No Sugar" },
  ]; */
  const sugarLevels: string[][] = filterExtraByCategoryIdSugar(extras || []);
  /* const toppings = [
    { name: "Pearl", price: "$0.75" },
    { name: "Mini Pearl", price: "$0.75" },
    { name: "Ice Cream", price: "$0.75" },
    { name: "Pudding", price: "$0.75" },
    { name: "Aloe Vera", price: "$0.75" },
    { name: "Red Bean", price: "$0.75" },
    { name: "Herb Jelly", price: "$0.75" },
    { name: "Aiyu Jelly", price: "$0.75" },
    { name: "Lychee Jelly", price: "$0.75" },
  ]; */
  const toppings: string[][] = filterExtraByCategoryIdToppings(extras || []);
  const extraToppings = [
    { name: "Creama", price: "$1.00" },
  ];

  return (
    <main className="flex flex-col px-16 pb-8">
      <p className="text-2xl font-semibold">Menu</p>
      <div className="flex items-start mt-2 gap-4">
        <div className="w-2/3 grid grid-cols-2 gap-2">
          {categories.map((category, index) => {
            const drinksInCategory = drinks.filter(
              (drink) =>
                drink?.drink_category_id?.drink_category_name ===
                category.drink_category_name
            );
            return (
              <div
                key={index}
                className="border border-[#6F403A] p-4 rounded-xl"
              >
                <p className="font-semibold">
                  {category.drink_category_name}
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  {drinksInCategory.map((drink, idx) => (
                    <div key={idx} className="flex justify-between">
                      <p className="text-sm">{drink.drink_name}</p>
                      <p className="text-sm text-gray-400">
                        ${Number(drink.drink_price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border border-[#6F403A] p-4 w-1/3 rounded-xl bg-[#FAEED3]">
          <div>
            <p className="text-[#6F403A] font-semibold">Ice Levels</p>
            <div className="flex flex-col gap-1">
              {iceLevels.map((level, idx) => (
                <p key={idx} className="text-sm">
                  {level}
                </p>
              ))}
            </div>
            <p className="text-[#6F403A] font-semibold mt-4">Sugar Levels</p>
            <div className="flex gap-4 justify-between">
              {sugarLevels.map((option, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <p className="font-semibold">{option[0]}</p>
                  <p className="text-sm">{option[1]}</p>
                </div>
              ))}
            </div>
            <p className="text-[#6F403A] font-semibold mt-4">Toppings</p>
            <div className="flex flex-col mt-1 gap-2">
              <div className="flex gap-2">
                <div className="border border-[#6F403A] w-16 h-16 rounded-full flex flex-col items-center justify-center">
                  <p>+</p>
                  <p className="font-semibold">$0.75</p>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {toppings.map((topping, idx) => (
                    <p key={idx}>{topping[0]}</p>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="border border-[#6F403A] w-16 h-16 rounded-full flex flex-col items-center justify-center">
                  <p>+</p>
                  <p className="font-semibold">$1.00</p>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {extraToppings.map((topping, idx) => (
                    <p key={idx}>{topping.name}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}