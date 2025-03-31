"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
const router = useRouter();

  const handleEmployeeLogin = () => {
    // Perform login logic here
    // After successful login, navigate to the dashboard
    // (it just makes the button switch pages for rn)
    router.push("/create-order");
  };

  return (
    <main className="flex flex-col items-center justify-center px-16">
      <div className="w-96 mt-16">
        <p className=" text-3xl font-bold mb-8 text-center">I am a...</p>
        <div className=" flex flex-col gap-4">
          <Button className=" bg-[#6F403A]" onClick={handleEmployeeLogin}>Customer</Button>
          <Button className=" bg-[#6F403A]" onClick={handleEmployeeLogin}>Employee</Button>
          <Button className=" bg-[#6F403A]" onClick={handleEmployeeLogin}>Manager</Button>
        </div>
      </div>
    </main>
  );
}