import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const cleanEnv = (val) => typeof val === 'string' ? val.replace(/[\r\n\s]+/g, '').trim() : val;

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID)
};

console.log("🔥 [Admin Firebase Init] Initializing Firebase with config:", {
  projectId: firebaseConfig.projectId,
  hasApiKey: Boolean(firebaseConfig.apiKey),
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
});

let app;
let auth;
let firestore;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
  console.log("✅ [Admin Firebase Init] Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ [Admin Firebase Init] Error initializing Firebase:", error);
}

export { auth, firestore, storage };
