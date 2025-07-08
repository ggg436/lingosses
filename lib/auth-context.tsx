"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to set a cookie for server-side auth
const setSessionCookie = (userId: string) => {
  document.cookie = `session=${userId}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
};

// Helper function to clear the cookie
const clearSessionCookie = () => {
  document.cookie = 'session=; path=/; max-age=0; SameSite=Lax';
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(() => {
    // Initialize auth only on client side
    if (typeof window !== 'undefined') {
      return getAuth(app);
    }
    return null;
  });

  useEffect(() => {
    if (!auth) return;
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
        
        // Set or clear the session cookie based on auth state
        if (user) {
          setSessionCookie(user.uid);
        } else {
          clearSessionCookie();
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Auth state change error:", error);
      setLoading(false);
      return () => {};
    }
  }, [auth]);

  const signIn = async (email: string, password: string): Promise<User> => {
    if (!auth) throw new Error("Auth not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    if (!auth) throw new Error("Auth not initialized");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signInWithGoogle = async (): Promise<User> => {
    if (!auth) throw new Error("Auth not initialized");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const signOut = async (): Promise<void> => {
    if (!auth) throw new Error("Auth not initialized");
    clearSessionCookie();
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}; 