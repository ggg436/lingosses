"use server";

import { cookies } from "next/headers";

// In development mode, we'll use a simpler auth method without the Firebase Admin SDK
// In production, you would use Firebase Admin SDK with proper credentials

// Mock function for development
export async function getServerAuth() {
  // For development purposes, we'll return a mock user or no user
  // based on a simple cookie check
  const sessionCookie = cookies().get("session")?.value;
  
  if (!sessionCookie) {
    return { userId: null, user: null };
  }

  try {
    // In production, you would verify the session token with Firebase Admin
    // For now, just assume the cookie means a logged-in user
    return {
      userId: sessionCookie, // Using the cookie as the userId for now
      user: {
        id: sessionCookie,
        email: "dev@example.com",
        firstName: "Development",
        lastName: "User",
        imageUrl: "/mascot.svg",
      }
    };
  } catch (error) {
    console.error("Error in auth:", error);
    return { userId: null, user: null };
  }
} 