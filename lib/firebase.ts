// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB63m0L7aPpt3U3cc1GTUD-79-wbVDhNEQ",
  authDomain: "nepalingo-b291c.firebaseapp.com",
  projectId: "nepalingo-b291c",
  storageBucket: "nepalingo-b291c.appspot.com",
  messagingSenderId: "879544303818",
  appId: "1:879544303818:web:a3e328a1b5a04bf63e3433",
  measurementId: "G-GPG192T0XH"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: any = null;
let auth: Auth;
let db: Firestore;

// Initialize Firebase for SSR/SSG
if (typeof window !== 'undefined') {
  // Client-side only code
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      
      // These imports are dynamically loaded only on client side
      const { getAnalytics } = require("firebase/analytics");
      
      auth = getAuth(app);
      db = getFirestore(app);
      analytics = getAnalytics(app);
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Provide fallbacks
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
  }
} else {
  // Server-side only code - minimal initialization
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    // Provide dummy implementations to prevent server-side errors
    auth = {} as Auth;
    db = {} as Firestore;
  } catch (error) {
    console.error("Firebase server-side initialization error:", error);
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
  }
}

export { app, analytics, auth, db }; 