"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
const router = useRouter();

  const handleLogin = () => {
    // Perform login logic here
    // After successful login, navigate to the dashboard
    // (it just makes the button switch pages for rn)
    router.push("/select-role");
  };

  return (
    <main className="flex flex-col items-center justify-center px-16">
      <div className="w-96 mt-16">
        <p className=" text-3xl font-bold mb-8 text-center">Login to Your Account</p>
        <div className=" flex flex-col gap-4">
          <div>
            <Label className=" mb-2">User ID</Label>
            <Input placeholder="User ID" />
          </div>
          <div>
            <Label className=" mb-2">Password</Label>
            <Input placeholder="Password" />
          </div>
        </div>
        <div className=" mt-8 flex gap-6">
          <Button className=" bg-[#6F403A] flex-1" onClick={handleLogin}>Login</Button>
          <Button className=" bg-[#6F403A] flex-1">Login with Google</Button>
        </div>
      </div>
    </main>
  );
}