
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionStatus, Currency, PaymentMethod } from '../types';
import { Filter, Calendar, Download, ChevronDown, Search, CreditCard, Smartphone, Globe, AlertCircle, Plus, Eye, QrCode, Building, ArrowLeftRight, X, Wallet } from 'lucide-react';
import SecurePaymentForm from './SecurePaymentForm';
import TransactionDetailModal from './TransactionDetailModal';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (newTx: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAddTransaction }) => {
  // Core Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Additional Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currencyFilter, setCurrencyFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [acquirerFilter, setAcquirerFilter] = useState<string>('ALL');

  // Modal State
  const [showVirtualTerminal, setShowVirtualTerminal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Extract unique acquirers for the filter dropdown
  const uniqueAcquirers = useMemo(() => {
    const acquirers = new Set(transactions.map(tx => tx.acquirer).filter(Boolean));
    return Array.from(acquirers).sort();
  }, [transactions]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      // 1. Status
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
      
      // 2. Date Range
      if (dateRange.start && new Date(tx.timestamp) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(tx.timestamp) > new Date(dateRange.end)) return false;
      
      // 3. Search Term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(term);
        const matchesMerchant = tx.merchantId.toLowerCase().includes(term);
        const matchesAmount = tx.amount.toString().includes(term);
        const matchesEmail = tx.customerEmail.toLowerCase().includes(term);
        
        if (!matchesId && !matchesMerchant && !matchesAmount && !matchesEmail) return false;
      }

      // 4. Additional Filters
      if (currencyFilter !== 'ALL' && tx.currency !== currencyFilter) return false;
      if (methodFilter !== 'ALL' && tx.paymentMethod !== methodFilter) return false;
      if (acquirerFilter !== 'ALL' && tx.acquirer !== acquirerFilter) return false;

      return true;
    });
  }, [transactions, statusFilter, dateRange, searchTerm, currencyFilter, methodFilter, acquirerFilter]);

  const activeFiltersCount = [
    statusFilter !== 'ALL',
    dateRange.start !== '',
    dateRange.end !== '',
    currencyFilter !== 'ALL',
    methodFilter !== 'ALL',
    acquirerFilter !== 'ALL'
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
    setCurrencyFilter('ALL');
    setMethodFilter('ALL');
    setAcquirerFilter('ALL');
  };

  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.AUTHORIZED:
      case TransactionStatus.CAPTURED: 
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
      case TransactionStatus.FAILED:
      case TransactionStatus.DECLINED: 
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case TransactionStatus.REFUNDED: 
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case TransactionStatus.PENDING: 
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      default: 
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    }
  };

  const getRowClass = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.FAILED:
      case TransactionStatus.DECLINED:
        return 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30';
      case TransactionStatus.REFUNDED:
        return 'bg-purple-50/60 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/30';
      case TransactionStatus.PENDING:
        return 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30';
      default:
        return 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
    }
  };

  const getMethodIcon = (method: string) => {
      if (method.includes('Card')) return <CreditCard size={14} className="text-blue-500" />;
      if (method.includes('Wallet')) return <Smartphone size={14} className="text-purple-500" />;
      if (method === 'QRIS') return <QrCode size={14} className="text-red-500" />;
      if (method === 'PayNow') return <ArrowLeftRight size={14} className="text-[#7C2186]" />; // PayNow Purple
      if (method === 'Virtual Account') return <Building size={14} className="text-emerald-500" />;
      if (method === 'BI-FAST' || method === 'FAST Transfer') return <ArrowLeftRight size={14} className="text-orange-500" />;
      return <Globe size={14} className="text-slate-400" />;
  };

  // Handle New Charge from Virtual Terminal
  const handleTokenizeSuccess = (tokenData: any) => {
      setShowVirtualTerminal(false);
      
      let paymentMethod = 'Credit Card' as any;
      let acquirer = 'Stripe';
      
      if (tokenData.bin_details.type === 'QRIS') {
          paymentMethod = 'QRIS';
          acquirer = 'BCA (SNAP)';
      } else if (tokenData.bin_details.type === 'VIRTUAL_ACCOUNT') {
          paymentMethod = 'Virtual Account';
          acquirer = 'Mandiri (SNAP)';
      } else if (tokenData.bin_details.type === 'BI_FAST') {
          paymentMethod = 'BI-FAST';
          acquirer = 'BCA Digital';
      } else if (tokenData.bin_details.type === 'PAYNOW') {
          paymentMethod = 'PayNow';
          acquirer = 'DBS (MAX)';
      } else {
          acquirer = 'Stripe';
      }
      
      const newTx: Transaction = {
          id: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          amount: tokenData.bin_details.country_code === 'ID' ? 150000 : 45.00, 
          currency: tokenData.bin_details.country_code === 'ID' ? 'IDR' as any : (tokenData.bin_details.country_code === 'SG' ? 'SGD' as any : 'USD' as any),
          merchantId: 'MERCH_CONSOLE_VT',
          paymentMethod: paymentMethod,
          status: TransactionStatus.AUTHORIZED,
          customerEmail: 'customer@example.com',
          cardLast4: tokenData.mask ? tokenData.mask.slice(-4) : '4242',
          acquirer: acquirer,
          riskScore: Math.floor(Math.random() * 10),
          processingTimeMs: Math.floor(Math.random() * 200) + 100,
          ipAddress: '103.147.0.1',
          metadata: tokenData.bin_details
      };

      onAddTransaction(newTx);
  };

  // CSV Export Logic
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "ID", 
      "Status", 
      "Timestamp", 
      "Amount", 
      "Currency", 
      "Merchant ID", 
      "Payment Method", 
      "Risk Score", 
      "Acquirer", 
      "Customer Email", 
      "Processing Time (ms)"
    ];

    const escapeField = (field: any) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      // Escape quotes and wrap in quotes if contains comma, quote or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = filteredData.map(tx => [
        tx.id,
        tx.status,
        tx.timestamp,
        tx.amount,
        tx.currency,
        tx.merchantId,
        tx.paymentMethod,
        tx.riskScore,
        tx.acquirer,
        tx.customerEmail,
        tx.processingTimeMs
    ].map(escapeField));

    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      
      {/* Modals */}
      {showVirtualTerminal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <SecurePaymentForm 
                  onSuccess={handleTokenizeSuccess}
                  onCancel={() => setShowVirtualTerminal(false)}
              />
          </div>
      )}

      {selectedTransaction && (
          <TransactionDetailModal 
            transaction={selectedTransaction} 
            onClose={() => setSelectedTransaction(null)} 
          />
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">GET /v1/transactions</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowVirtualTerminal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
           >
             <Plus size={18} />
             New Charge
           </button>
           <button 
             onClick={handleExportCSV}
             className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
           >
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm dark:shadow-lg flex flex-wrap gap-4 items-center transition-colors">
            
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                type="text"
                placeholder="Search ID, Amount, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                />
            </div>

            {/* Quick Filters Group */}
            <div className="flex items-center gap-2 overflow-x-auto">
                <div className="relative">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value={TransactionStatus.AUTHORIZED}>Authorized</option>
                        <option value={TransactionStatus.CAPTURED}>Captured</option>
                        <option value={TransactionStatus.PENDING}>Pending 3DS</option>
                        <option value={TransactionStatus.FAILED}>Failed</option>
                        <option value={TransactionStatus.REFUNDED}>Refunded</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>

                {/* Payment Method Filter (Promoted to Main Bar) */}
                <div className="relative">
                    <select 
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                        <option value="ALL">All Methods</option>
                        {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5">
                <Calendar size={14} className="text-slate-500" />
                <input 
                    type="date" 
                    className="bg-transparent border-none text-slate-600 dark:text-slate-400 text-xs outline-none focus:text-slate-900 dark:focus:text-white"
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    value={dateRange.start}
                />
                <span className="text-slate-400">-</span>
                <input 
                    type="date" 
                    className="bg-transparent border-none text-slate-600 dark:text-slate-400 text-xs outline-none focus:text-slate-900 dark:focus:text-white"
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    value={dateRange.end}
                />
                </div>

                <button 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`p-2 rounded-lg transition-colors border flex items-center gap-2 ${showAdvancedFilters ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'}`}
                >
                    <Filter size={18} />
                    {activeFiltersCount > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">{activeFiltersCount}</span>}
                </button>
            </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                    <div className="relative">
                        <select 
                            value={currencyFilter}
                            onChange={(e) => setCurrencyFilter(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="ALL">All Currencies</option>
                            {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                    </div>
                </div>

                {/* Acquirer Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Acquirer / Gateway</label>
                    <div className="relative">
                        <select 
                            value={acquirerFilter}
                            onChange={(e) => setAcquirerFilter(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="ALL">All Gateways</option>
                            {uniqueAcquirers.map(acq => (
                                <option key={acq} value={acq!}>{acq}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                    </div>
                </div>

                <div className="flex items-end">
                     <button 
                        onClick={clearAllFilters}
                        className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/30 rounded-lg text-sm transition-all"
                     >
                         <X size={16} /> Clear Filters
                     </button>
                </div>
            </div>
        )}
      </div>

      {/* Data Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-xl flex-1 overflow-hidden flex flex-col transition-colors">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4 hidden md:table-cell">Merchant</th>
                <th className="p-4 hidden lg:table-cell">Risk</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((tx) => (
                  <tr key={tx.id} className={`group transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${getRowClass(tx.status)}`}>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                      {tx.id}
                      <div className="text-[10px] text-slate-400 dark:text-slate-600">{tx.acquirer}</div>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                      <div className="text-xs text-slate-400 dark:text-slate-600">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          {getMethodIcon(tx.paymentMethod)}
                          <span className="truncate max-w-[100px]">{tx.paymentMethod}</span>
                       </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                       {tx.currency} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 hidden md:table-cell text-slate-500 dark:text-slate-400">
                       {tx.merchantId}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                       <div className="flex items-center gap-2">
                          <div className={`w-16 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800`}>
                             <div 
                               className={`h-full rounded-full ${tx.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                               style={{ width: `${tx.riskScore}%` }}
                             ></div>
                          </div>
                          <span className={`text-xs font-mono ${tx.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                             {tx.riskScore}
                          </span>
                       </div>
                    </td>
                    <td className="p-4">
                       <button 
                         onClick={() => setSelectedTransaction(tx)}
                         className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium hover:underline"
                       >
                         <Eye size={12} /> View
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={8} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                      <AlertCircle size={48} className="mb-4 opacity-20" />
                      <p>No transactions found matching your filters.</p>
                      <button onClick={clearAllFilters} className="mt-4 text-blue-500 hover:underline">Clear all filters</button>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 flex justify-between items-center transition-colors">
           <span>Showing {filteredData.length} records</span>
           <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded border border-slate-300 dark:border-slate-800 opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 rounded border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
