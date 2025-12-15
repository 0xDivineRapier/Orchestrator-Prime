
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, PieChart, Settings, Bell, Search, Hexagon, Menu, Terminal, LogOut, Moon, Sun, CreditCard, Landmark, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import DeveloperTools from './components/DeveloperTools';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Documentation from './components/Documentation';
import PlatformPage from './components/PlatformPage';
import CompliancePage from './components/CompliancePage';
import ProfileModal from './components/ProfileModal';
import VirtualCards from './components/VirtualCards';
import Banking from './components/Banking';
import MCP from './components/MCP';
import { AuthProvider, useAuth } from './services/authContext';
import { ThemeProvider, useTheme } from './services/themeContext';
import { generateMockTransaction, MOCK_NOTIFICATIONS } from './services/mockData';
import { Transaction, Notification } from './types';
import TransactionFeed from './components/TransactionFeed';

const AppContent: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme, branding } = useTheme();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'issuing' | 'banking' | 'mcp' | 'analytics' | 'developer' | 'settings' | 'live'>('dashboard');
  
  // Public View State
  const [publicView, setPublicView] = useState<'landing' | 'login' | 'signup' | 'docs' | 'platform' | 'compliance'>('landing');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Initialize Data & Feed
  useEffect(() => {
    if (!user) return;

    // Initial Load
    const initialData = Array.from({ length: 15 }, () => generateMockTransaction());
    setTransactions(initialData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // Simulate WebSocket feed
    const interval = setInterval(() => {
      const newTx = generateMockTransaction();
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        if (updated.length > 200) updated.pop(); // Keep memory clean
        return updated;
      });
    }, 2800); 

    return () => clearInterval(interval);
  }, [user]);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
     switch(type) {
         case 'warning': return <span className="text-amber-500">⚠️</span>;
         case 'error': return <span className="text-red-500">🚨</span>;
         case 'success': return <span className="text-green-500">✅</span>;
         default: return <span className="text-blue-500">ℹ️</span>;
     }
  }

  // Handle Loading State
  if (isLoading) {
    return <div className="h-screen bg-[#020617] flex items-center justify-center text-slate-500 animate-pulse font-mono">Initializing Secure Vault...</div>;
  }

  // ROUTING LOGIC (Public)
  if (!user) {
    if (publicView === 'docs') {
        return (
            <Documentation 
                onBack={() => setPublicView('landing')}
                onLogin={() => setPublicView('login')}
            />
        );
    }
    if (publicView === 'platform') {
      return (
        <PlatformPage 
          onBack={() => setPublicView('landing')}
          onLogin={() => setPublicView('login')}
        />
      );
    }
    if (publicView === 'compliance') {
      return (
        <CompliancePage 
          onBack={() => setPublicView('landing')}
          onLogin={() => setPublicView('login')}
        />
      );
    }
    if (publicView === 'login' || publicView === 'signup') {
      return (
        <Login 
          initialView={publicView} 
          onBack={() => setPublicView('landing')} 
        />
      );
    }
    return (
      <LandingPage 
        onLoginClick={() => setPublicView('login')} 
        onSignupClick={() => setPublicView('signup')}
        onDocsClick={() => setPublicView('docs')}
        onPlatformClick={() => setPublicView('platform')}
        onComplianceClick={() => setPublicView('compliance')}
      />
    );
  }

  // Helper for active tab style using brand color
  const getActiveStyle = (isActive: boolean) => {
      if (isActive) {
          return { backgroundColor: branding.brandColor, color: '#fff', boxShadow: `0 10px 15px -3px ${branding.brandColor}40` };
      }
      return {};
  };

  // --- AUTHENTICATED DASHBOARD LAYOUT ---
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-20`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Hexagon style={{ color: branding.brandColor }} className="mr-3" fill={branding.brandColor} fillOpacity={0.2} />
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">{branding.portalName.toUpperCase()}</span>}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'dashboard' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'dashboard')}
          >
            <LayoutDashboard size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>

          <button 
            onClick={() => setActiveTab('live')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'live' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'live')}
          >
            <div className="relative">
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-white dark:border-slate-900"></span>
                <List size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            </div>
            {isSidebarOpen && <span className="font-medium">Live Feed</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'transactions' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'transactions')}
          >
            <CreditCard size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">Transactions</span>}
          </button>

          <button 
            onClick={() => setActiveTab('issuing')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'issuing' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'issuing')}
          >
            <CreditCard size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">Issuing</span>}
          </button>

          <button 
            onClick={() => setActiveTab('banking')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'banking' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'banking')}
          >
            <Landmark size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">Banking</span>}
          </button>

          <button 
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'mcp' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'mcp')}
          >
            <Globe size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">MCP (FX)</span>}
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'analytics' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
            style={getActiveStyle(activeTab === 'analytics')}
          >
            <PieChart size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
            {isSidebarOpen && <span className="font-medium">Analytics</span>}
          </button>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <div className={`px-3 mb-2 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
              Platform
            </div>
            <button 
              onClick={() => setActiveTab('developer')}
              className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === 'developer' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-500 border border-pink-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <Terminal size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
              {isSidebarOpen && <span className="font-medium">Developer</span>}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab !== 'settings' ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100' : ''}`}
              style={getActiveStyle(activeTab === 'settings')}
            >
              <Settings size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
              {isSidebarOpen && <span className="font-medium">Settings</span>}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
           
           {isSidebarOpen && (
             <div 
               className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded p-1 transition-colors"
               onClick={() => setIsProfileOpen(!isProfileOpen)}
             >
                <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600" />
                <div className="overflow-hidden">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">{user.role}</div>
                </div>
             </div>
           )}

           <button 
             onClick={logout}
             className="flex items-center w-full p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mb-2"
           >
              <LogOut size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
              {isSidebarOpen && <span className="font-medium">Sign Out</span>}
           </button>

           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="flex items-center justify-center w-full p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 transition-colors border-t border-slate-200 dark:border-slate-800/50 pt-3"
           >
              <Menu size={16} />
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 relative transition-colors">
           <div className="flex items-center w-96 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 transition-colors">
              <Search size={16} className="text-slate-400 dark:text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search tx_id, merchant, or email..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 font-mono"
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400">MAINNET</span>
              </div>
              
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Notification Bell */}
              <div className="relative">
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`relative transition-colors ${isNotifOpen ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                    <div className="absolute top-10 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/10 dark:ring-black/50">
                        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">NOTIFICATIONS</span>
                            <button onClick={markAllRead} className="text-[10px] hover:underline" style={{ color: branding.brandColor }}>Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-3 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-slate-800/10' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{notif.title}</div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400 leading-snug my-1">{notif.message}</div>
                                                <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">
                                                    {new Date(notif.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`transition-colors ${activeTab === 'settings' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                style={activeTab === 'settings' ? { color: branding.brandColor } : {}}
              >
                <Settings size={20} />
              </button>
           </div>
        </header>

        {/* Profile Modal Overlay */}
        {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />}

        {/* View Content */}
        <main className="flex-1 p-6 overflow-hidden bg-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:to-[#0B1120] transition-colors">
           {activeTab === 'dashboard' && <Dashboard transactions={transactions} onNavigateToSettings={() => setActiveTab('settings')} />}
           {activeTab === 'live' && <TransactionFeed transactions={transactions} />}
           {activeTab === 'transactions' && <TransactionList transactions={transactions} onAddTransaction={handleAddTransaction} />}
           {activeTab === 'issuing' && <VirtualCards />}
           {activeTab === 'banking' && <Banking />}
           {activeTab === 'mcp' && <MCP />}
           {activeTab === 'analytics' && <Analytics />}
           {activeTab === 'developer' && <DeveloperTools />}
           {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
