"use client";

import React, {
  createContext,
  useContext,
  useState,
  useTransition,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

interface NavigationContextType {
  navigate: (href: string) => void;
  isLoading: boolean;
  currentPath: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = (href: string) => {
    if (href === pathname) return;

    setIsNavigating(true);
    startTransition(() => {
      router.push(href);
    });
  };

  // Clear loading state when pathname actually changes
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 300); // Minimum loading time for smooth UX

      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  const isLoading = isPending || isNavigating;

  return (
    <NavigationContext.Provider
      value={{ navigate, isLoading, currentPath: pathname }}
    >
      {children}
      {isLoading && <PageLoader />}
    </NavigationContext.Provider>
  );
};
