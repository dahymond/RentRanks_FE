"use client";
import Link from "next/link";
import Image from "next/image";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Correctly determine theme after mounting
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="sticky top-0 z-50 w-screen border-b border-border/40 bg-background/80 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/70">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          {!mounted ? ( // Don't render anything until theme is loaded
            <div className="w-[170px] h-[170px]" /> // Placeholder to prevent layout shift
          ) : (
            <Image
              src={
                currentTheme === "light"
                  ? "/logos/default-monochrome-black.svg"
                  : "/logos/default-monochrome-white.svg"
              }
              alt="RentRanks Logo"
              width={170}
              height={170}
              priority
            />
          )}
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}