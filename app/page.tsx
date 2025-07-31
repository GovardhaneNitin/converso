import React from "react";
import { Button } from "./components/ui/button";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Converso</h1>
      <Button>Let's Get Started</Button>
    </div>
  );
};

export default Page;
