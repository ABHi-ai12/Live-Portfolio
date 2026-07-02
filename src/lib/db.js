import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "./firebase";
import { defaultData } from "./defaultData";

const DB_KEY = "abhinav_portfolio_db_v2";
let cachedData = null;
let firebaseConnected = false;

// We will maintain a local state object that merges all our CMS collections
// into the structure that the public frontend expects.
let currentCMSData = {
  ...defaultData
};

/**
 * Helper to update the cache and dispatch the event
 */
const commitUpdate = () => {
  cachedData = JSON.parse(JSON.stringify(currentCMSData));
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_KEY, JSON.stringify(cachedData));
    window.dispatchEvent(new Event("portfolio_db_updated"));
  }
};

try {
  // 1. Home Content
  onSnapshot(doc(firestore, "home", "content"), (snapshot) => {
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      currentCMSData.personal = {
        ...currentCMSData.personal,
        name: d.name || currentCMSData.personal.name,
        headline: d.profession || currentCMSData.personal.headline,
        tagline: d.shortDescription || currentCMSData.personal.tagline,
        avatar: d.profileImage || currentCMSData.personal.avatar,
        videoUrl: d.heroBackground || currentCMSData.personal.videoUrl,
        github: d.github || currentCMSData.personal.github,
        linkedin: d.linkedin || currentCMSData.personal.linkedin,
        twitter: d.twitter || currentCMSData.personal.twitter,
        email: d.email || currentCMSData.personal.email,
        phone: d.phone || currentCMSData.personal.phone,
        themeColor: d.themeColor || "#ff2a2a"
      };
      commitUpdate();
    }
  });

  // 2. About Content
  onSnapshot(doc(firestore, "about", "content"), (snapshot) => {
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      if (d.biography) currentCMSData.personal.about = d.biography;
      if (d.title) currentCMSData.personal.headline = d.title;
      if (d.profilePhoto) currentCMSData.personal.avatar = d.profilePhoto;
      if (d.resumeUrl) currentCMSData.personal.resumeLink = d.resumeUrl;
      
      currentCMSData.experience = d.experience || currentCMSData.experience;
      currentCMSData.education = d.education || currentCMSData.education;
      commitUpdate();
    }
  });

  // 3. Projects Content
  onSnapshot(doc(firestore, "projects", "content"), (snapshot) => {
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      if (d.items) {
        currentCMSData.projects = d.items.map(p => ({
          title: p.title,
          description: p.shortDescription || p.longDescription,
          link: p.demo || p.github,
          tech: p.tech ? p.tech.split(',').map(t=>t.trim()) : [],
          image: p.projectImage
        }));
        commitUpdate();
      }
    }
  });

  // 4. Skills Content
  onSnapshot(doc(firestore, "skills", "content"), (snapshot) => {
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      if (d.items) {
        currentCMSData.skills = d.items.filter(s => s.show !== false).map(s => ({
          name: s.name,
          level: s.percentage + '%',
          category: s.category
        }));
        commitUpdate();
      }
    }
  });

  // 5. Contact Settings
  onSnapshot(doc(firestore, "contact", "settings"), (snapshot) => {
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      currentCMSData.personal = {
        ...currentCMSData.personal,
        email: d.email || currentCMSData.personal.email,
        phone: d.phone || currentCMSData.personal.phone,
        location: d.address || currentCMSData.personal.location,
        linkedin: d.linkedin || currentCMSData.personal.linkedin,
        github: d.github || currentCMSData.personal.github,
        twitter: d.twitter || currentCMSData.personal.twitter,
        whatsapp: d.whatsapp || currentCMSData.personal.whatsapp,
        availability: d.availabilityStatus,
        footerText: d.footerText
      };
      commitUpdate();
    }
  });

} catch (e) {
  console.warn("Firebase not configured, using local data:", e.message);
}

export const db = {
  getData: () => {
    if (cachedData) return cachedData;
    
    if (typeof window === "undefined") return defaultData;
    
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        cachedData = JSON.parse(stored);
        return cachedData;
      } catch (e) {
        console.error("Error parsing stored database:", e);
      }
    }
    
    return defaultData;
  },

  isFirebaseConnected: () => firebaseConnected,
};

