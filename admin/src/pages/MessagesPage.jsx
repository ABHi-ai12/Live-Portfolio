import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery';
import { Mail, MailOpen, Trash2, Calendar, User, Loader2, MessageSquare, Search, Filter, Archive, ArchiveRestore, Reply } from 'lucide-react';
import { PageSkeleton, ErrorState } from '../components/PageSkeleton';

export default function MessagesPage() {
  const {
    data: messagesData,
    loading,
    error,
    isOffline,
    retry
  } = useFirestoreQuery('messages_page', () => query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc')));

  const messages = messagesData.items;
  const [deletingId, setDeletingId] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Unread, Read, Replied
  const [showArchived, setShowArchived] = useState(false);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(firestore, 'contact_messages', id), {
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const toggleArchive = async (id, currentArchivedStatus) => {
    try {
      await updateDoc(doc(firestore, 'contact_messages', id), {
        isArchived: !currentArchivedStatus
      });
    } catch (err) {
      console.error('Error updating archive status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteDoc(doc(firestore, 'contact_messages', id));
    } catch (err) {
      console.error('Error deleting message:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Search Logic
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Archive filter
      if (showArchived && !msg.isArchived) return false;
      if (!showArchived && msg.isArchived) return false;

      // Status filter
      if (statusFilter !== 'All' && msg.status !== statusFilter) return false;

      // Search query
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        const searchFields = [msg.name, msg.email, msg.subject, msg.message].filter(Boolean);
        const matches = searchFields.some(field => field.toLowerCase().includes(queryLower));
        if (!matches) return false;
      }

      return true;
    });
  }, [messages, searchQuery, statusFilter, showArchived]);

  if (loading) {
    return <PageSkeleton type="messages" />;
  }

  if (error && !messages.length) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  const unreadCount = messages.filter(m => m.status === 'Unread' && !m.isArchived).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Inbox</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time submissions from your website contact form.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${showArchived ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            {showArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            {showArchived ? 'View Active' : 'View Archived'}
          </button>
          {!showArchived && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-sm font-medium">
              <span className="text-red-400">Unread:</span> <span className="text-red-400 font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by name, email, subject or message..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 relative min-w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center space-y-3">
          <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
            {showArchived ? <Archive className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </div>
          <h3 className="text-white font-medium text-lg">
            {searchQuery ? 'No Results Found' : showArchived ? 'No Archived Messages' : 'No Messages Yet'}
          </h3>
          <p className="text-zinc-500 max-w-sm mx-auto text-sm">
            {searchQuery 
              ? 'Try adjusting your search or filters.' 
              : showArchived 
                ? 'Archived messages will appear here.'
                : 'When visitors fill out your contact form, their submissions will appear here.'}
          </p>
        </div>
      )}

      {/* Messages List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`relative group bg-zinc-900 border transition-all duration-300 rounded-xl p-6 flex flex-col lg:flex-row gap-6 justify-between ${
              msg.status === 'Unread' && !msg.isArchived ? 'border-zinc-700 ring-1 ring-red-500/20 bg-zinc-900/90' : 'border-zinc-800 opacity-80 hover:opacity-100'
            }`}
          >
            {/* Unread dot indicator */}
            {msg.status === 'Unread' && !msg.isArchived && (
              <span className="absolute top-6 left-6 lg:top-1/2 lg:-translate-y-1/2 lg:left-4 w-2.5 h-2.5 bg-red-500 rounded-full" title="Unread" />
            )}

            {/* Left Column: Details */}
            <div className="flex-1 space-y-4 lg:pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    {msg.name}
                  </h3>
                  <span className="text-zinc-600 hidden sm:inline">|</span>
                  <span className="text-red-400 text-sm font-medium">
                    {msg.email}
                  </span>
                  {msg.phone && (
                    <>
                      <span className="text-zinc-600 hidden sm:inline">|</span>
                      <a href={`tel:${msg.phone}`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                        {msg.phone}
                      </a>
                    </>
                  )}
                </div>
                
                {/* Status Badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  msg.status === 'Unread' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  msg.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {msg.status}
                </span>
              </div>

              {msg.subject && (
                <div className="font-medium text-white/90 text-sm">
                  Subject: <span className="text-white">{msg.subject}</span>
                </div>
              )}

              {/* Message content */}
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap bg-zinc-950/40 p-4 border border-zinc-800/80 rounded-lg">
                {msg.message}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Date unknown'}
                </span>
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="flex flex-wrap items-center lg:flex-col justify-end lg:justify-start gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800/60 lg:w-[140px] shrink-0">
              
              <div className="flex w-full gap-2 lg:flex-col">
                {/* Reply */}
                <button 
                  onClick={() => {
                    alert('Please reply from the main Inbox tab inside Contact.');
                  }}
                  className="flex-1 lg:w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply
                </button>

                {/* Mark Read/Unread */}
                <button 
                  onClick={() => updateStatus(msg.id, msg.status === 'Unread' ? 'Read' : 'Unread')}
                  className="flex-1 lg:w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
                >
                  {msg.status === 'Unread' ? (
                    <><MailOpen className="w-3.5 h-3.5" /> Read</>
                  ) : (
                    <><Mail className="w-3.5 h-3.5" /> Unread</>
                  )}
                </button>
              </div>

              <div className="flex w-full gap-2 lg:mt-auto">
                <button 
                  onClick={() => toggleArchive(msg.id, msg.isArchived)}
                  className="flex-1 flex items-center justify-center p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
                  title={msg.isArchived ? "Unarchive Message" : "Archive Message"}
                >
                  {msg.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </button>
                
                <button 
                  onClick={() => handleDelete(msg.id)}
                  disabled={deletingId === msg.id}
                  className="flex-1 flex items-center justify-center p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  title="Delete Message"
                >
                  {deletingId === msg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
