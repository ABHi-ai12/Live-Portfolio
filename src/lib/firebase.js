import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * 
 * Reads from VITE_FIREBASE_* environment variables in .env.local.
 * Connects to Firestore for all portfolio data and contact messages.
 */
const cleanEnv = (val) => typeof val === 'string' ? val.replace(/[\r\n\s]+/g, '').trim() : val;

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID)
};

console.log("🔥 [Firebase Init] Initializing Firebase with config:", {
  projectId: firebaseConfig.projectId,
  hasApiKey: Boolean(firebaseConfig.apiKey),
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
});

let app;
let firestore;

try {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  console.log("✅ [Firebase Init] Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ [Firebase Init] Error initializing Firebase:", error);
}

export { firestore };
