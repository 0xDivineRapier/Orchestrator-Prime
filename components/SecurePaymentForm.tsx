
import React, { useState } from 'react';
import { Lock, ShieldCheck, CreditCard, Loader2, AlertTriangle, CheckCircle, QrCode, Building, Smartphone, Copy, ArrowLeftRight, MapPin } from 'lucide-react';
import { useTheme } from '../services/themeContext';

// --- MOCK BASIS THEORY SDK (Simulation) ---
const useBasisTheory = (apiKey: string) => {
    return {
        bt: {
            tokenize: async (payload: any) => {
                await new Promise(r => setTimeout(r, 1500));
                return {
                    id: `tok_${Math.random().toString(36).substr(2, 9)}`,
                    type: "card",
                    fingerprint: `fing_${Math.random().toString(36).substr(2, 12)}`,
                    bin_details: {
                        brand: "visa",
                        type: "credit",
                        issuer: "JPMORGAN CHASE BANK, N.A.",
                        country_code: "US",
                        product: "VI/SIGNATURE"
                    },
                    mask: "************4242"
                };
            }
        }
    };
};

const CardNumberElement: React.FC<{ style?: any; className?: string; onChange?: any; onFocus?: any; onBlur?: any }> = ({ style, className, onChange, onFocus, onBlur }) => {
    const mockStyle = {
        ...style.base,
    };

    return (
        <div className={className} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
             <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full h-full bg-transparent border-none outline-none"
                style={{
                    fontSize: mockStyle.fontSize,
                    color: mockStyle.color,
                    fontFamily: mockStyle.fontFamily,
                    letterSpacing: '0.05em'
                }}
                onChange={() => onChange && onChange({ complete: true })}
                onFocus={onFocus}
                onBlur={onBlur}
             />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-emerald-600/50 font-mono pointer-events-none select-none border border-emerald-500/20 px-1 rounded">
                IFRAME
             </div>
        </div>
    );
};

// --- COMPONENT IMPLEMENTATION ---

interface SecurePaymentFormProps {
    onSuccess: (tokenData: any) => void;
    onCancel: () => void;
}

