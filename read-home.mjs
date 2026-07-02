import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

// Manually parse .env.production.local
try {
  const content = fs.readFileSync(".env.production.local", "utf8");
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const k = trimmed.substring(0, idx).trim();
    let v = trimmed.substring(idx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.substring(1, v.length - 1);
    } else if (v.startsWith("'") && v.endsWith("'")) {
      v = v.substring(1, v.length - 1);
    }
    process.env[k] = v;
  });
} catch (e) {
  console.warn("Failed to load env file:", e);
}

const cleanEnvVar = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/\\r/g, '')
    .replace(/\\n/g, '')
    .replace(/[\r\n]+/g, '')
    .trim();
};

const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(process.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(process.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(process.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(process.env.VITE_FIREBASE_APP_ID)
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function check() {
  try {
    const snap = await getDoc(doc(firestore, "home", "content"));
    if (snap.exists()) {
      console.log("Document home/content exists! Data:");
      console.log(JSON.stringify(snap.data(), null, 2));
    } else {
      console.log("Document home/content does NOT exist in Firestore.");
    }
  } catch (err) {
    console.error("Error reading Firestore:", err);
  }
}

check();
