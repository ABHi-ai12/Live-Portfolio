import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '../hooks/useFirestoreDocument';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit, setDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { 
  Save, Loader2, Mail, Check, Trash2, Archive, MessageSquare, 
  Reply, AlertCircle, CheckCircle2, Clock, X, Bold, Italic, 
  Link as LinkIcon, List, FileUp 
} from 'lucide-react';
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

const formatMessageDate = (createdAt) => {
  if (!createdAt) return 'Just now';
  if (createdAt.seconds) {
    return new Date(createdAt.seconds * 1000).toLocaleString();
  }
  if (createdAt.toDate && typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toLocaleString();
  }
  const parsed = new Date(createdAt);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleString();
  }
  return 'Just now';
};

const ReplyThread = ({ messageId }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repliesRef = collection(firestore, 'contact_messages', messageId, 'replies');
    const q = query(repliesRef, orderBy('sentAt', 'asc'));
    
    console.log(`📡 [Admin Replies] Listening to replies for message: ${messageId}`);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReplies(list);
      setLoading(false);
      console.log(`📥 [Admin Replies] Loaded ${list.length} replies for message: ${messageId}`);
    }, (err) => {
      console.error(`❌ [Admin Replies] Error loading replies for: ${messageId}`, err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [messageId]);

  if (loading) return null;
  if (replies.length === 0) return null;

  return (
    <div className="mt-4 pl-4 border-l border-zinc-800 space-y-3">
      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">// Conversation History</h5>
      {replies.map((reply) => {
        return (
          <div key={reply.id} className="p-3 bg-zinc-900/20 rounded-lg border border-zinc-800/60 space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-zinc-400">Replied by {reply.sentBy}</span>
              <span className="text-zinc-500">{formatMessageDate(reply.sentAt)}</span>
            </div>
            <p className="text-xs text-zinc-300 whitespace-pre-wrap">{reply.message}</p>
            <div className="flex items-center gap-1 text-[9px]">
              {reply.status === 'Sent' && (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Sent Successfully
                </span>
              )}
              {reply.status === 'Failed' && (
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <AlertCircle className="w-3 h-3" /> Failed: {reply.error || 'Unknown error'}
                </span>
              )}
              {reply.status === 'Sending' && (
                <span className="flex items-center gap-1 text-amber-400 font-medium animate-pulse">
                  <Clock className="w-3 h-3" /> Sending...
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function ContactPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  
  // -- Reply Modal State --
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeReplyMessage, setActiveReplyMessage] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [toast, setToast] = useState(null);

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
  const [filter, setFilter] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [messageLimit, setMessageLimit] = useState(15);

  const handleOpenReplyModal = (msg) => {
    setActiveReplyMessage(msg);
    setRecipientName(msg.name || '');
    setReplySubject(`Re: ${msg.subject || 'Your Inquiry'}`);
    setReplyMessage('');
    setAttachment(null);
    setAttachmentName('');
    setReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setReplyModalOpen(false);
    setActiveReplyMessage(null);
    setRecipientName('');
    setReplySubject('');
    setReplyMessage('');
    setAttachment(null);
    setAttachmentName('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachment(null);
      setAttachmentName('');
      return;
    }
    
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        filename: file.name,
        content: reader.result.split(',')[1],
        contentType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const insertFormatting = (tagOpen, tagClose = '') => {
    const textarea = document.getElementById('reply-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = tagOpen + selectedText + tagClose;

    setReplyMessage(
      text.substring(0, start) + replacement + text.substring(end)
    );

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 0);
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeReplyMessage) return;

    const msg = activeReplyMessage;
    const repliesCollection = collection(firestore, 'contact_messages', msg.id, 'replies');
    const newReplyDoc = doc(repliesCollection);
    const replyId = newReplyDoc.id;

    const replyData = {
      id: replyId,
      subject: replySubject,
      message: replyMessage,
      sentAt: new Date().toISOString(),
      sentBy: user?.email || 'admin@gmail.com',
      status: 'Sending'
    };

    setIsSendingReply(true);

    try {
      await setDoc(newReplyDoc, replyData);
      await updateDoc(doc(firestore, 'contact_messages', msg.id), { status: 'Read' });
      handleCloseReplyModal();

      const idToken = await user.getIdToken();
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          to: msg.email,
          toName: recipientName,
          subject: replySubject,
          messageHtml: replyMessage.replace(/\n/g, '<br>'),
          messageText: stripHtml(replyMessage),
          attachment
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');

      await updateDoc(newReplyDoc, { status: 'Sent' });
      setToast({ type: 'success', message: 'Email sent successfully!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('❌ Error sending reply:', err);
      await updateDoc(newReplyDoc, { status: 'Failed', error: err.message || 'Unknown network error' });
      setToast({ type: 'error', message: `Failed to send email: ${err.message}` });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Sync settings
  useEffect(() => {
    if (settingsData) setFormData(settingsData);
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

  if (settingsLoading && loadingMessages) return <PageSkeleton type="contact" />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Contact & Inbox
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
          </h1>
          <p className="text-zinc-400 mt-1">Manage your contact details and incoming messages.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'inbox' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Inbox</button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}>Settings</button>
        </div>
      </div>

      {activeTab === 'inbox' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 border border-zinc-800 rounded-xl">
            <input type="text" placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500" />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['All', 'Unread', 'Read'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-md border ${filter === f ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loadingMessages ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1"><Skeleton className="h-5 w-48 bg-zinc-800" /><Skeleton className="h-4 w-32 bg-zinc-800/60" /></div>
                      <div className="flex gap-2"><Skeleton className="h-8 w-16 bg-zinc-800/60 rounded-lg" /><Skeleton className="h-8 w-8 bg-zinc-800/60 rounded-lg" /></div>
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
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={msg.id} className={`p-5 rounded-xl border transition-colors ${msg.status === 'Unread' ? 'bg-zinc-900 border-zinc-700' : 'bg-black border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-medium flex items-center gap-2">
                          {msg.name} 
                          {msg.status === 'Unread' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        </h3>
                        <p className="text-sm text-zinc-400">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">{formatMessageDate(msg.createdAt)}</p>
                      </div>
                    </div>
                    {msg.subject && <h4 className="text-sm font-semibold text-zinc-300 mb-2">{msg.subject}</h4>}
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap bg-black/50 p-4 rounded-lg border border-zinc-800/50">{msg.message}</p>
                    <ReplyThread messageId={msg.id} />
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800/50">
                      {msg.status === 'Unread' && (
                        <button onClick={() => markAsRead(msg.id, msg.status)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-400/10 hover:bg-green-400/20 rounded-md transition-colors"><Check className="w-3.5 h-3.5" /> Mark Read</button>
                      )}
                      <button type="button" onClick={() => handleOpenReplyModal(msg)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 rounded-md transition-colors cursor-pointer"><Reply className="w-3.5 h-3.5" /> Reply</button>
                      <button onClick={() => deleteMessage(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors ml-auto"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModalOpen && activeReplyMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Reply className="w-5 h-5 text-red-500" />
                  Reply to {activeReplyMessage.name}
                </h3>
                <button 
                  onClick={handleCloseReplyModal}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Recipient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient Email</label>
                    <input 
                      type="text" 
                      value={activeReplyMessage.email} 
                      readOnly 
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient Name</label>
                    <input 
                      type="text" 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    type="text" 
                    value={replySubject} 
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Message Body</label>
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 bg-black/40 border border-zinc-800 rounded-md p-1">
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<b>', '</b>')}
                        title="Bold"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors text-xs font-bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<i>', '</i>')}
                        title="Italic"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors text-xs italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter the link URL:');
                          if (url) insertFormatting(`<a href="${url}" target="_blank">`, '</a>');
                        }}
                        title="Link"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                        title="Bullet List"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea 
                    id="reply-editor"
                    rows={8}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                    placeholder="Type your message here. You can use the formatting toolbar or HTML tags."
                  />
                </div>

                {/* Attachment Upload */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Attachment (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg text-sm transition-colors font-medium">
                      <FileUp className="w-4 h-4" />
                      {attachmentName ? 'Change File' : 'Upload File'}
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {attachmentName && (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 bg-black border border-zinc-800 px-3 py-2 rounded-lg">
                        <span>{attachmentName}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setAttachment(null);
                            setAttachmentName('');
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-black/20">
                <button 
                  type="button"
                  onClick={handleCloseReplyModal}
                  className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isSendingReply || !replyMessage.trim()}
                  onClick={handleSendReply}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 animate-out fade-out duration-300">
          <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-2xl ${
            toast.type === 'success' 
              ? 'bg-zinc-900 border-green-500/30 text-white' 
              : 'bg-zinc-900 border-red-500/30 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
        </motion.div>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModalOpen && activeReplyMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Reply className="w-5 h-5 text-red-500" />
                  Reply to {activeReplyMessage.name}
                </h3>
                <button 
                  onClick={handleCloseReplyModal}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Recipient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient Email</label>
                    <input 
                      type="text" 
                      value={activeReplyMessage.email} 
                      readOnly 
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient Name</label>
                    <input 
                      type="text" 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    type="text" 
                    value={replySubject} 
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Message Body</label>
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 bg-black/40 border border-zinc-800 rounded-md p-1">
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<b>', '</b>')}
                        title="Bold"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors text-xs font-bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<i>', '</i>')}
                        title="Italic"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors text-xs italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter the link URL:');
                          if (url) insertFormatting(`<a href="${url}" target="_blank">`, '</a>');
                        }}
                        title="Link"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                        title="Bullet List"
                        className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-850 rounded transition-colors"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea 
                    id="reply-editor"
                    rows={8}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                    placeholder="Type your message here. You can use the formatting toolbar or HTML tags."
                  />
                </div>

                {/* Attachment Upload */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Attachment (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg text-sm transition-colors font-medium">
                      <FileUp className="w-4 h-4" />
                      {attachmentName ? 'Change File' : 'Upload File'}
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {attachmentName && (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 bg-black border border-zinc-800 px-3 py-2 rounded-lg">
                        <span>{attachmentName}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setAttachment(null);
                            setAttachmentName('');
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-black/20">
                <button 
                  type="button"
                  onClick={handleCloseReplyModal}
                  className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isSendingReply || !replyMessage.trim()}
                  onClick={handleSendReply}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 animate-out fade-out duration-300">
          <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-2xl ${
            toast.type === 'success' 
              ? 'bg-zinc-900 border-green-500/30 text-white' 
              : 'bg-zinc-900 border-red-500/30 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
        </motion.div>
      )}

    </div>
  );
}
