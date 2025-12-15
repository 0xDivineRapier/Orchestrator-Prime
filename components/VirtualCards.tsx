
import React, { useState } from 'react';
import { VirtualCard, CardStatus, CardType, Currency, VirtualAccount, VaStatus } from '../types';
import { generateMockCards, generateMockVAs } from '../services/mockData';
import { Plus, CreditCard, Lock, Unlock, Eye, EyeOff, Copy, RefreshCw, Shield, Trash2, Check, AlertCircle, ArrowLeftRight, Smartphone, MapPin, Building, User, ArrowRight, Wallet, XCircle, QrCode } from 'lucide-react';

const VirtualCards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CARDS' | 'ACCOUNTS'>('CARDS');

  // Cards State
  const [cards, setCards] = useState<VirtualCard[]>(generateMockCards());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [loadingReveal, setLoadingReveal] = useState(false);

  // Card Form State
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newType, setNewType] = useState<CardType>(CardType.VIRTUAL);
  const [newCurrency, setNewCurrency] = useState<Currency>(Currency.USD);
  const [creating, setCreating] = useState(false);

  // Virtual Accounts State
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>(generateMockVAs());
  const [isIssueVAModalOpen, setIsIssueVAModalOpen] = useState(false);
  
  // VA Form State
  const [vaName, setVaName] = useState('');
  const [vaBank, setVaBank] = useState<'MANDIRI' | 'BCA' | 'BRI' | 'BNI'>('MANDIRI');
  const [vaAmount, setVaAmount] = useState('');
  const [creatingVA, setCreatingVA] = useState(false);

  // BI-FAST State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferStep, setTransferStep] = useState<'INPUT' | 'REVIEW' | 'SUCCESS'>('INPUT');
  const [proxyType, setProxyType] = useState<'MOBILE' | 'EMAIL'>('MOBILE');
  const [proxyValue, setProxyValue] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<{ accountName: string; bankName: string; accountNo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // QRIS State
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [qrisStep, setQrisStep] = useState<'INPUT' | 'DISPLAY' | 'SUCCESS'>('INPUT');
  const [qrisAmount, setQrisAmount] = useState('');
  const [qrisLoading, setQrisLoading] = useState(false);
  const [qrisString, setQrisString] = useState<string | null>(null);

  const formatIDR = (val: string | number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  };

  const handleReveal = (id: string) => {
      if (revealedCardId === id) {
          setRevealedCardId(null);
          return;
      }
      setLoadingReveal(true);
      setTimeout(() => {
          setRevealedCardId(id);
          setLoadingReveal(false);
      }, 800);
  };

  const toggleFreeze = (id: string) => {
      setCards(cards.map(c => {
          if (c.id === id) {
              return { ...c, status: c.status === CardStatus.ACTIVE ? CardStatus.FROZEN : CardStatus.ACTIVE };
          }
          return c;
      }));
  };

  const handleCreateCard = (e: React.FormEvent) => {
      e.preventDefault();
      setCreating(true);

      setTimeout(() => {
          const newCard: VirtualCard = {
              id: `vc_${Math.random().toString(36).substr(2, 9)}`,
              holderName: newName,
              last4: Math.floor(Math.random() * 9000 + 1000).toString(),
              brand: Math.random() > 0.5 ? 'Visa' : 'Mastercard',
              expiryMonth: '12',
              expiryYear: '28',
              cvv: Math.floor(Math.random() * 900 + 100).toString(),
              pan: `4${Math.floor(Math.random() * 1000000000000000)}`,
              status: CardStatus.ACTIVE,
              type: newType,
              currency: newCurrency,
              balance: 0,
              spendLimit: parseFloat(newLimit) || 1000,
              colorTheme: ['blue', 'black', 'purple', 'gold'][Math.floor(Math.random() * 4)] as any,
              createdAt: new Date().toISOString()
          };
          
          setCards([newCard, ...cards]);
          setCreating(false);
          setIsCreateModalOpen(false);
          setNewName('');
          setNewLimit('');
      }, 1500);
  };

  const handleCreateVA = (e: React.FormEvent) => {
      e.preventDefault();
      setCreatingVA(true);

      setTimeout(() => {
          // Mock logic to generate bank specific prefixes
          let prefix = '8801'; // Default
          if (vaBank === 'BCA') prefix = '123';
          if (vaBank === 'BRI') prefix = '9923';
          if (vaBank === 'BNI') prefix = '988';
          
          const suffix = Math.floor(Math.random() * 1000000000).toString();

          const newVA: VirtualAccount = {
              id: `va_${Math.random().toString(36).substr(2, 9)}`,
              bankCode: vaBank,
              accountName: vaName.toUpperCase(),
              accountNo: `${prefix}${suffix}`,
              currency: Currency.IDR,
              status: VaStatus.OPEN,
              createdAt: new Date().toISOString(),
              expectedAmount: vaAmount ? parseFloat(vaAmount) : undefined
          };

          setVirtualAccounts([newVA, ...virtualAccounts]);
          setCreatingVA(false);
          setIsIssueVAModalOpen(false);
          setVaName('');
          setVaAmount('');
      }, 1500);
  };

  // BI-FAST Handlers (Simulating SNAP API)
  const handleBiFastInquiry = (e: React.FormEvent) => {
      e.preventDefault();
      if (!proxyValue || !transferAmount) return;
      
      setInquiryLoading(true);
      setError(null);

      // Simulate API Latency
      setTimeout(() => {
          // Mock Error for demo
          if (proxyValue === '000') {
              setError("Account not found (SNAP Error: 4040001)");
              setInquiryLoading(false);
              return;
          }

          const isEmail = proxyType === 'EMAIL';
          // Mock Successful Account Resolution
          setInquiryResult({
              accountName: isEmail ? "BUDI SANTOSO" : "DIAN SASTRO",
              bankName: isEmail ? "BANK MANDIRI" : "BCA DIGITAL",
              accountNo: isEmail ? "137000123456" : "5500889922"
          });
          setTransferStep('REVIEW');
          setInquiryLoading(false);
      }, 1500);
  };

  const handleBiFastExecute = () => {
      setInquiryLoading(true);
      setTimeout(() => {
          setTransferStep('SUCCESS');
          setInquiryLoading(false);
      }, 1500);
  };

  const resetTransferModal = () => {
      setIsTransferModalOpen(false);
      setTransferStep('INPUT');
      setProxyValue('');
      setTransferAmount('');
      setInquiryResult(null);
      setError(null);
  };

  // QRIS Handler
  const handleGenerateQris = (e: React.FormEvent) => {
      e.preventDefault();
      setQrisLoading(true);
      
      // Simulate SNAP QR Generation
      setTimeout(() => {
          setQrisString("00020101021226590014ID.CO.GOPAY.WWW01189360091431671234560210GOPAY000010303UMI51440014ID.OR.QRIS.WWW0215ID10200213057185204481453033605802ID5913Orchestrator6007Jakarta61051031062070703A0163041234");
          setQrisStep('DISPLAY');
          setQrisLoading(false);

          // Simulate Payment Received Webhook
          setTimeout(() => {
              setQrisStep('SUCCESS');
          }, 6000);
      }, 1500);
  };

  const resetQrisModal = () => {
      setIsQrisModalOpen(false);
      setQrisStep('INPUT');
      setQrisAmount('');
      setQrisString(null);
  };

  const getCardGradient = (theme: string) => {
      switch(theme) {
          case 'black': return 'bg-gradient-to-br from-slate-800 to-black border-slate-700';
          case 'purple': return 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700';
          case 'gold': return 'bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900 border-amber-700';
          default: return 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-800'; // Blue
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Issuing & Receivables</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">Manage virtual cards and collection accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <button 
                 onClick={() => setIsQrisModalOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold transition-all"
            >
                 <QrCode size={18} className="text-red-500" />
                 Generate QRIS
            </button>

            <button 
                 onClick={() => setIsTransferModalOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold transition-all"
            >
                 <ArrowLeftRight size={18} className="text-orange-500" />
                 BI-FAST Transfer
            </button>
            
            <button 
                 onClick={() => setIsIssueVAModalOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold transition-all"
            >
                 <Building size={18} className="text-emerald-500" />
                 Create VA
            </button>

            <button 
                 onClick={() => setIsCreateModalOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
            >
                 <Plus size={18} />
                 Issue Card
            </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6 px-1">
          <button 
            onClick={() => setActiveTab('CARDS')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CARDS' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Virtual Cards
          </button>
          <button 
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ACCOUNTS' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Virtual Accounts (Receivables)
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2">
          
          {/* --- VIRTUAL CARDS VIEW --- */}
          {activeTab === 'CARDS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map(card => (
                    <div key={card.id} className="group relative">
                        {/* Card Visual */}
                        <div className={`relative w-full aspect-[1.586] rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${getCardGradient(card.colorTheme)} ${card.status === CardStatus.FROZEN ? 'opacity-75 grayscale' : ''}`}>
                            
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            
                            <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-7 bg-yellow-400/80 rounded flex items-center justify-center">
                                            <div className="w-8 h-5 border border-slate-900/20 rounded-[2px] grid grid-cols-2 grid-rows-2 gap-[1px]"></div>
                                        </div>
                                        <Shield size={16} className="opacity-50" />
                                    </div>
                                    <span className="font-mono text-lg font-bold italic opacity-90">{card.brand}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono text-xl tracking-widest drop-shadow-md">
                                            {revealedCardId === card.id ? (
                                                <span className="animate-in fade-in">{card.pan.match(/.{1,4}/g)?.join(' ')}</span>
                                            ) : (
                                                <span>•••• •••• •••• {card.last4}</span>
                                            )}
                                        </div>
                                        {revealedCardId === card.id && (
                                            <button className="opacity-70 hover:opacity-100 transition-opacity">
                                                <Copy size={14} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] uppercase opacity-60 tracking-wider">Card Holder</div>
                                            <div className="font-medium tracking-wide">{card.holderName.toUpperCase()}</div>
                                        </div>
                                        <div className="flex gap-4">
                                                <div>
                                                    <div className="text-[10px] uppercase opacity-60 tracking-wider">Expires</div>
                                                    <div className="font-mono">{card.expiryMonth}/{card.expiryYear}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase opacity-60 tracking-wider">CVC</div>
                                                    <div className="font-mono">{revealedCardId === card.id ? card.cvv : '•••'}</div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex justify-between items-center shadow-sm">
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => handleReveal(card.id)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    {loadingReveal && revealedCardId !== card.id ? <RefreshCw size={18} className="animate-spin" /> : (revealedCardId === card.id ? <EyeOff size={18} /> : <Eye size={18} />)}
                                </button>
                                <button 
                                    onClick={() => toggleFreeze(card.id)}
                                    className={`p-2 rounded-lg transition-colors ${card.status === CardStatus.FROZEN ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                                >
                                    {card.status === CardStatus.FROZEN ? <Unlock size={18} /> : <Lock size={18} />}
                                </button>
                            </div>
                            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
                                {card.currency} {card.balance.toLocaleString()} / {card.spendLimit.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
              </div>
          )}

          {/* --- VIRTUAL ACCOUNTS VIEW --- */}
          {activeTab === 'ACCOUNTS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
                  {virtualAccounts.map(va => (
                      <div key={va.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg flex flex-col">
                          <div className="h-2 bg-emerald-500 w-full"></div>
                          <div className="p-6 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-4">
                                   <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                           <Building size={20} />
                                       </div>
                                       <div>
                                           <div className="text-sm font-bold text-slate-900 dark:text-white">{va.bankCode}</div>
                                           <div className="text-xs text-slate-500">Virtual Account</div>
                                       </div>
                                   </div>
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${va.status === VaStatus.OPEN ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                       {va.status}
                                   </span>
                              </div>

                              <div className="flex-1 space-y-4">
                                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg">
                                      <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Account Number</div>
                                      <div className="flex justify-between items-center">
                                          <div className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200 tracking-wider">{va.accountNo}</div>
                                          <button className="text-slate-400 hover:text-blue-500 transition-colors"><Copy size={14} /></button>
                                      </div>
                                  </div>

                                  <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-500">Name</span>
                                      <span className="font-medium text-slate-900 dark:text-white">{va.accountName}</span>
                                  </div>

                                  {va.expectedAmount && (
                                      <div className="flex justify-between items-center text-sm">
                                          <span className="text-slate-500">Expected</span>
                                          <span className="font-mono text-slate-900 dark:text-white">{formatIDR(va.expectedAmount)}</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                              <span>Created: {new Date(va.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1"><Wallet size={12}/> Receivables</span>
                          </div>
                      </div>
                  ))}

                   <button 
                       onClick={() => setIsIssueVAModalOpen(true)}
                       className="group relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer min-h-[220px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Create New Account</span>
                    </button>
              </div>
          )}

      </div>

      {/* --- MODALS --- */}

      {/* Issue Card Modal */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Issue Virtual Card</h3>
                  
                  <form onSubmit={handleCreateCard} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Holder / Label</label>
                          <input 
                             type="text" 
                             required
                             value={newName}
                             onChange={e => setNewName(e.target.value)}
                             placeholder="e.g. Marketing Ops"
                             className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Currency</label>
                              <select 
                                value={newCurrency}
                                onChange={e => setNewCurrency(e.target.value as Currency)}
                                className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                  <option value={Currency.USD}>USD</option>
                                  <option value={Currency.EUR}>EUR</option>
                                  <option value={Currency.IDR}>IDR</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Limit</label>
                              <input 
                                 type="number" 
                                 required
                                 value={newLimit}
                                 onChange={e => setNewLimit(e.target.value)}
                                 placeholder="5000"
                                 className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Type</label>
                          <div className="grid grid-cols-3 gap-2">
                              {[CardType.VIRTUAL, CardType.PHYSICAL, CardType.DISPOSABLE].map(type => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewType(type)}
                                    className={`py-2 text-xs font-medium rounded border ${newType === type ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                  >
                                      {type}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                             type="button"
                             onClick={() => setIsCreateModalOpen(false)}
                             className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                             type="submit"
                             disabled={creating}
                             className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                              {creating ? <RefreshCw size={16} className="animate-spin" /> : "Issue Card"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Create Virtual Account Modal */}
      {isIssueVAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                          <Building size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Virtual Account</h3>
                        <p className="text-xs text-slate-500">Generate a dedicated collection number.</p>
                      </div>
                  </div>
                  
                  <form onSubmit={handleCreateVA} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bank</label>
                          <select 
                            value={vaBank}
                            onChange={e => setVaBank(e.target.value as any)}
                            className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                              <option value="MANDIRI">Mandiri</option>
                              <option value="BCA">BCA</option>
                              <option value="BRI">BRI</option>
                              <option value="BNI">BNI</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Name</label>
                          <input 
                             type="text" 
                             required
                             value={vaName}
                             onChange={e => setVaName(e.target.value)}
                             placeholder="e.g. CUST ORDER #8812"
                             className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expected Amount (Optional)</label>
                          <input 
                             type="number" 
                             value={vaAmount}
                             onChange={e => setVaAmount(e.target.value)}
                             placeholder="Enter amount in IDR"
                             className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                             type="button"
                             onClick={() => setIsIssueVAModalOpen(false)}
                             className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                             type="submit"
                             disabled={creatingVA}
                             className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2 rounded-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                              {creatingVA ? <RefreshCw size={16} className="animate-spin" /> : "Generate VA"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* BI-FAST Transfer Modal */}
      {isTransferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <ArrowLeftRight className="text-orange-500" />
                              BI-FAST Transfer
                          </h3>
                          <p className="text-xs text-slate-500">Real-time settlement via Bank Indonesia SNAP.</p>
                      </div>
                      <div className="px-2 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded border border-orange-200 dark:border-orange-500/20">
                          IDR ONLY
                      </div>
                  </div>

                  {transferStep === 'INPUT' && (
                      <form onSubmit={handleBiFastInquiry} className="space-y-5">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (IDR)</label>
                              <input 
                                 type="number" 
                                 required
                                 value={transferAmount}
                                 onChange={e => setTransferAmount(e.target.value)}
                                 placeholder="e.g. 150000"
                                 className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-lg font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                              />
                          </div>

                          <div className="space-y-1.5">
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proxy Type</label>
                               <div className="grid grid-cols-2 gap-3">
                                   <button 
                                      type="button"
                                      onClick={() => setProxyType('MOBILE')}
                                      className={`py-2.5 text-sm font-medium rounded-lg border flex items-center justify-center gap-2 ${proxyType === 'MOBILE' ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                   >
                                      <Smartphone size={16} /> Mobile
                                   </button>
                                   <button 
                                      type="button"
                                      onClick={() => setProxyType('EMAIL')}
                                      className={`py-2.5 text-sm font-medium rounded-lg border flex items-center justify-center gap-2 ${proxyType === 'EMAIL' ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                   >
                                      <MapPin size={16} /> Email
                                   </button>
                               </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                  {proxyType === 'MOBILE' ? 'Phone Number' : 'Email Address'}
                              </label>
                              <input 
                                 type={proxyType === 'MOBILE' ? 'tel' : 'email'}
                                 required
                                 value={proxyValue}
                                 onChange={e => setProxyValue(e.target.value)}
                                 placeholder={proxyType === 'MOBILE' ? "08123456789" : "user@example.com"}
                                 className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                              />
                          </div>

                          {error && (
                              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
                                  <XCircle size={14} /> {error}
                              </div>
                          )}

                          <div className="pt-2 flex gap-3">
                              <button 
                                 type="button"
                                 onClick={resetTransferModal}
                                 className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                  Cancel
                              </button>
                              <button 
                                 type="submit"
                                 disabled={inquiryLoading}
                                 className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                  {inquiryLoading ? <RefreshCw size={16} className="animate-spin" /> : "Check Account"}
                              </button>
                          </div>
                      </form>
                  )}

                  {transferStep === 'REVIEW' && inquiryResult && (
                      <div className="space-y-6">
                          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                                      <User size={24} />
                                  </div>
                                  <div>
                                      <div className="text-xs text-slate-500 uppercase font-bold">Recipient</div>
                                      <div className="text-lg font-bold text-slate-900 dark:text-white">{inquiryResult.accountName}</div>
                                      <div className="text-sm text-slate-500">{inquiryResult.bankName} • {inquiryResult.accountNo}</div>
                                  </div>
                              </div>
                              <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                              <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-500">Amount</span>
                                  <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">{formatIDR(transferAmount)}</span>
                              </div>
                          </div>

                          <div className="flex gap-3">
                              <button 
                                 onClick={() => setTransferStep('INPUT')}
                                 disabled={inquiryLoading}
                                 className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                  Back
                              </button>
                              <button 
                                 onClick={handleBiFastExecute}
                                 disabled={inquiryLoading}
                                 className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                  {inquiryLoading ? <RefreshCw size={16} className="animate-spin" /> : "Confirm Transfer"}
                              </button>
                          </div>
                      </div>
                  )}

                  {transferStep === 'SUCCESS' && (
                      <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                              <Check size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transfer Successful</h3>
                              <p className="text-slate-500 mt-2">Funds have been transferred via BI-FAST.</p>
                          </div>
                          
                          {/* Success Summary */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-left space-y-3 border border-slate-100 dark:border-slate-800/50">
                               <div className="flex justify-between">
                                  <span className="text-xs text-slate-500">Recipient</span>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{inquiryResult?.accountName}</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-xs text-slate-500">Bank</span>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{inquiryResult?.bankName}</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-xs text-slate-500">Account No</span>
                                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{inquiryResult?.accountNo}</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-xs text-slate-500">Amount</span>
                                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{formatIDR(transferAmount)}</span>
                               </div>
                               <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                               <div className="flex justify-between">
                                  <span className="text-xs text-slate-500">Reference ID</span>
                                  <span className="text-xs font-mono text-slate-500">{`2024${Math.floor(Math.random() * 100000000000)}`}</span>
                               </div>
                          </div>

                          <button 
                             onClick={resetTransferModal}
                             className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                          >
                             Done
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* QRIS Generation Modal */}
      {isQrisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                  {qrisStep === 'INPUT' && (
                      <div className="space-y-6">
                          <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <QrCode className="text-red-500" />
                                  Generate QRIS
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">Create a dynamic SNAP QR for payment.</p>
                          </div>
                          
                          <form onSubmit={handleGenerateQris} className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (IDR)</label>
                                  <input 
                                     type="number" 
                                     required
                                     value={qrisAmount}
                                     onChange={e => setQrisAmount(e.target.value)}
                                     placeholder="e.g. 50000"
                                     className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-lg font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                  />
                              </div>
                              <div className="flex gap-3 pt-2">
                                  <button 
                                     type="button"
                                     onClick={resetQrisModal}
                                     className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                  >
                                      Cancel
                                  </button>
                                  <button 
                                     type="submit"
                                     disabled={qrisLoading}
                                     className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                  >
                                      {qrisLoading ? <RefreshCw size={16} className="animate-spin" /> : "Generate QR"}
                                  </button>
                              </div>
                          </form>
                      </div>
                  )}

                  {qrisStep === 'DISPLAY' && (
                      <div className="text-center space-y-6">
                          <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan to Pay</h3>
                              <p className="text-sm font-mono text-slate-500 mt-1">{formatIDR(qrisAmount)}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 inline-block">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrisString}`} 
                                alt="QRIS Code" 
                                className="w-48 h-48 mix-blend-multiply"
                              />
                          </div>

                          <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-bold animate-pulse">
                              <RefreshCw size={14} className="animate-spin" />
                              Waiting for payment...
                          </div>

                          <button 
                             onClick={resetQrisModal}
                             className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                          >
                             Cancel Transaction
                          </button>
                      </div>
                  )}

                  {qrisStep === 'SUCCESS' && (
                      <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                              <Check size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Received</h3>
                              <p className="text-slate-500 mt-2">QRIS transaction settled successfully.</p>
                          </div>
                          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                              {formatIDR(qrisAmount)}
                          </div>
                          <button 
                             onClick={resetQrisModal}
                             className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                          >
                             Done
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default VirtualCards;
