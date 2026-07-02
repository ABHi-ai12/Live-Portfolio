import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Save, Loader2, Mail, Check, Trash2, Archive, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageSkeleton } from '../components/PageSkeleton';
import { Skeleton } from '../components/Skeleton';

const defaultContactSettings = {
  email: '',
  phone: '',
  address: '',
  googleMapsLink: '',
  linkedin: '',
  github: '',
  instagram: '',
  twitter: '',
  whatsapp: '',
  availabilityStatus: 'Available for freelance work',
  footerText: '© 2024 Your Name. All rights reserved.'
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  
  // -- Settings State --
  const { data: settingsData, loading: settingsLoading, save: saveSettings } = useFirestoreDocument(
    'contact_settings',
    () => doc(firestore, 'contact', 'settings'),
    defaultContactSettings
  );
  
  const [formData, setFormData] = useState(defaultContactSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // -- Inbox State --
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Unread, Read
  const [searchTerm, setSearchTerm] = useState('');
  const [messageLimit, setMessageLimit] = useState(15);

  // Sync settings
  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  // Fetch Inbox
  useEffect(() => {
    const q = query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'), limit(messageLimit));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setLoadingMessages(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [messageLimit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await saveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save contact settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 'Read') return;
    try {
      await updateDoc(doc(firestore, 'contact_messages', id), { status: 'Read' });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(firestore, 'contact_messages', id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'Unread' && msg.status !== 'Unread') return false;
    if (filter === 'Read' && msg.status !== 'Read') return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (msg.name || '').toLowerCase().includes(term) ||
        (msg.email || '').toLowerCase().includes(term) ||
        (msg.subject || '').toLowerCase().includes(term) ||
        (msg.message || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'Unread').length;

  if (settingsLoading && loadingMessages) {
    return <PageSkeleton type="contact" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Contact & Inbox
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-zinc-400 mt-1">Manage your contact details and incoming messages.</p>
        </div>
        
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'inbox' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Inbox
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 border border-zinc-800 rounded-xl">
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['All', 'Unread', 'Read'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${filter === f ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loadingMessages ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-48 bg-zinc-800" />
                        <Skeleton className="h-4 w-32 bg-zinc-800/60" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 bg-zinc-800/60 rounded-lg" />
                        <Skeleton className="h-8 w-8 bg-zinc-800/60 rounded-lg" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full bg-zinc-800/40 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No messages found.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredMessages.map(msg => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={msg.id} 
                    className={`p-5 rounded-xl border transition-colors ${msg.status === 'Unread' ? 'bg-zinc-900 border-zinc-700' : 'bg-black border-zinc-800'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-medium flex items-center gap-2">
                          {msg.name} 
                          {msg.status === 'Unread' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        </h3>
                        <p className="text-sm text-zinc-400">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">{msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</p>
                      </div>
                    </div>
                    
                    {msg.subject && <h4 className="text-sm font-semibold text-zinc-300 mb-2">{msg.subject}</h4>}
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap bg-black/50 p-4 rounded-lg border border-zinc-800/50">{msg.message}</p>
                    
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800/50">
                      {msg.status === 'Unread' && (
                        <button onClick={() => markAsRead(msg.id, msg.status)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-400/10 hover:bg-green-400/20 rounded-md transition-colors">
                          <Check className="w-3.5 h-3.5" /> Mark Read
                        </button>
                      )}
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Inquiry'}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 rounded-md transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Reply
                      </a>
                      <button onClick={() => deleteMessage(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors ml-auto">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {messages.length >= messageLimit && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setMessageLimit(prev => prev + 15)}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Load More Messages
                </button>
              </div>
            )}
          </div>

        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="flex justify-end mb-4">
             <button
              onClick={handleSettingsSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
              Contact settings saved successfully!
            </div>
          )}

           {settingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <Skeleton className="h-6 w-32 bg-zinc-800" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16 bg-zinc-800" />
                      <Skeleton className="h-10 w-full bg-zinc-850 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <Skeleton className="h-6 w-32 bg-zinc-800" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16 bg-zinc-800" />
                      <Skeleton className="h-10 w-full bg-zinc-850 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Direct Contact</h2>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Google Maps Link</label>
                  <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
              </section>

              <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Social Links</h2>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">LinkedIn</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">GitHub</label>
                  <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Twitter / X</label>
                  <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Instagram</label>
                  <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">WhatsApp Link (e.g. wa.me/123...)</label>
                  <input type="url" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" />
                </div>
              </section>

              <section className="md:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Miscellaneous</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Availability Status</label>
                    <input type="text" name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" placeholder="e.g. Available for freelance work" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Footer Text</label>
                    <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 transition-colors" placeholder="© 2024..." />
                  </div>
                </div>
              </section>

            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}
