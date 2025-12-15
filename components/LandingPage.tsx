
import React from 'react';
import { Hexagon, ArrowRight, ShieldCheck, Zap, Globe, Code, Database, Lock, CheckCircle, Terminal, CreditCard, LayoutTemplate, Server, GitMerge, Cpu } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onDocsClick: () => void;
  onPlatformClick: () => void;
  onComplianceClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick, onDocsClick, onPlatformClick, onComplianceClick }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="text-blue-500 fill-blue-500/20" size={32} />
            <span className="text-xl font-bold tracking-tight">ORCHESTRATOR <span className="text-blue-500">PRIME</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={onPlatformClick} className="hover:text-white transition-colors">Platform</button>
            <button onClick={onDocsClick} className="hover:text-white transition-colors">Developers</button>
            <button onClick={onComplianceClick} className="hover:text-white transition-colors">Compliance</button>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLoginClick} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log In
            </button>
            <button 
              onClick={onSignupClick}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            V2.4 LIVE: BI-FAST & QRIS SUPPORT ADDED
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            The Financial OS for <br />
            <span className="text-white">Global Commerce</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            A single API to orchestrate payments across Stripe, Adyen, and Local Rails. 
            Automate routing, reduce fees, and unify your financial data.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button 
              onClick={onSignupClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight size={18} />
            </button>
            <button 
              onClick={onDocsClick}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 border border-slate-700 text-white font-bold rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Terminal size={18} /> Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* How It Works (Architecture) */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">How Orchestrator Prime Works</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">We sit between your application and the complex world of banking, handling the heavy lifting of security, routing, and compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-xl relative z-10">
                    <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30 font-bold">1</div>
                    <h3 className="font-bold text-lg mb-2 text-white">Ingest</h3>
                    <p className="text-sm text-slate-400">Your app sends raw payment details via our secure SDK. We instantly tokenize sensitive data (PCI Vault).</p>
                    <div className="mt-4 flex justify-center">
                        <Code className="text-slate-600" />
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-xl relative z-10">
                    <div className="w-10 h-10 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30 font-bold">2</div>
                    <h3 className="font-bold text-lg mb-2 text-white">Analyze</h3>
                    <p className="text-sm text-slate-400">Our Gemini AI engine scores the transaction for fraud and determines the optimal route based on cost & health.</p>
                    <div className="mt-4 flex justify-center">
                        <Cpu className="text-purple-500 animate-pulse" />
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-xl relative z-10">
                    <div className="w-10 h-10 bg-orange-600/20 text-orange-500 rounded-lg flex items-center justify-center mb-4 border border-orange-500/30 font-bold">3</div>
                    <h3 className="font-bold text-lg mb-2 text-white">Route</h3>
                    <p className="text-sm text-slate-400">The request is dynamically dispatched to the best provider (e.g. Stripe for US Cards, BCA for Indonesia).</p>
                    <div className="mt-4 flex justify-center">
                        <GitMerge className="text-orange-500" />
                    </div>
                </div>

                {/* Step 4 */}
                <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-xl relative z-10">
                    <div className="w-10 h-10 bg-green-600/20 text-green-500 rounded-lg flex items-center justify-center mb-4 border border-green-500/30 font-bold">4</div>
                    <h3 className="font-bold text-lg mb-2 text-white">Settle</h3>
                    <p className="text-sm text-slate-400">Funds are captured, and a unified webhook is sent back to your server. We handle the reconciliation.</p>
                    <div className="mt-4 flex justify-center">
                        <Database className="text-green-500" />
                    </div>
                </div>

                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-900 via-purple-900 to-green-900 -z-0"></div>
            </div>
         </div>
      </section>

      {/* Code Demo */}
      <section className="py-24 px-6">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-6">
                    <Terminal size={12} /> DEVELOPER EXPERIENCE
                </div>
                <h2 className="text-4xl font-bold mb-6">One API to Rule Them All</h2>
                <p className="text-slate-400 text-lg mb-8">
                    Stop maintaining separate integrations for Stripe, PayPal, and Adyen. Switch providers with a single line of config, not code changes.
                </p>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Globe size={20} /></div>
                        <div>
                            <h4 className="font-bold text-white">Global Reach</h4>
                            <p className="text-sm text-slate-400">Accept payments in 135+ currencies and 40+ local payment methods.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Server size={20} /></div>
                        <div>
                            <h4 className="font-bold text-white">99.999% Uptime</h4>
                            <p className="text-sm text-slate-400">Our multi-region architecture ensures you never miss a sale, even if one provider goes down.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Block */}
            <div className="bg-[#0d1117] rounded-xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                    <div className="flex gap-4 text-sm font-medium">
                        <span className="text-white border-b-2 border-blue-500 pb-1">cURL</span>
                        <span className="text-slate-500">Node.js</span>
                        <span className="text-slate-500">Python</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                </div>
                <pre className="font-mono text-xs leading-relaxed text-slate-300">
{`curl https://api.orchestrator.com/v1/charges \\
  -u api_key_mock_...: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa_debit_us \\
  -d smart_routing=true

{
  "id": "ch_3Lb...",
  "amount": 2000,
  "currency": "usd",
  "status": "succeeded",
  "routing": {
     "provider": "tabapay",
     "reason": "lowest_cost",
     "savings": "0.45"
  }
}`}
                </pre>
            </div>
         </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Trusted by next-gen fintechs</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['NeoBank', 'CoinFlow', 'PayStack', 'TechCorp', 'GlobalPay'].map((brand, i) => (
               <div key={i} className="text-xl font-bold font-mono">{brand}</div>
             ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Infrastructure for Scale</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Stop maintaining legacy integrations. One API gives you access to the entire global financial network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe size={32} className="text-blue-500" />,
                title: "Smart Orchestration",
                desc: "Dynamically route transactions based on currency, amount, and issuer health to maximize acceptance."
              },
              {
                icon: <ShieldCheck size={32} className="text-emerald-500" />,
                title: "Vault Tokenization",
                desc: "PCI-DSS Level 1 compliant vault. We store the PAN, you keep the tokens. Zero touch, zero liability."
              },
              {
                icon: <Zap size={32} className="text-orange-500" />,
                title: "Local Rails (BI-FAST)",
                desc: "Native support for Indonesian local payments including SNAP QRIS and BI-FAST real-time transfers."
              },
              {
                icon: <LayoutTemplate size={32} className="text-purple-500" />,
                title: "Virtual Issuing",
                desc: "Instantly issue virtual cards for expenses or payouts. Control limits and freeze cards via API."
              },
              {
                icon: <Database size={32} className="text-pink-500" />,
                title: "Data Sovereignty",
                desc: "Geo-partitioned databases ensure your user data stays in its region of origin (GDPR/RBI compliant)."
              },
              {
                icon: <Lock size={32} className="text-cyan-500" />,
                title: "Web3 Identity",
                desc: "Native support for MetaMask login and crypto-to-fiat conversion rails."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-colors group">
                <div className="mb-6 p-4 bg-slate-950 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 border border-slate-800">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 relative z-10">Ready to orchestrate?</h2>
          <p className="text-blue-200 text-lg mb-8 relative z-10">Join 10,000+ developers building the future of finance.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button 
              onClick={onSignupClick}
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border border-blue-400 text-white font-bold rounded-full hover:bg-blue-900/50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <Hexagon size={20} className="text-slate-600" />
             <span>© 2024 Orchestrator Prime. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
