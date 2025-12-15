import React from 'react';
import { User } from '../types';
import { X, Shield, Mail, Building, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const { logout } = useAuth();

  return (
    <div className="absolute top-16 right-4 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50">
      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X size={16} />
        </button>
      </div>
      
      <div className="px-6 pb-6 relative">
        <div className="relative -mt-10 mb-4">
            <img src={user.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-900 shadow-lg" />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
        </div>

        <div className="mb-6">
            <h3 className="text-lg font-bold text-white leading-none mb-1">{user.name}</h3>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                {user.role}
            </span>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
                <Mail size={14} className="text-slate-500" />
                <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
                <Building size={14} className="text-slate-500" />
                <span>NeoBank Global Inc.</span>
            </div>
            <div className="flex items-center gap-3">
                <MapPin size={14} className="text-slate-500" />
                <span>San Francisco, CA</span>
            </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors text-left">
                <Shield size={16} /> Security Settings
            </button>
            <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors text-left"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;