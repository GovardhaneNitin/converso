"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LoadingBar = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading when pathname changes
    setLoading(true);
    setProgress(0);

    // Animate progress
    const progressTimer = setTimeout(() => setProgress(30), 50);
    const progressTimer2 = setTimeout(() => setProgress(70), 150);
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 400);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-300 ease-out shadow-sm"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(249, 115, 22, 0.5)",
        }}
      />
    </div>
  );
};

export default LoadingBar;
