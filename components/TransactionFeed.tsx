
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { analyzeTransactionRisk } from '../services/geminiService';
import { Activity, ShieldAlert, CreditCard, Smartphone, Globe, Server, ArrowUp, ArrowDown, Search } from 'lucide-react';

interface TransactionFeedProps {
  transactions: Transaction[];
}

type SortField = 'TIME' | 'AMOUNT' | 'STATUS' | 'RISK';
type SortDirection = 'ASC' | 'DESC';

const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ analysis: string; recommendedAction: string; fraudProbability: number } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  // Sorting State
  const [sortField, setSortField] = useState<SortField>('TIME');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('DESC');
    }
  };

  // Memoized sorted transactions ensure efficient re-rendering when new data arrives
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'TIME':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'AMOUNT':
          comparison = a.amount - b.amount;
          break;
        case 'STATUS':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'RISK':
            comparison = a.riskScore - b.riskScore;
            break;
      }
      return sortDirection === 'ASC' ? comparison : -comparison;
    });
    return sorted;
  }, [transactions, sortField, sortDirection]);

  const handleSelectTx = async (tx: Transaction) => {
    setSelectedTx(tx);
    setAiAnalysis(null);
    setLoadingAnalysis(true);
    try {
        const result = await analyzeTransactionRisk(tx);
        setAiAnalysis(result);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingAnalysis(false);
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.AUTHORIZED:
      case TransactionStatus.CAPTURED: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case TransactionStatus.FAILED:
      case TransactionStatus.DECLINED: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case TransactionStatus.PENDING: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getMethodIcon = (method: string) => {
      if (method.includes('Card')) return <CreditCard size={14} />;
      if (method.includes('Wallet')) return <Smartphone size={14} />;
      return <Globe size={14} />;
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
      if (sortField !== field) return null;
      return sortDirection === 'ASC' ? <ArrowUp size={12} className="inline ml-1" /> : <ArrowDown size={12} className="inline ml-1" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Feed List */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="text-blue-500" size={16} /> Live Transaction Feed
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             LIVE STREAM
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 font-mono sticky top-0 bg-slate-900 z-10 shadow-sm">
              <tr>
                <th 
                    className="p-2 font-medium cursor-pointer hover:text-blue-400 transition-colors select-none"
                    onClick={() => handleSort('STATUS')}
                >
                    STATUS <SortIndicator field="STATUS" />
                </th>
                <th className="p-2 font-medium">ID</th>
                <th 
                    className="p-2 font-medium cursor-pointer hover:text-blue-400 transition-colors select-none"
                    onClick={() => handleSort('AMOUNT')}
                >
                    AMOUNT <SortIndicator field="AMOUNT" />
                </th>
                <th className="p-2 font-medium hidden sm:table-cell">MERCHANT</th>
                <th className="p-2 font-medium hidden md:table-cell">ACQUIRER</th>
                <th 
                    className="p-2 font-medium cursor-pointer hover:text-blue-400 transition-colors select-none"
                    onClick={() => handleSort('TIME')}
                >
                    TIME <SortIndicator field="TIME" />
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {sortedTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => handleSelectTx(tx)}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors animate-in fade-in slide-in-from-top-1 duration-300 ${selectedTx?.id === tx.id ? 'bg-slate-800 border-l-2 border-l-blue-500' : ''}`}
                >
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-2 text-slate-300">{tx.id}</td>
                  <td className="p-2 text-slate-100 font-bold">
                    {tx.currency} {tx.amount.toFixed(2)}
                  </td>
                  <td className="p-2 text-slate-400 hidden sm:table-cell">{tx.merchantId}</td>
                  <td className="p-2 text-slate-400 hidden md:table-cell truncate max-w-[100px]">{tx.acquirer}</td>
                  <td className="p-2 text-slate-500">{new Date(tx.timestamp).toLocaleTimeString([], { hour12: false })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View & AI Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {selectedTx ? (
          <>
            <div className="p-4 border-b border-slate-800 bg-slate-850">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-lg font-mono font-bold text-white tracking-tight">{selectedTx.id}</h3>
                   <span className="text-xs text-slate-500 font-mono">ISO 20022 / PACS.008</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(selectedTx.status)}`}>
                  {selectedTx.status}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">AMOUNT</div>
                  <div className="text-xl font-bold text-white">{selectedTx.currency} {selectedTx.amount.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                   <div className="text-xs text-slate-500 mb-1">RISK SCORE</div>
                   <div className={`text-xl font-bold ${selectedTx.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                     {selectedTx.riskScore}/100
                   </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Technical Details</h4>
                <div className="space-y-2 text-sm font-mono text-slate-300">
                   <div className="flex justify-between border-b border-slate-800 pb-1">
                     <span className="text-slate-500">Acquirer</span>
                     <span>{selectedTx.acquirer}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-800 pb-1">
                     <span className="text-slate-500">Method</span>
                     <span className="flex items-center gap-2">{getMethodIcon(selectedTx.paymentMethod)} {selectedTx.paymentMethod}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-800 pb-1">
                     <span className="text-slate-500">Card Last4</span>
                     <span>**** {selectedTx.cardLast4}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-800 pb-1">
                     <span className="text-slate-500">Latency</span>
                     <span>{selectedTx.processingTimeMs}ms</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-800 pb-1">
                     <span className="text-slate-500">IP Address</span>
                     <span>{selectedTx.ipAddress}</span>
                   </div>
                </div>
              </div>

              {/* AI Risk Analysis */}
              <div className="bg-slate-950/50 border border-indigo-500/30 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 blur-xl rounded-full -mr-8 -mt-8"></div>
                <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} /> Gemini Risk Guard
                </h4>
                
                {loadingAnalysis ? (
                  <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse">
                    <Server size={14} className="animate-spin" /> Analyzing 200+ data points...
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {aiAnalysis.analysis}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="text-xs">
                          <span className="text-slate-500 block">PROBABILITY</span>
                          <span className={`font-mono font-bold ${aiAnalysis.fraudProbability > 50 ? 'text-red-400' : 'text-green-400'}`}>
                            {aiAnalysis.fraudProbability}%
                          </span>
                       </div>
                       <div className="text-xs">
                          <span className="text-slate-500 block">RECOMMENDATION</span>
                          <span className="font-mono font-bold text-white uppercase border border-slate-700 px-2 py-0.5 rounded bg-slate-800">
                            {aiAnalysis.recommendedAction}
                          </span>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">Select transaction to analyze.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
            <Search size={48} className="mb-4 opacity-50" />
            <p className="font-mono text-sm">Select a transaction to inspect payload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFeed;
