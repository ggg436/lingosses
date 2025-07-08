"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const { currentUser, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Redirect will be handled by protected route
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          label="Learn" 
          href="/learn"
          iconSrc="/learn.svg"
        />
        <SidebarItem 
          label="Leaderboard" 
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem 
          label="quests" 
          href="/quests"
          iconSrc="/quests.svg"
        />
        <SidebarItem 
          label="shop" 
          href="/shop"
          iconSrc="/shop.svg"
        />
      </div>
      <div className="p-4">
        {loading ? (
          <span className="h-5 w-5 text-muted-foreground animate-spin inline-block">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        ) : (
          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {currentUser.displayName ? currentUser.displayName[0] : currentUser.email?.[0] || "U"}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-sm bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100 disabled:opacity-50"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
