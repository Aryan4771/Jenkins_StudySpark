// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAz9xqi84f2pv7Rd-ZOQIIILkHbnZsTwQ",
  authDomain: "studyspark-80ca9.firebaseapp.com",
  projectId: "studyspark-80ca9",
  storageBucket: "studyspark-80ca9.firebasestorage.app",
  messagingSenderId: "456965268219",
  appId: "1:456965268219:web:606bea45511c85dffa465e",
  measurementId: "G-T352SZLRES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
