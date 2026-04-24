import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfYctdBmX-CAk_k-9fgfZN2XXGzTPYOGE",
  authDomain: "dukalis-club.firebaseapp.com",
  projectId: "dukalis-club",
  storageBucket: "dukalis-club.firebasestorage.app",
  messagingSenderId: "174381191211",
  appId: "1:174381191211:web:ad519987e1991e78785a6e",
  measurementId: "G-090EZT57H5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
