
import React, { useState } from 'react';
import { Landmark, Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, ShieldCheck, ExternalLink, Trash2, CheckCircle, AlertCircle, Loader2, Building, Server, Globe } from 'lucide-react';
import { LinkedAccount, Currency, AcquiringConnection } from '../types';
import { generateMockLinkedAccounts } from '../services/mockData';

const Banking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TREASURY' | 'ACQUIRING'>('TREASURY');
  const [accounts, setAccounts] = useState<LinkedAccount[]>(generateMockLinkedAccounts());
  const [connections, setConnections] = useState<AcquiringConnection[]>([
      { id: 'conn_chase', provider: 'CHASE', name: 'Chase Paymentech US', status: 'ACTIVE', mid: '871239123', region: 'US', supportedCurrencies: [Currency.USD] },
      { id: 'conn_bca', provider: 'BCA', name: 'BCA SNAP', status: 'ACTIVE', mid: 'ID_MERCH_001', region: 'ID', supportedCurrencies: [Currency.IDR] },
      { id: 'conn_adyen', provider: 'ADYEN_PLATFORM', name: 'Adyen EU', status: 'PENDING', mid: 'ADYEN_8283', region: 'EU', supportedCurrencies: [Currency.EUR, Currency.GBP] },
  ]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<'TOPUP' | 'WITHDRAW'>('TOPUP');
  
  // Link Flow State
  const [linkStep, setLinkStep] = useState<'SELECT' | 'LOGIN' | 'SUCCESS'>('SELECT');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  // Transfer Flow State
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const formatCurrency = (amount: number, currency: Currency) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  const handleUnlink = (id: string) => {
      if (confirm('Are you sure you want to unlink this account?')) {
          setAccounts(accounts.filter(a => a.id !== id));
      }
  };

  const handleLinkBank = () => {
      setLinking(true);
      setTimeout(() => {
          setLinkStep('SUCCESS');
          setLinking(false);
          
          // Mock adding new account
          const newAccount: LinkedAccount = {
              id: `acc_new_${Math.random().toString(36).substr(2,6)}`,
              institutionName: selectedBank || 'Bank',
              accountName: 'Checking Account',
              mask: Math.floor(Math.random() * 9000 + 1000).toString(),
              currency: Currency.USD,
              balance: Math.floor(Math.random() * 50000) + 1000,
              status: 'active',
              lastSynced: new Date().toISOString()
          };
          setAccounts([...accounts, newAccount]);
      }, 2000);
  };

  const handleTransfer = (e: React.FormEvent) => {
      e.preventDefault();
      setProcessingTransfer(true);
      setTimeout(() => {
          setProcessingTransfer(false);
          setTransferSuccess(true);
          setTransferAmount('');
      }, 1500);
  };

  const resetModals = () => {
      setIsLinkModalOpen(false);
      setLinkStep('SELECT');
      setSelectedBank(null);
      
      setIsTransferModalOpen(false);
      setTransferSuccess(false);
      setTransferAmount('');
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Banking & Channels</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">Manage corporate liquidity and acquiring rails</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => { setTransferType('WITHDRAW'); setIsTransferModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold transition-all"
                >
                    <ArrowUpRight size={16} /> Withdraw
                </button>
                <button 
                    onClick={() => { setTransferType('TOPUP'); setIsTransferModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    <ArrowDownLeft size={16} /> Top Up
                </button>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6 px-1">
            <button 
                onClick={() => setActiveTab('TREASURY')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TREASURY' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                Treasury (Corporate Funds)
            </button>
            <button 
                onClick={() => setActiveTab('ACQUIRING')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ACQUIRING' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                Acquiring Rails (Upstream)
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2 space-y-6">
            
            {/* --- TREASURY VIEW --- */}
            {activeTab === 'TREASURY' && (
                <>
                    {/* Balance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-[#0B1120] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-white shadow-xl">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <Landmark size={14} /> Total Liquidity (USD)
                            </div>
                            <div className="text-3xl font-mono font-bold mb-4">$245,000.50</div>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">+2.4% this week</span>
                            </div>
                        </div>
                        
                        {/* Action Card */}
                        <button 
                            onClick={() => setIsLinkModalOpen(true)}
                            className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all p-6 min-h-[140px]"
                        >
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 rounded-full flex items-center justify-center mb-3 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold">Connect New Bank</span>
                        </button>
                    </div>

                    {/* Connected Accounts List */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Linked Accounts</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {accounts.map(acc => (
                                <div key={acc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                                            <Landmark size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{acc.institutionName}</h4>
                                                {acc.status === 'active' && <CheckCircle size={14} className="text-green-500" />}
                                            </div>
                                            <div className="text-sm text-slate-500 font-mono">
                                                {acc.accountName} •••• {acc.mask}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(acc.balance, acc.currency)}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Last synced: {new Date(acc.lastSynced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                                title="Refresh Balance"
                                            >
                                                <RefreshCw size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleUnlink(acc.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                title="Unlink Account"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* --- ACQUIRING VIEW --- */}
            {activeTab === 'ACQUIRING' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex gap-3">
                        <Server className="text-blue-500 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Upstream Connections</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                These are your direct connections to acquiring banks and payment networks. Transactions routed here will use your Merchant IDs (MIDs).
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connections.map(conn => (
                            <div key={conn.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                        <Building size={20} className="text-slate-500" />
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${conn.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}>
                                        {conn.status}
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{conn.name}</h3>
                                <div className="text-xs text-slate-500 font-mono mb-4">MID: {conn.mid}</div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-1">
                                        <span className="text-slate-500">Region</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{conn.region}</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-1">
                                        <span className="text-slate-500">Currencies</span>
                                        <div className="flex gap-1">
                                            {conn.supportedCurrencies.map(c => (
                                                <span key={c} className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-[10px]">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Configure</button>
                                </div>
                            </div>
                        ))}

                        <button className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all p-6 min-h-[180px]">
                            <Plus size={24} className="mb-2" />
                            <span className="font-bold text-sm">Add Processor</span>
                            <span className="text-[10px] mt-1 opacity-70">Connect Gateway or Acquirer</span>
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* --- MODALS --- */}

        {/* Link Bank Modal (Simulated Plaid Flow) */}
        {isLinkModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in zoom-in duration-200">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <ShieldCheck size={16} className="text-green-500"/> Secure Link
                        </div>
                        <button onClick={resetModals} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                            <ExternalLink size={16} />
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        {linkStep === 'SELECT' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">Select your bank</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'BCA', 'Mandiri', 'DBS', 'HSBC'].map(bank => (
                                        <button 
                                            key={bank}
                                            onClick={() => { setSelectedBank(bank); setLinkStep('LOGIN'); }}
                                            className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex flex-col items-center gap-2"
                                        >
                                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {bank[0]}
                                            </div>
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{bank}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {linkStep === 'LOGIN' && (
                            <div className="space-y-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 mb-4">
                                    <Landmark size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log in to {selectedBank}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Enter your credentials to authorize access.</p>
                                </div>
                                <div className="space-y-3 text-left">
                                    <input 
                                        type="text" 
                                        placeholder="Username" 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button 
                                    onClick={handleLinkBank}
                                    disabled={linking}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {linking ? <Loader2 className="animate-spin" /> : "Submit"}
                                </button>
                            </div>
                        )}

                        {linkStep === 'SUCCESS' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Account Linked!</h3>
                                <p className="text-sm text-slate-500">Your {selectedBank} account is now connected and ready for transfers.</p>
                                <button onClick={resetModals} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg mt-4">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Transfer Modal */}
        {isTransferModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                    {!transferSuccess ? (
                        <form onSubmit={handleTransfer}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                {transferType === 'TOPUP' ? <ArrowDownLeft className="text-blue-500"/> : <ArrowUpRight className="text-orange-500"/>}
                                {transferType === 'TOPUP' ? 'Top Up Wallet' : 'Withdraw Funds'}
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        {transferType === 'TOPUP' ? 'From' : 'To'} Account
                                    </label>
                                    <select 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm outline-none"
                                        value={selectedAccountId}
                                        onChange={(e) => setSelectedAccountId(e.target.value)}
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.institutionName} - {acc.mask}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <input 
                                            type="number" 
                                            required
                                            value={transferAmount}
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-6 pr-3 py-2.5 text-lg font-mono outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={resetModals}
                                        className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processingTransfer}
                                        className={`flex-1 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 ${transferType === 'TOPUP' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                                    >
                                        {processingTransfer ? <Loader2 className="animate-spin" /> : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Initiated</h3>
                            <p className="text-sm text-slate-500 mt-2">Funds should arrive within 1-2 business days via ACH/Direct Debit.</p>
                            <button onClick={resetModals} className="mt-6 text-sm text-blue-500 font-bold hover:underline">Close</button>
                        </div>
                    )}
                </div>
            </div>
        )}

    </div>
  );
};

export default Banking;
