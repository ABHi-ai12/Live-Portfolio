import { useState, useEffect, useRef, useCallback } from 'react';
import { onSnapshot, setDoc, doc } from 'firebase/firestore';

export function useFirestoreDocument(cacheKey, docRefFactory, defaultData = {}) {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`firestore_cache_${cacheKey}`);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.warn("Failed to parse local cache:", err);
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const docRefFactoryRef = useRef(docRefFactory);
  useEffect(() => {
    docRefFactoryRef.current = docRefFactory;
  });

  const connect = useCallback(() => {
    let isMounted = true;
    let unsubscribe = null;
    
    if (!data || retryCount > 0) {
      setLoading(true);
    }
    
    setError(null);
    setIsOffline(false);

    let timeoutId;

    const handleError = (err) => {
      if (!isMounted) return;
      console.error(`Firebase error [${cacheKey}]:`, err);
      
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      clearTimeout(timeoutId);

      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          if (isMounted) setRetryCount((c) => c + 1);
        }, delay);
      } else {
        setIsOffline(true);
        setError(new Error('Unable to connect to the database. Displaying offline data.'));
        setLoading(false);
      }
    };

    timeoutId = setTimeout(() => {
      if (isMounted) {
        handleError(new Error('Connection timeout.'));
      }
    }, 10000);

    try {
      const dRef = docRefFactoryRef.current();
      unsubscribe = onSnapshot(
        dRef, 
        async (snapshot) => {
          if (!isMounted) return;
          clearTimeout(timeoutId);
          
          let docData;
          if (snapshot.exists()) {
            docData = snapshot.data();
          } else {
            console.log(`No data found for ${cacheKey}, initializing with defaults.`);
            try {
              await setDoc(dRef, defaultData);
              docData = defaultData;
            } catch (err) {
              console.error("Failed to initialize default doc data:", err);
              docData = defaultData; // still show defaults locally
            }
          }
          
          setData(docData);
          setRetryCount(0);
          setError(null);
          setIsOffline(false);
          setLoading(false);

          try {
            localStorage.setItem(`firestore_cache_${cacheKey}`, JSON.stringify(docData));
          } catch (e) {
            console.warn("Failed to cache firestore data locally", e);
          }
        }, 
        (err) => {
          handleError(err);
        }
      );
    } catch (err) {
      handleError(err);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, retryCount]);

  useEffect(() => {
    return connect();
  }, [connect]);

  const retry = useCallback(() => {
    setRetryCount(0);
  }, []);

  const save = async (newData) => {
    const dRef = docRefFactoryRef.current();
    await setDoc(dRef, newData, { merge: true });
  };

  return { data, loading, error, isOffline, retry, save };
}
