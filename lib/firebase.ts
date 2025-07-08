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

// Initialize Firebase for SSR/SSG
if (typeof window !== 'undefined') {
  // Client-side only code
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Provide fallback
    app = {} as FirebaseApp;
  }
} else {
  // Server-side only code - minimal initialization
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  } catch (error) {
    console.error("Firebase server-side initialization error:", error);
    app = {} as FirebaseApp;
  }
}

export { app }; 