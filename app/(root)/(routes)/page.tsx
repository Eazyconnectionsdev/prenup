"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (true) {
      router.push("/dashboard");
    }
  }, []);

  return <div>MainPage</div>;
};

export default MainPage;
