import { useState, Suspense } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery';
import {
  Home, User, Briefcase, FolderKanban, Cpu,
  Settings, LogOut, Menu, X, Mail
} from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { PageSkeleton } from './PageSkeleton';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/home', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/skills', label: 'Skills', icon: Cpu },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: unreadData } = useFirestoreQuery('unread_messages', () => 
    query(
      collection(firestore, 'contact_messages'),
      where('status', '==', 'Unread'),
      where('isArchived', '==', false)
    )
  );
  const unreadCount = unreadData?.size || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-red-500">Abhinav</span> Admin
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          // Dashboard is somewhat special, but let's keep it in nav or maybe user just wanted Home?
          // The prompt says: "Keep only: Home, About, Projects, Skills, Contact, Logout"
          // We'll hide Dashboard from sidebar but keep the route.
          if (path === '/dashboard') return null;

          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
              {label === 'Contact' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800 space-y-1">
        <Link
          to="/settings"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            location.pathname === '/settings'
              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-zinc-900 border-r border-zinc-800">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer relative"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {!sidebarOpen && unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900"></span>
              )}
            </button>
            <h1 className="text-base font-bold">
              <span className="text-red-500">Abhinav</span> Admin
            </h1>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton type="dashboard" />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
