import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signUpUser(username: string, email: string, password: string): Promise<void> {
  try {
    // Attempt to create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      reviews: [],
      watchlist: []
    });

    console.log('User signed up and data saved to Firestore');
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('Email is already in use, please log in instead.');
      // Optional: You can also send an error response or handle it in the UI
    } else {
      console.error('Error signing up:', error);
    }
  }
}
