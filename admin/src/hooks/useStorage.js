import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export function useStorage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, path) => {
    if (!file) return null;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Storage upload error:", error);
          setError(error);
          setUploading(false);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setUploadProgress(100);
            resolve(downloadURL);
          } catch (err) {
            setError(err);
            setUploading(false);
            reject(err);
          }
        }
      );
    });
  };

  const deleteFile = async (pathOrUrl) => {
    try {
      // If it's a full URL, we would need to extract the path.
      // But typically we pass the relative path like 'projects/image.jpg'
      let storageRef;
      if (pathOrUrl.startsWith('http')) {
        // Simple extraction for firebase storage URLs (best effort)
        // A safer way is to store the path alongside the URL in Firestore.
        // For now, this requires the exact reference path.
        console.warn("deleteFile requires a storage path, not a full URL.");
        return;
      } else {
        storageRef = ref(storage, pathOrUrl);
      }
      
      await deleteObject(storageRef);
    } catch (err) {
      console.error("Storage delete error:", err);
      // Don't throw, just log. Sometimes files are already deleted.
    }
  };

  return { uploadFile, deleteFile, uploading, uploadProgress, error };
}
