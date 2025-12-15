
import React, { useState, useEffect } from 'react';
import { Currency, FxRate } from '../types';
import { generateMockFxRates } from '../services/mockData';
import { TrendingUp, TrendingDown, RefreshCw, Settings, DollarSign, ArrowRightLeft, Globe, Calculator, AlertTriangle } from 'lucide-react';

const MCP: React.FC = () => {
  const [rates, setRates] = useState<FxRate[]>(generateMockFxRates());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Simulator State
  const [simAmount, setSimAmount] = useState('100.00');
  const [simTarget, setSimTarget] = useState<Currency>(Currency.IDR);
  
  // Simulate live FX updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates => prevRates.map(rate => {
        const volatility = rate.volatility === 'high' ? 0.005 : (rate.volatility === 'medium' ? 0.002 : 0.0005);
        const change = (Math.random() - 0.5) * volatility;
        const newRate = rate.rate * (1 + change);
        return {
          ...rate,
          rate: parseFloat(newRate.toFixed(4)),
          lastUpdated: new Date().toISOString()
        };
      }));
      setLastRefresh(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkupChange = (id: string, newMarkup: number) => {
      setRates(rates.map(r => r.id === id ? { ...r, markup: newMarkup } : r));
  };

  const getSimulatedTotal = () => {
      const rateObj = rates.find(r => r.quoteCurrency === simTarget);
      if (!rateObj) return 0;
      
      const amount = parseFloat(simAmount) || 0;
      const clientRate = rateObj.rate * (1 + (rateObj.markup / 100)); // Apply markup
      return amount * clientRate;
  };

  const getEffectiveRate = (target: Currency) => {
      const rateObj = rates.find(r => r.quoteCurrency === target);
      if (!rateObj) return 0;
      return rateObj.rate * (1 + (rateObj.markup / 100));
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Globe className="text-blue-500" /> Multi-Currency Pricing (MCP)
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">Dynamic Currency Conversion & FX Management</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <RefreshCw size={12} className="animate-spin" />
                Rates Live: {lastRefresh.toLocaleTimeString()}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2 space-y-6">
            
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Total FX Volume</h3>
                    <div className="text-3xl font-mono font-bold">$4.2M <span className="text-sm font-sans opacity-70">USD</span></div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/20 w-fit px-2 py-1 rounded">
                        <TrendingUp size={14} /> +12% vs last month
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Avg Markup Yield</h3>
                    <div className="text-3xl font-mono font-bold text-emerald-400">2.15%</div>
                    <p className="text-xs text-slate-500 mt-2">Net revenue from FX spreads</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Volatility Alert</span>
                    </div>
                    <p className="text-xs text-slate-500">IDR/USD spread widened by 15bps due to market conditions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* FX Rates Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowRightLeft size={16} className="text-slate-500" />
                            Active Currency Pairs
                        </h3>
                        <button className="text-xs text-blue-500 hover:text-blue-400 font-bold">Manage Pairs</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-4">Pair</th>
                                    <th className="p-4">Mid-Market Rate</th>
                                    <th className="p-4">Volatility</th>
                                    <th className="p-4">Markup %</th>
                                    <th className="p-4">Client Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {rates.map(rate => (
                                    <tr key={rate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{rate.baseCurrency}/{rate.quoteCurrency}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                                            {rate.rate.toFixed(4)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                rate.volatility === 'low' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                                rate.volatility === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                                'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                            }`}>
                                                {rate.volatility}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="5" 
                                                    step="0.1"
                                                    value={rate.markup}
                                                    onChange={(e) => handleMarkupChange(rate.id, parseFloat(e.target.value))}
                                                    className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                                <span className="font-mono text-xs font-bold w-8 text-right">{rate.markup}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                                            {(rate.rate * (1 + (rate.markup / 100))).toFixed(4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Simulator Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-xl p-6 flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <Calculator size={18} className="text-purple-500" /> Rate Simulator
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Merchant Receives (USD)</label>
                            <div className="flex items-center gap-2">
                                <DollarSign size={20} className="text-slate-400" />
                                <input 
                                    type="number" 
                                    value={simAmount}
                                    onChange={(e) => setSimAmount(e.target.value)}
                                    className="bg-transparent text-2xl font-mono font-bold text-slate-900 dark:text-white outline-none w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center -my-2 relative z-10">
                            <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full text-slate-500">
                                <ArrowRightLeft size={16} className="rotate-90" />
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20">
                            <label className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-2 block flex justify-between">
                                <span>Customer Pays</span>
                                <select 
                                    value={simTarget}
                                    onChange={(e) => setSimTarget(e.target.value as Currency)}
                                    className="bg-transparent text-right outline-none cursor-pointer"
                                >
                                    {rates.map(r => <option key={r.id} value={r.quoteCurrency}>{r.quoteCurrency}</option>)}
                                </select>
                            </label>
                            <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-300">
                                {simTarget} {getSimulatedTotal().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                            <div className="text-xs text-blue-500/70 mt-1 font-mono">
                                Eff. Rate: 1 USD = {getEffectiveRate(simTarget).toFixed(2)} {simTarget}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span>Interbank Cost:</span>
                            <span className="font-mono">{(parseFloat(simAmount) * (rates.find(r => r.quoteCurrency === simTarget)?.rate || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            <span>Est. FX Profit:</span>
                            <span className="font-mono">{simTarget} {(getSimulatedTotal() - (parseFloat(simAmount) * (rates.find(r => r.quoteCurrency === simTarget)?.rate || 0))).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default MCP;
