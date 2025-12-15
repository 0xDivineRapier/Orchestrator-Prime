import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Download, Calendar, Filter, ArrowUpRight } from 'lucide-react';
import { generateHistoricalData } from '../services/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Analytics: React.FC = () => {
  const data = generateHistoricalData(30);

  const regionData = [
    { name: 'North America', value: 4500000 },
    { name: 'Europe', value: 3200000 },
    { name: 'APAC', value: 2100000 },
    { name: 'LATAM', value: 800000 },
  ];

  const methodData = [
    { name: 'Credit Card', value: 65 },
    { name: 'Digital Wallet', value: 25 },
    { name: 'Bank Transfer', value: 8 },
    { name: 'Crypto', value: 2 },
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 pb-10 custom-scrollbar">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics & Reports</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">Deep dive into financial performance</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700">
             <Calendar size={16} /> Last 30 Days
           </button>
           <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/30">
             <Download size={16} /> Export Report
           </button>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
          <span>Net Revenue (Gross)</span>
          <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1 bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded border border-green-200 dark:border-green-500/20">
             <ArrowUpRight size={12} /> +14.2% vs last month
          </span>
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tooltip-bg, #0f172a)', borderColor: 'var(--tooltip-border, #1e293b)', color: 'var(--tooltip-text, #f1f5f9)' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Methods Pie */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-6">Payment Method Distribution</h3>
          <div className="flex flex-col md:flex-row items-center">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
               {methodData.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                       <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Success Rate Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
           <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-6">Authorization Rate by Region</h3>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={regionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.2} horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} cursor={{fill: '#1e293b'}} />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* Latency Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-xl transition-colors">
         <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gateway Latency (P99)</h3>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-xs">
               <tr>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">P50</th>
                  <th className="p-3">P99</th>
                  <th className="p-3">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {[
                  { gw: 'Stripe', reg: 'US-East', p50: '120ms', p99: '340ms', status: 'Healthy' },
                  { gw: 'Adyen', reg: 'EU-West', p50: '98ms', p99: '210ms', status: 'Healthy' },
                  { gw: 'Chase', reg: 'US-Central', p50: '145ms', p99: '410ms', status: 'Warning' },
                  { gw: 'TabaPay', reg: 'US-West', p50: '85ms', p99: '190ms', status: 'Healthy' },
               ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                     <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{row.gw}</td>
                     <td className="p-3 text-slate-500 dark:text-slate-400">{row.reg}</td>
                     <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{row.p50}</td>
                     <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{row.p99}</td>
                     <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${row.status === 'Healthy' ? 'text-green-600 dark:text-green-400 border-green-500/20 bg-green-100 dark:bg-green-500/10' : 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-100 dark:bg-amber-500/10'}`}>
                           {row.status}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
};

export default Analytics;