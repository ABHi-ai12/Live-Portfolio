import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';
import { doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Plus, Trash2, Save, Loader2, GripVertical, Code2 } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const defaultSkillData = { items: [] };
const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Languages', 'Tools', 'Design'];

export default function SkillsPage() {
  const { data, loading, save } = useFirestoreDocument(
    'skills_content', 
    () => doc(firestore, 'skills', 'content'),
    defaultSkillData
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
      name: '',
      category: 'Frontend',
      percentage: '80',
      iconUrl: '',
      color: '#ff2a2a',
      show: true
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    if (confirm('Delete this skill?')) {
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
      console.error("Error saving skills:", err);
      alert("Failed to save skills.");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Skills</h1>
          <p className="text-zinc-400 mt-1">Manage and reorder your technical skills.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Skill
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
          Skills saved successfully! They are now live.
        </motion.div>
      )}

      {items.length === 0 && (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Code2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No skills yet</h3>
          <p className="text-zinc-500 mb-6">Add your first skill to showcase your expertise.</p>
          <button onClick={addItem} className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
            Add Skill
          </button>
        </div>
      )}

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl relative flex items-center gap-4 group">
            
            <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-white">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              <div className="md:col-span-3">
                <input type="text" placeholder="Skill Name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
              </div>

              <div className="md:col-span-2">
                 <select value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-2 text-white text-sm focus:border-red-500 transition-colors">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="md:col-span-2 flex items-center gap-2">
                <span className="text-xs text-zinc-500 w-6">{item.percentage}%</span>
                <input type="range" min="0" max="100" value={item.percentage} onChange={(e) => updateItem(item.id, 'percentage', e.target.value)} className="w-full accent-red-500" />
              </div>

              <div className="md:col-span-3">
                <input type="text" placeholder="Icon URL (e.g. svg/png link)" value={item.iconUrl} onChange={(e) => updateItem(item.id, 'iconUrl', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
              </div>

              <div className="md:col-span-1 flex items-center justify-center">
                <input type="color" value={item.color} onChange={(e) => updateItem(item.id, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-black border border-zinc-800 p-0.5" />
              </div>

              <div className="md:col-span-1 flex items-center justify-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                  <input type="checkbox" checked={item.show} onChange={(e) => updateItem(item.id, 'show', e.target.checked)} className="rounded bg-black border-zinc-700 text-red-500 focus:ring-red-500 focus:ring-offset-zinc-900" />
                  Show
                </label>
              </div>

            </div>

            <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

    </div>
  );
}

