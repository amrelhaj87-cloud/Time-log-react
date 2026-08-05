import { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDwxMNlPwN1OzCEHr_9szajTOBvZIBKkfQ",
  authDomain: "time-log-ad714.firebaseapp.com",
  projectId: "time-log-ad714",
  storageBucket: "time-log-ad714.firebasestorage.app",
  messagingSenderId: "334822322788",
  appId: "1:334822322788:web:e4522aca1292420404e571",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) setUser(res.user);
      })
      .catch((err) => console.error("Redirect login error:", err));

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const loginWithEmail = (e: string, p: string) => signInWithEmailAndPassword(auth, e, p);
  const signUpWithEmail = (e: string, p: string) => createUserWithEmailAndPassword(auth, e, p);
  const logout = async () => {
    await signOut(auth);
  };
  const resetPassword = (e: string) => sendPasswordResetEmail(auth, e);

  return { user, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout, resetPassword };
}