// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyAakpB3UhayRuv-TWVtOgySjcsj3TjZh_0",
  authDomain: "kasi-in.firebaseapp.com",
  projectId: "kasi-in",
  storageBucket: "kasi-in.firebasestorage.app",
  messagingSenderId: "395888041621",
  appId: "1:395888041621:web:7518f2c2e44b1a9d51c59c",
  measurementId: "G-5HFXXH250X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth instance

export { auth }; // Export auth for use in other files
