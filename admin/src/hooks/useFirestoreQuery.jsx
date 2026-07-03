import { useState, useEffect, useRef, useCallback } from 'react';
import { onSnapshot } from 'firebase/firestore';

export function useFirestoreQuery(cacheKey, queryFactory) {
  // Initialize from cache if available
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`firestore_cache_${cacheKey}`);
      return cached ? JSON.parse(cached) : { size: 0, items: [] };
    } catch (err) {
      console.warn("Failed to parse local cache:", err);
      return { size: 0, items: [] };
    }
  });
  
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(`firestore_cache_${cacheKey}`);
      return cached ? false : true;
    } catch {
      return true;
    }
  });
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Keep a stable reference to queryFactory to prevent infinite loops
  const queryFactoryRef = useRef(queryFactory);
  useEffect(() => {
    queryFactoryRef.current = queryFactory;
  });

  const connect = useCallback(() => {
    let isMounted = true;
    let unsubscribe = null;
    
    // Only show loading state if we have no cached data at all,
    // OR if we are doing a fresh retry connection
    if (data.items.length === 0 || retryCount > 0) {
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
        console.warn(`[${cacheKey}] Retrying in ${delay}ms... (Attempt ${retryCount + 1} of 3)`);
        setTimeout(() => {
          if (isMounted) setRetryCount((c) => c + 1);
        }, delay);
      } else {
        setIsOffline(true);
        let userMessage = 'Unable to connect to the database. ';
        if (err.message && err.message.includes('BLOCKED_BY_CLIENT')) {
          userMessage += 'Connection blocked by your ad-blocker or browser shields. ';
        }
        userMessage += 'Displaying offline data.';
        setError(new Error(userMessage));
        setLoading(false);
      }
    };

    timeoutId = setTimeout(() => {
      if (isMounted) {
        handleError(new Error('Connection timeout - server did not respond within 10 seconds.'));
      }
    }, 10000);

    try {
      const q = queryFactoryRef.current();
      console.log(`📡 [Admin Firestore Query] Setting up query listener for: ${cacheKey}`);
      unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          if (!isMounted) return;
          clearTimeout(timeoutId);
          
          const parsedData = {
            size: snapshot.size,
            items: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          };
          console.log(`📥 [Admin Firestore Query] Received query snapshot for: ${cacheKey}. Count: ${snapshot.size}`);
          
          setData(parsedData);
          setRetryCount(0);
          setError(null);
          setIsOffline(false);
          setLoading(false);

          try {
            localStorage.setItem(`firestore_cache_${cacheKey}`, JSON.stringify(parsedData));
          } catch (e) {
            console.warn("Failed to cache firestore data locally", e);
          }
        }, 
        (err) => {
          console.error(`❌ [Admin Firestore Query] Error listening to query for: ${cacheKey}`, err);
          handleError(err);
        }
      );
    } catch (err) {
      handleError(err);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        console.log(`🔌 [Admin Firestore Query] Unsubscribing query listener for: ${cacheKey}`);
        unsubscribe();
      }
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, retryCount]); // Depend on retryCount so it loops when retryCount increments

  useEffect(() => {
    return connect();
  }, [connect]);

  const retry = useCallback(() => {
    setRetryCount(0);
    // Setting retryCount to 0 triggers the connect useCallback/useEffect chain
  }, []);

  return { data, loading, error, isOffline, retry };
}
