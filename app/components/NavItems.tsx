"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavigation } from "./NavigationProvider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();
  const { navigate, isLoading } = useNavigation();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <nav className="flex items-center gap-4">
      {navItems.map(({ label, href }) => {
        const isActive = pathname === href;

        return (
          <button
            key={label}
            onClick={() => handleNavigation(href)}
            disabled={isLoading}
            className={cn(
              "relative transition-colors duration-200 hover:text-primary cursor-pointer disabled:opacity-50",
              isActive && "text-primary font-semibold"
            )}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export default NavItems;
