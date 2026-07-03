import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';

import { doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Loader2, Save, UploadCloud, User, Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { PageSkeleton } from '../components/PageSkeleton';

const defaultAboutData = {
  profilePhoto: '',
  title: '',
  biography: '',
  resumeUrl: '',
  education: [],
  experience: [],
  achievements: [],
  certificates: [],
};

export default function AboutPage() {
  const { data, loading, save } = useFirestoreDocument(
    'about_content', 
    () => doc(firestore, 'about', 'content'),
    defaultAboutData
  );
  
  const [formData, setFormData] = useState(defaultAboutData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultAboutData,
        ...data
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      console.error("Error saving about data:", err);
      alert("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generic Array Item Management
  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), { id: Date.now().toString(), ...defaultItem }]
    }));
  };

  const updateArrayItem = (field, id, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const removeArrayItem = (field, id) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item.id !== id)
    }));
  };

  if (loading) {
    return <PageSkeleton type="about" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit About</h1>
          <p className="text-zinc-400 mt-1">Manage your biography, timeline, and resume.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
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
        
        {/* Profile & Resume */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">General Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">About Profile Photo URL</label>
              <div className="space-y-4">
                <input
                  type="text"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="https://..."
                />
                {formData.profilePhoto && !formData.profilePhoto.startsWith('/src/') && (
                  <img src={formData.profilePhoto} alt="Profile Preview" className="w-16 h-16 rounded-xl object-cover border-2 border-zinc-700" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Resume PDF URL</label>
              <input
                type="text"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="https://..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" placeholder="e.g. Full Stack Developer & UI/UX Enthusiast" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Biography</label>
              <textarea name="biography" rows="6" value={formData.biography} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-red-500 transition-colors" placeholder="Tell your story..." />
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Experience Timeline</h2>
            <button type="button" onClick={() => addArrayItem('experience', { role: '', company: '', period: '', description: '' })} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
          
          <Reorder.Group axis="y" values={formData.experience || []} onReorder={(val) => setFormData(p => ({...p, experience: val}))} className="space-y-4">
            {(formData.experience || []).map((exp) => (
              <Reorder.Item key={exp.id} value={exp} className="flex gap-4 p-4 bg-black border border-zinc-800 rounded-xl relative group">
                <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white pt-2"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Role" value={exp.role} onChange={(e) => updateArrayItem('experience', exp.id, 'role', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Period (e.g. 2020 - Present)" value={exp.period} onChange={(e) => updateArrayItem('experience', exp.id, 'period', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <textarea placeholder="Description" rows="1" value={exp.description} onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <button type="button" onClick={() => removeArrayItem('experience', exp.id)} className="text-zinc-500 hover:text-red-500 pt-2"><Trash2 className="w-5 h-5" /></button>
              </Reorder.Item>
            ))}
            {(!formData.experience || formData.experience.length === 0) && <p className="text-zinc-500 text-sm text-center py-4">No experience added yet.</p>}
          </Reorder.Group>
        </section>

        {/* Education Timeline */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Education Timeline</h2>
            <button type="button" onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', grade: '' })} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
          
          <Reorder.Group axis="y" values={formData.education || []} onReorder={(val) => setFormData(p => ({...p, education: val}))} className="space-y-4">
            {(formData.education || []).map((edu) => (
              <Reorder.Item key={edu.id} value={edu} className="flex gap-4 p-4 bg-black border border-zinc-800 rounded-xl relative group">
                <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white pt-2"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Degree / Course" value={edu.degree} onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateArrayItem('education', edu.id, 'institution', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateArrayItem('education', edu.id, 'year', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Grade / Score" value={edu.grade} onChange={(e) => updateArrayItem('education', edu.id, 'grade', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <button type="button" onClick={() => removeArrayItem('education', edu.id)} className="text-zinc-500 hover:text-red-500 pt-2"><Trash2 className="w-5 h-5" /></button>
              </Reorder.Item>
            ))}
             {(!formData.education || formData.education.length === 0) && <p className="text-zinc-500 text-sm text-center py-4">No education added yet.</p>}
          </Reorder.Group>
        </section>

        {/* Achievements Timeline */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Achievements</h2>
            <button type="button" onClick={() => addArrayItem('achievements', { title: '', date: '', description: '' })} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>
          
          <Reorder.Group axis="y" values={formData.achievements || []} onReorder={(val) => setFormData(p => ({...p, achievements: val}))} className="space-y-4">
            {(formData.achievements || []).map((ach) => (
              <Reorder.Item key={ach.id} value={ach} className="flex gap-4 p-4 bg-black border border-zinc-800 rounded-xl relative group">
                <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white pt-2"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Title" value={ach.title} onChange={(e) => updateArrayItem('achievements', ach.id, 'title', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Date (e.g. 2023)" value={ach.date} onChange={(e) => updateArrayItem('achievements', ach.id, 'date', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <textarea placeholder="Description" rows="1" value={ach.description} onChange={(e) => updateArrayItem('achievements', ach.id, 'description', e.target.value)} className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <button type="button" onClick={() => removeArrayItem('achievements', ach.id)} className="text-zinc-500 hover:text-red-500 pt-2"><Trash2 className="w-5 h-5" /></button>
              </Reorder.Item>
            ))}
             {(!formData.achievements || formData.achievements.length === 0) && <p className="text-zinc-500 text-sm text-center py-4">No achievements added yet.</p>}
          </Reorder.Group>
        </section>

        {/* Certificates Timeline */}
        <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Certificates</h2>
            <button type="button" onClick={() => addArrayItem('certificates', { name: '', issuer: '', date: '' })} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
              <Plus className="w-4 h-4" /> Add Certificate
            </button>
          </div>
          
          <Reorder.Group axis="y" values={formData.certificates || []} onReorder={(val) => setFormData(p => ({...p, certificates: val}))} className="space-y-4">
            {(formData.certificates || []).map((cert) => (
              <Reorder.Item key={cert.id} value={cert} className="flex gap-4 p-4 bg-black border border-zinc-800 rounded-xl relative group">
                <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white pt-2"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Certificate Name" value={cert.name} onChange={(e) => updateArrayItem('certificates', cert.id, 'name', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateArrayItem('certificates', cert.id, 'issuer', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                  <input type="text" placeholder="Date (e.g. 2024)" value={cert.date} onChange={(e) => updateArrayItem('certificates', cert.id, 'date', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <button type="button" onClick={() => removeArrayItem('certificates', cert.id)} className="text-zinc-500 hover:text-red-500 pt-2"><Trash2 className="w-5 h-5" /></button>
              </Reorder.Item>
            ))}
             {(!formData.certificates || formData.certificates.length === 0) && <p className="text-zinc-500 text-sm text-center py-4">No certificates added yet.</p>}
          </Reorder.Group>
        </section>

      </form>
    </div>
  );
}
