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
    
    // Inject Theme Color dynamically for Tailwind v4
    if (currentCMSData.personal?.themeColor) {
      document.documentElement.style.setProperty('--theme-color', currentCMSData.personal.themeColor);
    }
    
    window.dispatchEvent(new Event("portfolio_db_updated"));
  }
};

try {
  // 1. Home Content
  console.log("📡 [Firestore Listener] Registering snapshot listener for: home/content");
  onSnapshot(doc(firestore, "home", "content"), (snapshot) => {
    console.log("📥 [Firestore Update] Received snapshot for home/content");
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
        themeColor: d.themeColor || "var(--theme-color)"
      };
      console.log("➡️ [CMS Sync] Merged home content into local state:", { name: d.name, avatar: d.profileImage });
      commitUpdate();
    } else {
      console.warn("⚠️ [Firestore Update] home/content snapshot is empty!");
    }
  });

  // 2. About Content
  console.log("📡 [Firestore Listener] Registering snapshot listener for: about/content");
  onSnapshot(doc(firestore, "about", "content"), (snapshot) => {
    console.log("📥 [Firestore Update] Received snapshot for about/content");
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      if (d.biography) currentCMSData.personal.about = d.biography;
      if (d.title) currentCMSData.personal.headline = d.title;
      if (d.profilePhoto) currentCMSData.personal.avatar = d.profilePhoto;
      if (d.resumeUrl) currentCMSData.personal.resumeLink = d.resumeUrl;
      
      currentCMSData.experience = d.experience || currentCMSData.experience;
      currentCMSData.education = d.education || currentCMSData.education;
      currentCMSData.achievements = d.achievements || currentCMSData.achievements;
      currentCMSData.certifications = d.certificates || d.certifications || currentCMSData.certifications;
      
      console.log("➡️ [CMS Sync] Merged about content:", {
        biographyLen: d.biography?.length || 0,
        experienceCount: d.experience?.length || 0,
        educationCount: d.education?.length || 0,
        achievementsCount: d.achievements?.length || 0,
        certificatesCount: (d.certificates || d.certifications)?.length || 0
      });
      commitUpdate();
    } else {
      console.warn("⚠️ [Firestore Update] about/content snapshot is empty!");
    }
  });

  // 3. Projects Content
  console.log("📡 [Firestore Listener] Registering snapshot listener for: projects/content");
  onSnapshot(doc(firestore, "projects", "content"), (snapshot) => {
    console.log("📥 [Firestore Update] Received snapshot for projects/content");
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
        console.log(`➡️ [CMS Sync] Merged ${currentCMSData.projects.length} projects.`);
        commitUpdate();
      }
    } else {
      console.warn("⚠️ [Firestore Update] projects/content snapshot is empty!");
    }
  });

  // 4. Skills Content
  console.log("📡 [Firestore Listener] Registering snapshot listener for: skills/content");
  onSnapshot(doc(firestore, "skills", "content"), (snapshot) => {
    console.log("📥 [Firestore Update] Received snapshot for skills/content");
    if (snapshot.exists()) {
      firebaseConnected = true;
      const d = snapshot.data();
      if (d.items) {
        currentCMSData.skills = d.items.filter(s => s.show !== false).map(s => ({
          name: s.name,
          level: s.percentage + '%',
          category: s.category
        }));
        console.log(`➡️ [CMS Sync] Merged ${currentCMSData.skills.length} active skills.`);
        commitUpdate();
      }
    } else {
      console.warn("⚠️ [Firestore Update] skills/content snapshot is empty!");
    }
  });

  // 5. Contact Settings
  console.log("📡 [Firestore Listener] Registering snapshot listener for: contact/settings");
  onSnapshot(doc(firestore, "contact", "settings"), (snapshot) => {
    console.log("📥 [Firestore Update] Received snapshot for contact/settings");
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
      console.log("➡️ [CMS Sync] Merged contact settings:", { email: d.email, phone: d.phone, address: d.address });
      commitUpdate();
    } else {
      console.warn("⚠️ [Firestore Update] contact/settings snapshot is empty!");
    }
  });

} catch (e) {
  console.error("❌ [Firestore Error] Error setting up database listeners:", e);
}

export const db = {
  getData: () => {
    let dataToReturn = cachedData;
    
    if (!dataToReturn) {
      if (typeof window === "undefined") {
        dataToReturn = defaultData;
      } else {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
          try {
            dataToReturn = JSON.parse(stored);
          } catch (e) {
            console.error("Error parsing stored database:", e);
            dataToReturn = defaultData;
          }
        } else {
          dataToReturn = defaultData;
        }
      }
      cachedData = dataToReturn;
    }
    
    if (typeof window !== "undefined" && dataToReturn.personal?.themeColor) {
      document.documentElement.style.setProperty('--theme-color', dataToReturn.personal.themeColor);
    }
    
    return dataToReturn;
  },

  isFirebaseConnected: () => firebaseConnected,
};

