import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, User, FolderKanban, Cpu, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    { label: 'Edit Home', icon: Home, color: 'text-blue-400', bg: 'bg-blue-400/10', path: '/home', desc: 'Hero section, profile image, links' },
    { label: 'Edit About', icon: User, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/about', desc: 'Bio, experience, education, resume' },
    { label: 'Edit Projects', icon: FolderKanban, color: 'text-green-400', bg: 'bg-green-400/10', path: '/projects', desc: 'Manage your portfolio projects' },
    { label: 'Edit Skills', icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-400/10', path: '/skills', desc: 'Technical skills and proficiencies' },
    { label: 'Edit Contact', icon: Mail, color: 'text-red-400', bg: 'bg-red-400/10', path: '/contact', desc: 'Contact info and message inbox' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio CMS</h1>
        <p className="text-zinc-400 mt-2">Manage your portfolio content from here. Signed in as {user?.email}</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map(({ label, icon: Icon, color, bg, path, desc }) => (
          <motion.div key={label} variants={item}>
            <Link
              to={path}
              className="group relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 block h-full flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{label}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
