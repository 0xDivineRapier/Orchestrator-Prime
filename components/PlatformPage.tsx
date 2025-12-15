
import React from 'react';
import { ArrowLeft, Globe, Zap, Shield, Layers, GitGraph, Database, Code, Check } from 'lucide-react';

interface PlatformPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const PlatformPage: React.FC<PlatformPageProps> = ({ onBack, onLogin }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Home</span>
          </button>
          <button 
            onClick={onLogin}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-8">
               THE ARCHITECTURE
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                The Operating System <br/> for Global Money
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Orchestrator Prime sits between your code and the financial world. It unifies fragmenting payment networks into a single, reliable, and intelligent infrastructure layer.
            </p>
        </div>

        {/* Core Architecture Diagram */}
        <div className="max-w-6xl mx-auto px-6 mb-32">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
                    {/* Left: Merchant */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-xl mx-auto flex items-center justify-center border border-slate-700">
                            <Code className="text-blue-500" size={32} />
                        </div>
                        <h3 className="font-bold text-lg">Your App</h3>
                        <p className="text-sm text-slate-500">One API Integration</p>
                    </div>

                    {/* Middle: Orchestrator */}
                    <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-6 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Orchestrator Prime
                        </div>
                        <div className="space-y-3 py-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-800">
                                <Shield size={16} className="text-emerald-500" />
                                <span className="text-sm font-medium">PCI Vault</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-800">
                                <GitGraph size={16} className="text-purple-500" />
                                <span className="text-sm font-medium">Smart Router</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-800">
                                <Database size={16} className="text-blue-500" />
                                <span className="text-sm font-medium">Unified Ledger</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Networks */}
                    <div className="space-y-3">
                        {['Stripe', 'Adyen', 'Chase', 'BCA SNAP', 'DBS PayNow', 'Visa Network'].map((net, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50 text-sm text-slate-300">
                                <span>{net}</span>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connecting Lines (CSS Visuals) */}
                <div className="hidden lg:block absolute top-1/2 left-[25%] w-[10%] h-[2px] bg-gradient-to-r from-blue-500/50 to-indigo-500/50"></div>
                <div className="hidden lg:block absolute top-1/2 right-[25%] w-[10%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-green-500/50"></div>
            </div>
        </div>

        {/* Feature Deep Dive */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="text-yellow-500" />
                    Intelligent Routing
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                    Stop losing 3-5% of revenue to false declines and suboptimal routing. Our AI engine analyzes 50+ data points in real-time to select the best route.
                </p>
                <ul className="space-y-4">
                    {[
                        "Least-Cost Routing (Debit vs Credit)",
                        "Cascading Retries (Auto-failover)",
                        "Geo-Locality Optimization",
                        "Bin-Based Routing"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                            <Check className="text-blue-500" size={18} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm text-slate-300 shadow-2xl">
                <div className="text-slate-500 mb-4">// example_routing_rule.json</div>
                <pre className="text-blue-100 leading-relaxed">
{`{
  "name": "Optimize US Debit",
  "priority": 1,
  "conditions": [
    { "field": "card.funding", "op": "eq", "value": "debit" },
    { "field": "card.country", "op": "eq", "value": "US" }
  ],
  "actions": [
    { 
      "provider": "tabapay", 
      "reason": "Lower Fees ($0.05 vs $0.30)" 
    },
    { 
      "provider": "stripe", 
      "strategy": "fallback" 
    }
  ]
}`}
                </pre>
            </div>
        </div>

        {/* Global Rails */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
            <h2 className="text-3xl font-bold mb-12 text-center">Global Coverage, Local Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { country: "United States", rails: ["ACH", "FedNow", "Visa/MC"], color: "blue" },
                    { country: "Indonesia", rails: ["QRIS", "BI-FAST", "Virtual Accounts"], color: "red" },
                    { country: "Singapore", rails: ["PayNow", "FAST", "GIRO"], color: "purple" },
                    { country: "Malaysia", rails: ["DuitNow", "FPX"], color: "yellow" },
                    { country: "Europe", rails: ["SEPA", "iDEAL", "Bancontact"], color: "green" },
                    { country: "India", rails: ["UPI", "Rupay"], color: "orange" }
                ].map((region, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className={`w-2 h-2 rounded-full bg-${region.color}-500 mb-4`}></div>
                        <h3 className="font-bold text-lg mb-2">{region.country}</h3>
                        <div className="flex flex-wrap gap-2">
                            {region.rails.map(r => (
                                <span key={r} className="text-xs font-mono bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-400">
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
};

export default PlatformPage;
