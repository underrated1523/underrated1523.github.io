// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOyI-Ff9J0y546P1qF2LKsXEnER7D9fos",
  authDomain: "animetierlist-24d49.firebaseapp.com",
  projectId: "animetierlist-24d49",
  storageBucket: "animetierlist-24d49.firebasestorage.app",
  messagingSenderId: "183900788946",
  appId: "1:183900788946:web:702fdec54998bfc742b50b",
  measurementId: "G-5SNZTGGFL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {
    app
}