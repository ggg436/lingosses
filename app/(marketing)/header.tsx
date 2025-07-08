"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const { currentUser, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
        {loading ? (
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : (
          <>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {currentUser.displayName ? currentUser.displayName[0] : currentUser.email?.[0] || "U"}
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  disabled={isSigningOut}
                  size="lg"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <Button size="lg" variant="ghost" asChild>
                <Link href="/login">
                  Login
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
