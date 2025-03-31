"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import MenuCategory from "@/components/menuCategory";
import { RiSearchLine } from "react-icons/ri";
import DrinkCard from "@/components/drinkCard";
import { useDrinks, useDrinkCategories } from "../hooks/useDrinks";

export default function Employee() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  if (drinksLoading || categoriesLoading) {
    return <div className="px-16">Loading...</div>;
  }

  if (drinksError || categoriesError) {
    return (
      <div className="px-16">
        Error: {drinksError || categoriesError}
      </div>
    );
  }

  const filteredDrinks = drinks.filter((drink) => {
    const matchesCategory = selectedCategory
      ? drink?.drink_category_id?.drink_category_name === selectedCategory
      : true;

    const matchesSearch = drink?.drink_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex flex-col px-16 pb-8">
      <div>
        <div className="flex flex-wrap gap-2">
          <div
            key="all-drinks"
            onClick={() => setSelectedCategory(null)}
            className="cursor-pointer"
          >
            <MenuCategory
              categoryName="All Drinks"
              itemCount={drinks.length}
            />
          </div>
          {categories.map((category, index) => {
            const categoryName = category.drink_category_name || "No Category";
            // Calculate count of drinks in this category.
            const count = drinks.filter(
              (drink) =>
                drink?.drink_category_id?.drink_category_name === categoryName
            ).length;
            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(categoryName)}
                className="cursor-pointer"
              >
                <MenuCategory
                  categoryName={categoryName}
                  itemCount={count}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 relative">
        <Input
          className="border-[#6F403A] h-10 rounded-3xl pr-12"
          placeholder="Search for Menu Item"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#6F403A] w-7 h-7 rounded-full flex items-center justify-center">
          <RiSearchLine className="text-white" size={15} />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        {filteredDrinks.map((drink, index) => (
          <DrinkCard
            key={index}
            drinkName={drink?.drink_name || "No Name"}
            drinkCategory={
              drink?.drink_category_id?.drink_category_name || "No Category"
            }
            drinkPrice={drink?.drink_price || 0}
            imageSrc={"/classic-pearl-milk-tea.png"}
            drinkId={drink?.drink_id}
            itemId={Date.now()}
            
          />
        ))}
      </div>
    </main>
  );
}