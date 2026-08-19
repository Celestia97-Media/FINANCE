import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDku1YFGQ77w0MRRfZaMwzjq5dVd0yrwD0",
  authDomain: "finance-media-cdda1.firebaseapp.com",
  projectId: "finance-media-cdda1",
  storageBucket: "finance-media-cdda1.firebasestorage.app",
  messagingSenderId: "481704289185",
  appId: "1:481704289185:web:47d6384c98b5740e3121e0",
  measurementId: "G-ZK0HLTFNZB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics safely
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
