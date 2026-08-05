import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// المفاتيح العامة لـ Firebase (مخصصة للعميل ومحمية عبر قواعد Firestore Rules)
const firebaseConfig = {
  apiKey: "AIzaSyDwxMNlPwN1OzCEHr_9szajTOBvZIBKkfQ",
  authDomain: "time-log-ad714.firebaseapp.com",
  projectId: "time-log-ad714",
  storageBucket: "time-log-ad714.firebasestorage.app",
  messagingSenderId: "334822322788",
  appId: "1:334822322788:web:e4522aca1292420404e571"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");