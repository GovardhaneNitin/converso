"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import NavItems from "@/app/components/NavItems";
import { useNavigation } from "./NavigationProvider";

const Navbar = () => {
  const { navigate } = useNavigation();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={46}
          height={44}
          priority
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-8">
        <NavItems />
        <SignedOut>
          <SignInButton>
            <button className="btn-signin">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
