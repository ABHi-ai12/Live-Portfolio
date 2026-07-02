import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
        <span className="text-sm text-white font-medium">{message}</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
