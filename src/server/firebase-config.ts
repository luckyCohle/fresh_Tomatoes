// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
const firebaseConfig={
    apiKey: "AIzaSyAMRYDl4vY6JQ4lwZmtEEzAxnCIgXhF1sM",
    authDomain: "fresh-tomatoes-1b804.firebaseapp.com",
    projectId: "fresh-tomatoes-1b804",
    storageBucket: "fresh-tomatoes-1b804.appspot.com",
    messagingSenderId: "1088203048732",
    appId: "1:1088203048732:web:79495279a8acc6cae79cd9",
    measurementId: "G-XQE06S0HKR"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and export it
const db = getFirestore(app);
const auth = getAuth(app);
// export const projectId = "fresh-tomatoes-1b804";
export { auth, db, firebaseConfig };