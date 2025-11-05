"use client";

import { useEffect, useState } from "react";

const PageLoader = () => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo/spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="w-8 h-8 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>

        {/* Loading text with animated dots */}
        <div className="text-center">
          <p className="text-xl font-semibold text-primary font-bricolage">
            Loading{".".repeat(dots)}
            {" ".repeat(3 - dots)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Please wait while we prepare your page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
