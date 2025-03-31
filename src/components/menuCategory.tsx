import { RiBook3Line } from "react-icons/ri";

interface MenuCategoryProps {
  categoryName: string | undefined;
  itemCount: number;
}

export default function MenuCategory({
  categoryName,
  itemCount,
}: MenuCategoryProps) {
  return (
    <div className="outline outline-[#6F403A] p-4 rounded-md h-30 w-30">
      <div className="bg-[#6F403A] w-10 h-10 rounded-full flex items-center justify-center mb-2">
        <RiBook3Line className="text-white" size={20} />
      </div>
      <p className="text-sm font-semibold">{categoryName}</p>
      <p className="text-xs text-gray-500">{itemCount} Items</p>
    </div>
  );
}