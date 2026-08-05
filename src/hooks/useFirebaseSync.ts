import { useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from 'firebase/auth';

export function useFirebaseSync(user: User | null) {
  const syncDayToCloud = useCallback(async (dateStr: string, dayData: any) => {
    if (!user) return;
    try {
      const docRef = doc(db, `users/${user.uid}/days/${dateStr}`);
      await setDoc(docRef, {
        ...dayData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore sync error:", err);
    }
  }, [user]);

  const loadDayFromCloud = useCallback(async (dateStr: string) => {
    if (!user) return null;
    try {
      const docRef = doc(db, `users/${user.uid}/days/${dateStr}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn("Firestore load error:", err);
    }
    return null;
  }, [user]);

  return { syncDayToCloud, loadDayFromCloud };
}