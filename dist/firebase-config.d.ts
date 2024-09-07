declare const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};
declare const db: import("@firebase/firestore").Firestore;
declare const auth: import("@firebase/auth").Auth;
export { auth, db, firebaseConfig };
