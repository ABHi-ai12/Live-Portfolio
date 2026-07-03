import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';

import { doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Plus, Trash2, Save, Loader2, GripVertical, UploadCloud, Image as ImageIcon, FolderKanban } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { PageSkeleton } from '../components/PageSkeleton';

const defaultProjectData = { items: [] };

export default function ProjectsPage() {
  const { data, loading, save } = useFirestoreDocument(
    'projects_content', 
    () => doc(firestore, 'projects', 'content'),
    defaultProjectData
  );
  
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data && data.items) {
      setItems(data.items);
    }
  }, [data]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      shortDescription: '',
      longDescription: '',
      tech: '',
      category: '',
      github: '',
      demo: '',
      featured: false,
      status: 'Completed',
      date: '',
      projectImage: ''
    };
    setItems([newItem, ...items]);
  };

  const removeItem = (id) => {
    if (confirm('Delete this project?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await save({ items });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving projects:", err);
      alert("Failed to save projects.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <PageSkeleton type="projects" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Projects</h1>
          <p className="text-zinc-400 mt-1">Manage, reorder, and upload project images.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
          Projects saved successfully! They are now live.
        </motion.div>
      )}

      {items.length === 0 && (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <FolderKanban className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 mb-6">Create your first project to showcase your work.</p>
          <button onClick={addItem} className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
            Add Project
          </button>
        </div>
      )}

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-6">
        {items.map((item, index) => (
          <Reorder.Item key={item.id} value={item} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl relative flex gap-6 group">
            
            <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-white pt-2">
              <GripVertical className="w-6 h-6" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Project Image URL Input */}
              <div className="md:col-span-2 flex items-center justify-between border-b border-zinc-800 pb-4 gap-4">
                <div className="flex-1 flex items-center gap-4">
                  {item.projectImage && !item.projectImage.startsWith('/src/') ? (
                    <img src={item.projectImage} alt="Project" className="w-24 h-16 rounded-lg object-cover border-2 border-zinc-700 shrink-0" />
                  ) : (
                    <div className="w-24 h-16 rounded-lg bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 border-dashed shrink-0">
                      <ImageIcon className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Project Image URL</label>
                    <input
                      type="text"
                      value={item.projectImage || ''}
                      onChange={(e) => updateItem(item.id, 'projectImage', e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Title</label>
                  <input type="text" value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Category</label>
                  <input type="text" value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Tech Stack (comma-separated)</label>
                  <input type="text" value={item.tech} onChange={(e) => updateItem(item.id, 'tech', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Short Description</label>
                  <textarea rows="2" value={item.shortDescription} onChange={(e) => updateItem(item.id, 'shortDescription', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">GitHub Link</label>
                    <input type="url" value={item.github} onChange={(e) => updateItem(item.id, 'github', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Live Demo</label>
                    <input type="url" value={item.demo} onChange={(e) => updateItem(item.id, 'demo', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-zinc-500 mb-1">Long Description</label>
                <textarea rows="3" value={item.longDescription} onChange={(e) => updateItem(item.id, 'longDescription', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
              </div>
              
              <div className="md:col-span-2 flex items-center gap-6 pt-2">
                 <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={item.featured} onChange={(e) => updateItem(item.id, 'featured', e.target.checked)} className="rounded bg-black border-zinc-700 text-red-500 focus:ring-red-500 focus:ring-offset-zinc-900" />
                  Featured Project
                </label>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  Status: 
                  <select value={item.status} onChange={(e) => updateItem(item.id, 'status', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-2 py-1 text-white text-sm focus:border-red-500 transition-colors">
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  Date: <input type="text" placeholder="e.g. 2024" value={item.date} onChange={(e) => updateItem(item.id, 'date', e.target.value)} className="w-24 bg-black border border-zinc-800 rounded-lg px-2 py-1 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
              </div>

            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

    </div>
  );
}
