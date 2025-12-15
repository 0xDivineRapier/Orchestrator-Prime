import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionStatus, RoutingRule } from '../types';
import { MOCK_RULES, generateHistoricalData } from '../services/mockData';
import { suggestRoutingOptimization } from '../services/geminiService';
import { ArrowUpRight, ArrowDownRight, Zap, Settings, Globe, Database } from 'lucide-react';

interface DashboardProps {
    transactions: Transaction[];
    onNavigateToSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onNavigateToSettings }) => {
  const [optimization, setOptimization] = useState<string>("");
  const [analyzingRules, setAnalyzingRules] = useState(false);
  
  // Use mock historical data for the chart background, but could enrich with real txs if we had history
  const chartData = generateHistoricalData(14);

  useEffect(() => {
    const fetchOpt = async () => {
        setAnalyzingRules(true);
        const rulesStr = MOCK_RULES.map(r => `${r.condition} -> ${r.destination}`).join('\n');
        const sugg = await suggestRoutingOptimization(rulesStr);
        setOptimization(sugg);
        setAnalyzingRules(false);
    };
    fetchOpt();
  }, []);

  // Calculate Real-Time Metrics
  const metrics = useMemo(() => {
      const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);
      const successfulTxs = transactions.filter(tx => tx.status === TransactionStatus.AUTHORIZED || tx.status === TransactionStatus.CAPTURED);
      const authRate = transactions.length > 0 ? (successfulTxs.length / transactions.length) * 100 : 94.2;
      const avgLatency = transactions.length > 0 
        ? Math.round(transactions.reduce((acc, tx) => acc + tx.processingTimeMs, 0) / transactions.length) 
        : 142;
      const fraudBlocked = transactions
        .filter(tx => tx.status === TransactionStatus.DECLINED || tx.status === TransactionStatus.FAILED)
        .reduce((acc, tx) => acc + tx.amount, 0);

      return {
          volume: totalVolume,
          authRate: authRate.toFixed(1),
          latency: avgLatency,
          fraud: fraudBlocked
      };
  }, [transactions]);

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 pb-10">
      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume (Live)', value: `$${metrics.volume.toLocaleString(undefined, {maximumFractionDigits: 0})}`, change: '+12.5%', isPos: true },
          { label: 'Auth Rate', value: `${metrics.authRate}%`, change: '+0.8%', isPos: true },
          { label: 'Avg Latency', value: `${metrics.latency}ms`, change: '-12ms', isPos: true },
          { label: 'Fraud Blocked', value: `$${metrics.fraud.toLocaleString(undefined, {maximumFractionDigits: 0})}`, change: '+2.1%', isPos: false },
        ].map((metric, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-lg transition-colors">
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">{metric.label}</div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{metric.value}</div>
              <div className={`flex items-center text-xs font-bold ${metric.isPos ? 'text-green-500' : 'text-red-500'}`}>
                {metric.isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Globe className="text-purple-500" size={16} /> Global Processing Volume
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #0f172a)', borderColor: 'var(--tooltip-border, #1e293b)', color: 'var(--tooltip-text, #f1f5f9)' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health & Status */}
        <div className="space-y-6">
           {/* Backend Health Mock */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Database className="text-green-500" size={16} /> Infrastructure Status
              </h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">Orchestrator (Go)</div>
                     </div>
                     <div className="text-xs text-slate-500 font-mono">v2.4.1 • 99.99%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">Ledger (CRDB)</div>
                     </div>
                     <div className="text-xs text-slate-500 font-mono">4ms lat</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">Vault (Rust)</div>
                     </div>
                     <div className="text-xs text-slate-500 font-mono">Sealed</div>
                  </div>
              </div>
           </div>

           {/* Smart Routing Rules */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl flex flex-col h-[300px] transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2"><Zap className="text-yellow-500" size={16} /> Active Routing Rules</div>
                <button 
                    onClick={onNavigateToSettings}
                    className="text-slate-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Manage Rules"
                >
                    <Settings size={14} />
                </button>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                 {MOCK_RULES.map(rule => (
                    <div key={rule.id} className="text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 group hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer">
                       <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{rule.name}</span>
                          <span className="text-slate-500 dark:text-slate-600 font-mono">#{rule.priority}</span>
                       </div>
                       <div className="font-mono text-slate-500 dark:text-slate-400 text-[10px] mb-2">{rule.condition}</div>
                       <div className="flex items-center gap-2">
                          <span className="text-slate-400 dark:text-slate-600">→</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-400/20">{rule.destination}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Gemini Optimization Tip</div>
                 <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    {analyzingRules ? "Analyzing routing efficiency..." : `"${optimization}"`}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;