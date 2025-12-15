import React, { useState, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { X, ShieldAlert, CreditCard, Smartphone, Globe, Server, CheckCircle, Clock } from 'lucide-react';
import { analyzeTransactionRisk } from '../services/geminiService';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<{ analysis: string; recommendedAction: string; fraudProbability: number } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
            const result = await analyzeTransactionRisk(transaction);
            setAiAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAnalysis(false);
        }
    };
    fetchAnalysis();
  }, [transaction]);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.AUTHORIZED:
      case TransactionStatus.CAPTURED: return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10 border-green-200 dark:border-green-400/20';
      case TransactionStatus.FAILED:
      case TransactionStatus.DECLINED: return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
      case TransactionStatus.PENDING: return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20';
      default: return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20';
    }
  };

  const getMethodIcon = (method: string) => {
      if (method.includes('Card')) return <CreditCard size={14} />;
      if (method.includes('Wallet')) return <Smartphone size={14} />;
      return <Globe size={14} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-950">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-xl font-mono font-bold text-slate-900 dark:text-white">{transaction.id}</h2>
                 <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(transaction.status)}`}>
                   {transaction.status}
                 </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                 {new Date(transaction.timestamp).toLocaleString()} • ISO 20022 / PACS.008
              </p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           
           {/* Key Metrics */}
           <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">AMOUNT</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{transaction.currency} {transaction.amount.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                   <div className="text-xs text-slate-500 mb-1">RISK SCORE</div>
                   <div className={`text-2xl font-bold ${transaction.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                     {transaction.riskScore}/100
                   </div>
                </div>
           </div>

           {/* AI Risk Analysis */}
           <div className="bg-indigo-50 dark:bg-slate-950/50 border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} /> Gemini Risk Guard
                </h4>
                
                {loadingAnalysis ? (
                  <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse">
                    <Server size={14} className="animate-spin" /> Analyzing transaction patterns...
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-3 relative z-10">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiAnalysis.analysis}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="text-xs">
                          <span className="text-slate-500 block font-semibold">PROBABILITY</span>
                          <span className={`font-mono font-bold ${aiAnalysis.fraudProbability > 50 ? 'text-red-500' : 'text-green-500'}`}>
                            {aiAnalysis.fraudProbability}%
                          </span>
                       </div>
                       <div className="text-xs">
                          <span className="text-slate-500 block font-semibold">RECOMMENDATION</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-white uppercase border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded bg-white dark:bg-slate-800">
                            {aiAnalysis.recommendedAction}
                          </span>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">AI Analysis unavailable.</div>
                )}
            </div>

            {/* Technical Details */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Technical Details</h4>
                <div className="space-y-2 text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                   <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                     <span className="text-slate-500">Merchant ID</span>
                     <span>{transaction.merchantId}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                     <span className="text-slate-500">Acquirer</span>
                     <span>{transaction.acquirer}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                     <span className="text-slate-500">Method</span>
                     <span className="flex items-center gap-2">{getMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                     <span className="text-slate-500">Card Last4</span>
                     <span>**** {transaction.cardLast4}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                     <span className="text-slate-500">Latency</span>
                     <span>{transaction.processingTimeMs}ms</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-slate-500">IP Address</span>
                     <span>{transaction.ipAddress}</span>
                   </div>
                </div>
            </div>

            {/* Metadata */}
            {transaction.metadata && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Metadata</h4>
                    <div className="bg-slate-900 text-slate-300 p-3 rounded font-mono text-xs overflow-x-auto">
                        <pre>{JSON.stringify(transaction.metadata, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors">
                Close
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-lg shadow-blue-500/20">
                Download Receipt
            </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;