const SecurePaymentForm: React.FC<SecurePaymentFormProps> = ({ onSuccess, onCancel }) => {
    const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BT_KEY || 'test_key_123');
    const { theme } = useTheme();
    
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [activeMethod, setActiveMethod] = useState<'CARD' | 'QRIS' | 'VA' | 'BI_FAST' | 'PAYNOW'>('CARD');
    
    // QRIS & VA State
    const [amount, setAmount] = useState('150000'); // Default IDR amount
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [vaNumber, setVaNumber] = useState<string | null>(null);
    
    // BI-FAST State
    const [proxyType, setProxyType] = useState('MOBILE');
    const [proxyValue, setProxyValue] = useState('');

    // PayNow State
    const [sgdAmount, setSgdAmount] = useState('50.00');

    const secureInputStyle = {
        base: {
            fontSize: '14px',
            color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
            fontFamily: '"JetBrains Mono", monospace',
            '::placeholder': { color: theme === 'dark' ? '#475569' : '#94a3b8' },
        },
        invalid: { 
            color: '#ef4444'
        }
    };

    const handleCardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = await bt.tokenize({ type: 'card' });
            onSuccess(token);
        } catch (err) {
            console.error("Tokenization failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate SNAP API Calls
    const handleGenerateQRIS = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setQrCodeData("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021226590014ID.CO.GOPAY.WWW01189360091431671234560210GOPAY000010303UMI51440014ID.OR.QRIS.WWW0215ID10200213057185204481453033605802ID5913Orchestrator6007Jakarta61051031062070703A0163041234");
            setIsLoading(false);
            // Auto-succeed for demo after 5s
            setTimeout(() => {
                onSuccess({
                     id: `tx_qris_${Math.random().toString(36).substr(2, 6)}`,
                     bin_details: {
                         type: "QRIS",
                         issuer: "GOPAY",
                         country_code: "ID",
                         brand: "QRIS"
                     },
                     mask: "QRIS-SCAN"
                });
            }, 6000);
        }, 1200);
    };

    const handleGeneratePayNow = async () => {
        setIsLoading(true);
        setTimeout(() => {
            // Mock PayNow QR (Purple theme)
            setQrCodeData("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SG.PAYNOW.01...");
            setIsLoading(false);
            setTimeout(() => {
                onSuccess({
                     id: `tx_paynow_${Math.random().toString(36).substr(2, 6)}`,
                     bin_details: {
                         type: "PAYNOW",
                         issuer: "DBS",
                         country_code: "SG",
                         brand: "PAYNOW"
                     },
                     mask: "UEN-2023..."
                });
            }, 5000);
        }, 1200);
    };

    const handleCreateVA = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setVaNumber("8801 2392 3812 3312"); // Mandiri VA format
            setIsLoading(false);
             // Auto-succeed for demo after 5s
             setTimeout(() => {
                onSuccess({
                     id: `tx_va_${Math.random().toString(36).substr(2, 6)}`,
                     bin_details: {
                         type: "VIRTUAL_ACCOUNT",
                         issuer: "MANDIRI",
                         country_code: "ID",
                         brand: "VA"
                     },
                     mask: "VA-8801"
                });
            }, 6000);
        }, 1200);
    };

    const handleBiFastTransfer = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSuccess({
                id: `tx_bifast_${Math.random().toString(36).substr(2, 6)}`,
                bin_details: {
                    type: "BI_FAST",
                    issuer: "BCA DIGITAL",
                    country_code: "ID",
                    brand: "BI-FAST"
                },
                mask: proxyValue || "08123456789"
            });
        }, 2500);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0 shadow-2xl w-full max-w-md relative overflow-hidden ring-1 ring-black/5 dark:ring-slate-800 transition-colors">
             
             {/* Security Badge */}
             <div className="absolute top-0 right-0 bg-slate-50 dark:bg-slate-950/80 backdrop-blur text-emerald-600 dark:text-emerald-500 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl border-l border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <ShieldCheck size={12} />
                SECURE PIPE
             </div>

             <div className="p-6 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <Lock className="text-blue-500" size={18} />
                    Virtual Terminal
                </h3>
                <p className="text-xs text-slate-500">
                    Process payments securely. <br/>
                    <span className="text-[10px] opacity-70">Supports Global Cards, SNAP (ID), and PayNow (SG).</span>
                </p>
             </div>

             {/* Tab Switcher */}
             <div className="px-6 flex gap-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
                 <button 
                    onClick={() => setActiveMethod('CARD')}
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeMethod === 'CARD' ? 'text-blue-600 border-blue-600 dark:text-blue-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    Cards
                 </button>
                 <button 
                    onClick={() => setActiveMethod('QRIS')}
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeMethod === 'QRIS' ? 'text-blue-600 border-blue-600 dark:text-blue-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    QRIS
                 </button>
                 <button 
                    onClick={() => setActiveMethod('PAYNOW')}
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeMethod === 'PAYNOW' ? 'text-blue-600 border-blue-600 dark:text-blue-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    PayNow (SG)
                 </button>
                 <button 
                    onClick={() => setActiveMethod('VA')}
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeMethod === 'VA' ? 'text-blue-600 border-blue-600 dark:text-blue-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    Virtual Account
                 </button>
                 <button 
                    onClick={() => setActiveMethod('BI_FAST')}
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeMethod === 'BI_FAST' ? 'text-blue-600 border-blue-600 dark:text-blue-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
                 >
                    BI-FAST
                 </button>
             </div>

             <div className="p-6">
                {activeMethod === 'CARD' && (
                    <form onSubmit={handleCardSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'card' ? 'text-blue-500' : 'text-slate-500'}`}>
                                Card Number
                            </label>
                            <div className={`h-11 bg-slate-50 dark:bg-slate-950 border rounded-lg px-3 flex items-center transition-all ${focusedField === 'card' ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                                <CreditCard size={18} className={`${focusedField === 'card' ? 'text-blue-500' : 'text-slate-400 dark:text-slate-600'} mr-3 transition-colors`} />
                                <CardNumberElement 
                                    className="flex-1 h-full"
                                    style={secureInputStyle}
                                    onFocus={() => setFocusedField('card')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(state: any) => { /* handle validation state */ }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</label>
                                <div className="h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY" 
                                        className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 text-sm w-full font-mono placeholder-slate-400 dark:placeholder-slate-600" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CVC</label>
                                <div className="h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                                    <div className="flex-1">
                                        <input 
                                            type="text" 
                                            placeholder="123" 
                                            className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 text-sm w-full font-mono placeholder-slate-400 dark:placeholder-slate-600" 
                                        />
                                    </div>
                                    <Lock size={12} className="text-slate-400 dark:text-slate-600" />
                                </div>
                            </div>
                        </div>
                        
                         {/* Action Buttons */}
                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button" 
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        <span className="animate-pulse">Tokenizing...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={16} />
                                        <span>Process Securely</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* QRIS TAB (INDONESIA) */}
                {activeMethod === 'QRIS' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        {!qrCodeData ? (
                            <>
                                <div className="w-full space-y-1.5 text-left">
                                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (IDR)</label>
                                     <input 
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm font-mono"
                                     />
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg w-full flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 border-dashed min-h-[160px]">
                                    <QrCode size={48} className="text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-xs text-slate-500">Click Generate to create SNAP QR</p>
                                </div>
                                <button 
                                    onClick={handleGenerateQRIS}
                                    disabled={isLoading}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Generate QRIS"}
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className="bg-white p-4 rounded-xl shadow-xl mb-4">
                                     <img src={qrCodeData} alt="QRIS" className="w-48 h-48 mix-blend-multiply" />
                                </div>
                                <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold mb-1">
                                    <Loader2 className="animate-spin" size={14} />
                                    Waiting for Payment...
                                </div>
                                <p className="text-xs text-slate-500">Scan via GoPay, OVO, or Mobile Banking</p>
                                <button onClick={onCancel} className="mt-4 text-xs text-slate-400 hover:text-white">Cancel Transaction</button>
                            </div>
                        )}
                    </div>
                )}

                {/* PAYNOW TAB (SINGAPORE) */}
                {activeMethod === 'PAYNOW' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        {!qrCodeData ? (
                            <>
                                <div className="w-full space-y-1.5 text-left">
                                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (SGD)</label>
                                     <input 
                                        type="number"
                                        value={sgdAmount}
                                        onChange={(e) => setSgdAmount(e.target.value)}
                                        className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm font-mono"
                                     />
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg w-full flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 border-dashed min-h-[160px]">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                                        <ArrowLeftRight size={24} />
                                    </div>
                                    <p className="text-xs text-slate-500">Generate PayNow SG QR</p>
                                </div>
                                <button 
                                    onClick={handleGeneratePayNow}
                                    disabled={isLoading}
                                    className="w-full bg-[#7C2186] hover:bg-[#611969] text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Generate PayNow"}
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className="bg-white p-4 rounded-xl shadow-xl mb-4 border-2 border-[#7C2186]">
                                     <img src={qrCodeData} alt="PayNow" className="w-48 h-48 mix-blend-multiply" />
                                </div>
                                <div className="flex items-center gap-2 text-purple-500 text-sm font-bold mb-1">
                                    <Loader2 className="animate-spin" size={14} />
                                    Awaiting Transfer...
                                </div>
                                <p className="text-xs text-slate-500">Scan via DBS PayLah!, OCBC, or GrabPay</p>
                                <button onClick={onCancel} className="mt-4 text-xs text-slate-400 hover:text-white">Cancel Transaction</button>
                            </div>
                        )}
                    </div>
                )}

                {activeMethod === 'VA' && (
                     <div className="flex flex-col space-y-5">
                         {!vaNumber ? (
                             <>
                                <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank</label>
                                     <select className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm">
                                         <option>Mandiri (SNAP)</option>
                                         <option>BCA (SNAP)</option>
                                         <option>BRI (SNAP)</option>
                                         <option>BNI (SNAP)</option>
                                     </select>
                                </div>
                                <div className="space-y-1.5">
                                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (IDR)</label>
                                     <input 
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm font-mono"
                                     />
                                </div>
                                <button 
                                    onClick={handleCreateVA}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Virtual Account"}
                                </button>
                             </>
                         ) : (
                             <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                                     <Building size={24} />
                                 </div>
                                 <div>
                                     <h4 className="text-sm text-slate-500 font-medium mb-1">Mandiri Virtual Account</h4>
                                     <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-wider flex items-center justify-center gap-2">
                                         {vaNumber}
                                         <Copy size={16} className="text-slate-400 cursor-pointer hover:text-white" />
                                     </div>
                                 </div>
                                 <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded text-xs text-slate-500">
                                     Expires in 23:59:59
                                 </div>
                                 <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-bold">
                                    <Loader2 className="animate-spin" size={14} />
                                    Listening for Callback...
                                 </div>
                             </div>
                         )}
                     </div>
                )}

                {activeMethod === 'BI_FAST' && (
                    <div className="flex flex-col space-y-5">
                        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg p-3 flex items-start gap-3">
                            <ArrowLeftRight className="text-orange-500 mt-0.5 shrink-0" size={16} />
                            <div className="text-xs text-orange-800 dark:text-orange-200">
                                <span className="font-bold">Real-time Transfer.</span> Funds settle instantly via Bank Indonesia (IDR only).
                            </div>
                        </div>

                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proxy Type</label>
                             <div className="grid grid-cols-2 gap-2">
                                 <button 
                                    type="button"
                                    onClick={() => setProxyType('MOBILE')}
                                    className={`py-2 text-xs font-medium rounded border ${proxyType === 'MOBILE' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                 >
                                    Mobile Number
                                 </button>
                                 <button 
                                    type="button"
                                    onClick={() => setProxyType('EMAIL')}
                                    className={`py-2 text-xs font-medium rounded border ${proxyType === 'EMAIL' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                 >
                                    Email Address
                                 </button>
                             </div>
                        </div>

                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {proxyType === 'MOBILE' ? 'Phone Number' : 'Email Address'}
                             </label>
                             <div className="h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 flex items-center">
                                 {proxyType === 'MOBILE' ? <Smartphone size={16} className="text-slate-400 mr-2"/> : <MapPin size={16} className="text-slate-400 mr-2"/>}
                                 <input 
                                    type={proxyType === 'MOBILE' ? 'tel' : 'email'}
                                    value={proxyValue}
                                    onChange={(e) => setProxyValue(e.target.value)}
                                    placeholder={proxyType === 'MOBILE' ? "e.g. 08123456789" : "user@example.com"}
                                    className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-200 font-mono"
                                 />
                             </div>
                        </div>

                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (IDR)</label>
                             <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm font-mono"
                             />
                        </div>

                        <button 
                            onClick={handleBiFastTransfer}
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Initiate BI-FAST"}
                        </button>
                    </div>
                )}
             </div>

             {/* Compliance Footer (Dynamic based on method) */}
             <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-t border-slate-200 dark:border-slate-800 flex gap-3 items-start">
                 <AlertTriangle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                 <div className="text-[10px] text-slate-500 leading-relaxed">
                     {activeMethod === 'CARD' && "PCI-DSS SAQ A-EP: Iframe Isolation active."}
                     {(activeMethod === 'QRIS' || activeMethod === 'BI_FAST') && "BI SNAP Compliance: Transactions signed via HMAC-SHA256."}
                     {activeMethod === 'PAYNOW' && "ABS Standards: PayNow QR payload generated securely."}
                     {activeMethod === 'VA' && "Bank Integration: Virtual Account created via SNAP."}
                 </div>
             </div>
        </div>
    );
}

export default SecurePaymentForm;
