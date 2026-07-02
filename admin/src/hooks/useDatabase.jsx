import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { defaultData } from '../lib/defaultData';

export function useDatabase() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const dbRef = doc(firestore, 'portfolio', 'data');

    // 10-second timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading((prev) => {
          if (prev) {
            console.warn('Firebase took too long to respond. Falling back to default data.');
            setError(new Error('Connection timeout. Please check your internet connection and Firebase rules.'));
            return false;
          }
          return prev;
        });
      }
    }, 10000);

    const unsubscribe = onSnapshot(
      dbRef,
      (snapshot) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);

        if (snapshot.exists()) {
          setData(snapshot.data());
        } else {
          // Initialize with default data if empty
          console.log('No data found, initializing with defaults');
          setDoc(dbRef, defaultData).catch(err => {
            console.error('Failed to initialize default data:', err);
          });
          setData(defaultData);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        console.error('Database connection error:', err);
        setError('Failed to connect to database. Please check your connection.');
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const saveData = async (newData) => {
    const dbRef = doc(firestore, 'portfolio', 'data');
    await setDoc(dbRef, newData);
  };

  const resetData = async () => {
    const dbRef = doc(firestore, 'portfolio', 'data');
    await setDoc(dbRef, defaultData);
  };

  return { data, loading, error, saveData, resetData };
}
