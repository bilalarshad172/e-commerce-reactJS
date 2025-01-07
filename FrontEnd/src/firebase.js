// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-46124.firebaseapp.com",
  projectId: "e-commerce-46124",
  storageBucket: "e-commerce-46124.firebasestorage.app",
  messagingSenderId: "976288408090",
  appId: "1:976288408090:web:55edfcd3bcd9ec363827a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);