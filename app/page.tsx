"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Home() {
  const { push } = useRouter();
  const { data: session, status } = useSession();
  const {theme} = useTheme()
  

  useEffect(() => {
    if (status === "loading") return; // Wait until session is determined

    if (session) {
      push("/main");
    } else {
      push("/login");
    }
  }, [session, status]);

  return (
    <div className="flex flex-col gap-5 items-center justify-center w-screen h-screen">
      <Image
        src={`${
          theme === "light"
            ? "logos/default-monochrome-black.svg"
            : "logos/default-monochrome-white.svg"
        }`}
        alt="RentRanks Logo"
        width={250}
        height={250}
        priority
      />
      Loading...
    </div>
  );
}
