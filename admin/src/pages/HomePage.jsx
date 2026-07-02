import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';
import { useStorage } from '../hooks/useStorage';
import { doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Loader2, Save, Image as ImageIcon, UploadCloud, User } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultHomeData = {
  name: '',
  profession: '',
  shortDescription: '',
  heroBackground: '',
  profileImage: '',
  github: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  email: '',
  phone: '',
  location: '',
  resumeLink: '',
  themeColor: '#ff2a2a',
};

export default function HomePage() {
  const { data, loading, save } = useFirestoreDocument(
    'home_content', 
    () => doc(firestore, 'home', 'content'),
    defaultHomeData
  );
  
  const { uploadFile, uploading } = useStorage();
  const [formData, setFormData] = useState(defaultHomeData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = `home/${field}_${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error(`Error uploading ${field}:`, err);
      alert(`Failed to upload ${field}.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await save(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving home data:", err);
      alert("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Home</h1>
          <p className="text-zinc-400 mt-1">Manage your hero section and personal details.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving || uploading}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
          Changes saved successfully! They are now live on your portfolio.
        </motion.div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* Media Section */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Profile Image</label>
              <div className="flex items-center gap-4">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 border-dashed">
                    <User className="w-6 h-6 text-zinc-500" />
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 bg-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'profileImage')} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Background (Image/Video URL)</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="heroBackground"
                  value={formData.heroBackground}
                  onChange={handleChange}
                  className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="https://..."
                />
                <label className="cursor-pointer px-4 py-2 bg-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2 shrink-0">
                  <UploadCloud className="w-4 h-4" />
                  Upload
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroBackground')} />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Profession / Headline</label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Short Description</label>
              <textarea name="shortDescription" rows="3" value={formData.shortDescription} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
          </div>
        </section>

        {/* Links & Socials */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Links & Socials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Resume Button Link</label>
              <input type="text" name="resumeLink" value={formData.resumeLink} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Theme Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-black border border-zinc-800" />
                <input type="text" name="themeColor" value={formData.themeColor} onChange={handleChange} className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">GitHub</label>
              <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">LinkedIn</label>
              <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Twitter/X</label>
              <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" />
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
