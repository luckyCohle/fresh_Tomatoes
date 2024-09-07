// Firebase imports and initialization
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login Interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: any; // You might want to define a more specific user type
}

// Firebase login function
export async function loginUser({ email, password }: LoginCredentials): Promise<LoginResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      message: 'Login successful',
      user: userCredential.user
    };
  } catch (error: any) {
    let errorMessage = 'Login failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No user found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    }
    return {
      success: false,
      message: errorMessage
    };
  }
}
