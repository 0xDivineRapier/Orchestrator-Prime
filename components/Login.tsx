
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { Hexagon, Lock, Mail, User, Building, ShieldCheck, Key, AlertCircle, ArrowLeft, Wallet, Check, X, Download, ExternalLink } from 'lucide-react';

interface LoginProps {
  initialView?: 'login' | 'signup';
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ initialView = 'login', onBack }) => {
  const { login, signup, loginWeb3 } = useAuth();
  const [view, setView] = useState<'login' | 'forgot' | 'signup'>(initialView);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // Web3 State
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    // Check for MetaMask / Ethereum Provider on mount
    setHasMetaMask(typeof window.ethereum !== 'undefined');
  }, []);

  // Update internal view if prop changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score += 20;
    if (pass.length > 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) throw new Error("Credentials required");
      await login(email);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
          if (!email || !password || !fullName || !companyName) throw new Error("All fields are required");
          if (password.length < 8) throw new Error("Password must be at least 8 characters");
          await signup(fullName, email, password, companyName);
      } catch (err: any) {
          setError(err.message || "Registration failed.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleWeb3Action = async () => {
    if (!hasMetaMask) {
        window.open('https://metamask.io/download/', '_blank');
        return;
    }

    setIsLoading(true);
    setError('');
    try {
      await loginWeb3();
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setResetSent(true);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans selection:bg-blue-500/30">
      
      {/* Left Column - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex items-center gap-3">
             <Hexagon className="text-blue-500 fill-blue-500/20" size={48} />
             <h1 className="text-3xl font-bold tracking-tight text-white">ORCHESTRATOR PRIME</h1>
          </div>
          <blockquote className="text-xl font-medium text-slate-300 leading-relaxed mb-8">
            "The most resilient financial infrastructure we've ever deployed. 99.999% uptime during Black Friday was a game changer."
          </blockquote>
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">CT</div>
             <div>
               <div className="font-bold text-slate-200">Cassandra T.</div>
               <div>CTO, NeoBank Global</div>
             </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-950/50 backdrop-blur border border-slate-800 rounded-lg">
                <ShieldCheck className="text-emerald-500 mb-2" size={24} />
                <div className="font-bold text-slate-200">SOC2 Type II</div>
                <div className="text-xs text-slate-500">Certified Compliant</div>
             </div>
             <div className="p-4 bg-slate-950/50 backdrop-blur border border-slate-800 rounded-lg">
                <Key className="text-purple-500 mb-2" size={24} />
                <div className="font-bold text-slate-200">Argon2id Hashing</div>
                <div className="text-xs text-slate-500">Zero-Trust Auth</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          <div className="flex justify-between items-center mb-8">
             <div className="lg:hidden">
                <Hexagon className="text-blue-500" size={32} />
             </div>
             {onBack && (
               <button onClick={onBack} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                  <ArrowLeft size={14} /> Back to Home
               </button>
             )}
          </div>

          {view === 'login' && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Sign in to your orchestration dashboard</p>
              </div>

              <div className="mt-8 space-y-6">
                
                {/* Web3 Login Button */}
                <button 
                  type="button"
                  onClick={handleWeb3Action}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-700 rounded-xl shadow-lg bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white transition-all group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${hasMetaMask ? 'from-orange-500/10 to-pink-500/10' : 'from-blue-500/10 to-cyan-500/10'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  {hasMetaMask ? <Wallet size={18} className="text-orange-500" /> : <Download size={18} className="text-blue-500" />}
                  <span>{hasMetaMask ? "Connect Wallet (Web3)" : "Install MetaMask"}</span>
                  {!hasMetaMask && <ExternalLink size={14} className="opacity-50" />}
                </button>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-px bg-slate-800"></div>
                    <span className="relative bg-[#020617] px-4 text-xs text-slate-500 uppercase">Or continue with Email</span>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Email address</label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-slate-500" />
                        </div>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all sm:text-sm"
                            placeholder="name@company.com"
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-slate-500" />
                        </div>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all sm:text-sm"
                            placeholder="••••••••"
                        />
                        </div>
                    </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                        <label className="ml-2 block text-xs text-slate-400">Remember me</label>
                    </div>
                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                        Forgot password?
                    </button>
                    </div>

                    <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isLoading ? 'Authenticating...' : 'Sign in'}
                    </button>
                    
                    <div className="text-center text-sm text-slate-500">
                        Don't have an account? {' '}
                        <button type="button" onClick={() => setView('signup')} className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign up for free
                        </button>
                    </div>
                </form>
              </div>
            </>
          )}
          
          {view === 'signup' && (
             <div className="animate-in slide-in-from-right duration-300">
                <button onClick={() => setView('login')} className="text-xs text-slate-500 hover:text-slate-300 mb-4 flex items-center gap-1">
                   <ArrowLeft size={12} /> Back to Login
                </button>
                
                <div>
                  <h2 className="text-2xl font-bold text-white">Create your account</h2>
                  <p className="mt-2 text-sm text-slate-400">Start orchestrating payments in minutes.</p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-500" />
                            </div>
                            <input 
                                type="text" 
                                required 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-4 w-4 text-slate-500" />
                            </div>
                            <input 
                                type="text" 
                                required 
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Work Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-500" />
                            </div>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-500" />
                            </div>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                                placeholder="Create a strong password"
                            />
                        </div>
                        {password && (
                             <div className="mt-2">
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 text-right">{passwordStrength < 80 ? 'Weak password' : 'Strong password'}</div>
                             </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        By clicking create account, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                    </p>
                </form>
             </div>
          )}

          {view === 'forgot' && (
             <div className="animate-in slide-in-from-left duration-300">
                <button onClick={() => setView('login')} className="text-xs text-slate-500 hover:text-slate-300 mb-4 flex items-center gap-1">
                   <ArrowLeft size={12} /> Back to Login
                </button>
                
                <div>
                  <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                  <p className="mt-2 text-sm text-slate-400">Enter your email to receive recovery instructions.</p>
                </div>

                {!resetSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleForgotPass}>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Recovery Email'}
                        </button>
                    </form>
                ) : (
                    <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
                            <Check size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
                        <p className="text-sm text-slate-400">
                            We've sent a password reset link to <span className="text-slate-200 font-medium">{email}</span>.
                        </p>
                        <button onClick={() => setView('login')} className="mt-6 text-sm text-blue-500 hover:text-blue-400 font-medium">
                            Return to Login
                        </button>
                    </div>
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
