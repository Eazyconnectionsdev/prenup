"use client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (true) {
      router.push("/dashboard");
    }
  }, []);

  return <div className="w-full h-full flex items-center justify-center">
    <Loader className="animate-spin text-gray-600"/>
  </div>;
};

export default MainPage;
