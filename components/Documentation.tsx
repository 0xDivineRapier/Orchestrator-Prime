
import React, { useState } from 'react';
import { Hexagon, Search, ChevronRight, Menu, X, Copy, Check, Terminal, Globe, Shield, Code, ArrowLeft, AlertCircle, Zap, GitGraph, Database, Webhook } from 'lucide-react';

interface DocumentationProps {
  onBack: () => void;
  onLogin: () => void;
}

const SECTIONS = [
  {
    category: 'Getting Started',
    items: [
      { id: 'intro', title: 'Introduction' },
      { id: 'auth', title: 'Authentication' },
      { id: 'errors', title: 'Errors & Idempotency' }
    ]
  },
  {
    category: 'Core Resources',
    items: [
      { id: 'tokens', title: 'Vault Tokens' },
      { id: 'charges', title: 'Charges' },
      { id: 'customers', title: 'Customers' }
    ]
  },
  {
    category: 'Regional Rails (ASEAN)',
    items: [
      { id: 'qris', title: 'ID: SNAP QRIS' },
      { id: 'bifast', title: 'ID: BI-FAST Transfers' },
      { id: 'va', title: 'ID: Virtual Accounts' },
      { id: 'paynow', title: 'SG: PayNow' },
      { id: 'duitnow', title: 'MY: DuitNow' },
      { id: 'promptpay', title: 'TH: PromptPay' },
      { id: 'vietqr', title: 'VN: VietQR' },
      { id: 'phqr', title: 'PH: PhQR (GCash/InstaPay)' }
    ]
  },
  {
    category: 'Orchestration',
    items: [
      { id: 'routing', title: 'Smart Routing' },
      { id: 'webhooks', title: 'Webhooks' }
    ]
  }
];

const Documentation: React.FC<DocumentationProps> = ({ onBack, onLogin }) => {
  const [activeDoc, setActiveDoc] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CodeBlock = ({ lang, code }: { lang: string, code: string }) => (
    <div className="my-4 rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-xl group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400">{lang}</span>
        <button 
          onClick={() => handleCopy(code)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed text-slate-300">
          {code}
        </pre>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeDoc) {
      case 'intro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Orchestrator Prime API</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Welcome to the financial operating system for the modern enterprise. Orchestrator Prime unifies global payment rails into a single, programmable interface.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Globe className="text-blue-500 mb-4" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Global Connectivity</h3>
                <p className="text-sm text-slate-500">Connect to Stripe, Adyen, and Local Rails (Indonesia, India, Brazil) via one API.</p>
              </div>
              <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Shield className="text-emerald-500 mb-4" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">PCI Vault</h3>
                <p className="text-sm text-slate-500">We store the PANs. You keep the tokens. Reduce your compliance scope to SAQ-A.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Base URL</h3>
            <CodeBlock lang="bash" code="https://api.orchestrator.com/v1" />
          </div>
        );

      case 'auth':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Authentication</h1>
            <p className="text-slate-600 dark:text-slate-400">
              The API uses API keys to authenticate requests. You can view and manage your API keys in the Dashboard.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 my-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Warning:</strong> Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Bearer Token</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.
            </p>

            <CodeBlock 
              lang="bash" 
              code={`curl https://api.orchestrator.com/v1/charges \\
  -u api_key_mock_82938120398123:`} 
            />
          </div>
        );

      case 'errors':
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Errors & Idempotency</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Orchestrator Prime uses conventional HTTP response codes to indicate the success or failure of an API request.
                </p>

                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg my-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="p-3 font-mono text-slate-500">Code</th>
                                <th className="p-3 font-mono text-slate-500">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">200 - OK</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">Everything worked as expected.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">400 - Bad Request</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">The request was unacceptable, often due to missing a required parameter.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">401 - Unauthorized</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">No valid API key provided.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">402 - Request Failed</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">The parameters were valid but the request failed (e.g., card declined).</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">409 - Conflict</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">The request conflicts with another request (typically an idempotency key reuse).</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">429 - Too Many Requests</td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">Too many requests hit the API too quickly.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Idempotency</h3>
                <p className="text-slate-600 dark:text-slate-400">
                    The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. 
                    This is useful when an API call is disrupted in transit and you do not receive a response.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    To perform an idempotent request, provide an additional <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-sm font-mono">Idempotency-Key</code> header to the request.
                </p>

                <CodeBlock lang="bash" code={`curl https://api.orchestrator.com/v1/charges \\
  -H "Idempotency-Key: c7c99116-433e-4861-9f5e-491417d6205e" \\
  -d amount=2000 ...`} />
            </div>
          );

      case 'tokens':
          return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vault Tokens</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                      Tokenization allows you to collect sensitive payment data (PAN) without it ever touching your servers. 
                      You use our Client SDKs to tokenize the data directly from the user's browser/device.
                  </p>

                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Shield className="text-blue-500 shrink-0 mt-1" />
                      <div>
                          <h4 className="font-bold text-blue-700 dark:text-blue-300">PCI Scope Reduction</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              By using tokens, your backend never handles raw card numbers. This reduces your compliance burden to SAQ A-EP or SAQ A.
                          </p>
                      </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">The Token Object</h3>
                  <CodeBlock lang="json" code={`{
  "id": "tok_123456789",
  "type": "card",
  "created_at": "2024-03-20T10:00:00Z",
  "bin_details": {
      "brand": "Visa",
      "type": "Credit",
      "issuer": "Chase",
      "country_code": "US"
  },
  "fingerprint": "fing_98239283",
  "mask": "************4242"
}`} />
              </div>
          );

      case 'charges':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create a Charge</h1>
            <p className="text-slate-600 dark:text-slate-400">
              To charge a credit card or other payment source, you create a Charge object.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">The Payment Intent</h3>
            <CodeBlock 
              lang="bash" 
              code={`curl https://api.orchestrator.com/v1/charges \\
  -u api_key_mock_...: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa_123 \\
  -d capture=true`} 
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Parameters</h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                   <tr>
                     <th className="p-3">Arg</th>
                     <th className="p-3">Type</th>
                     <th className="p-3">Description</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                   <tr>
                     <td className="p-3 font-mono text-blue-600">amount</td>
                     <td className="p-3 font-mono text-xs">integer</td>
                     <td className="p-3">Amount in atomic units (e.g. cents).</td>
                   </tr>
                   <tr>
                     <td className="p-3 font-mono text-blue-600">currency</td>
                     <td className="p-3 font-mono text-xs">string</td>
                     <td className="p-3">3-letter ISO code (e.g. 'usd').</td>
                   </tr>
                   <tr>
                     <td className="p-3 font-mono text-blue-600">source</td>
                     <td className="p-3 font-mono text-xs">string</td>
                     <td className="p-3">The ID of the token returned by the Vault.</td>
                   </tr>
                 </tbody>
               </table>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Response</h3>
            <CodeBlock lang="json" code={`{
  "id": "ch_3Lb...",
  "object": "charge",
  "amount": 2000,
  "currency": "usd",
  "status": "succeeded",
  "paid": true,
  "source": {
      "id": "tok_visa_123",
      "brand": "Visa",
      "last4": "4242"
  },
  "outcome": {
      "network_status": "approved_by_network",
      "risk_level": "normal"
  }
}`} />
          </div>
        );

      case 'customers':
          return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customers</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                      Customer objects allow you to perform recurring charges and track multiple charges that are associated with the same customer.
                  </p>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Create a Customer</h3>
                  <CodeBlock lang="bash" code={`curl https://api.orchestrator.com/v1/customers \\
  -u api_key_mock_...: \\
  -d email="jenny.rosen@example.com" \\
  -d name="Jenny Rosen"`} />

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Attach Payment Method</h3>
                  <CodeBlock lang="bash" code={`curl https://api.orchestrator.com/v1/payment_methods/tok_visa_123/attach \\
  -u api_key_mock_...: \\
  -d customer="cus_NFFrFeIvFz"`} />
              </div>
          );

      case 'qris':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded">INDONESIA</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">SNAP v1.0</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">QRIS Payments</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Generate dynamic QR codes compliant with the **Quick Response Code Indonesian Standard (QRIS)**. Supports GoPay, OVO, ShopeePay, and Mobile Banking apps.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate QR Payload</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/snap/qr/generate
{
  "amount": {
    "value": "150000.00",
    "currency": "IDR"
  },
  "merchantId": "ID_MERCH_001",
  "terminalId": "A01"
}`} 
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Response</h3>
            <CodeBlock 
              lang="json" 
              code={`{
  "responseCode": "2000500",
  "responseMessage": "Successful",
  "qrContent": "00020101021226590014ID.CO.GOPAY.WWW01189360091431671234560210GOPAY..."
}`} 
            />
          </div>
        );
      
      case 'paynow':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded">SINGAPORE</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">SGQR</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PayNow SG</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Generate SGQR payloads for real-time payments in Singapore. Compatible with DBS PayLah!, OCBC, UOB, and GrabPay.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate PayNow QR</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/sg/paynow/generate
{
  "amount": {
    "value": "50.00",
    "currency": "SGD"
  },
  "uen": "201812345W",
  "expiry": 300
}`} 
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Response</h3>
            <CodeBlock 
              lang="json" 
              code={`{
  "qrString": "00020101021226590009SG.PAYNOW01012...",
  "txnId": "sg_tx_92381293"
}`} 
            />
          </div>
        );

      case 'duitnow':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold rounded">MALAYSIA</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">REAL-TIME</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">DuitNow</h1>
            <p className="text-slate-600 dark:text-slate-400">
              The national real-time payments platform for Malaysia. Supports DuitNow QR and Online Banking (OBW).
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate DuitNow QR</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/my/duitnow/generate
{
  "amount": {
    "value": "75.50",
    "currency": "MYR"
  },
  "referenceLabel": "ORDER-1234",
  "expiry": 300
}`} 
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Response</h3>
            <CodeBlock 
              lang="json" 
              code={`{
  "qrContent": "00020101021126580011MY.DUITNOW...",
  "status": "PENDING_PAYMENT"
}`} 
            />
          </div>
        );

      case 'promptpay':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded">THAILAND</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PromptPay</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Thailand's national electronic payment system. Create dynamic QR codes for instant THB transfers.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate PromptPay QR</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/th/promptpay/generate
{
  "amount": {
    "value": "500.00",
    "currency": "THB"
  },
  "type": "DYNAMIC",
  "billerId": "010555..."
}`} 
            />
          </div>
        );

      case 'vietqr':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded">VIETNAM</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">NAPAS 247</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">VietQR</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Standardized QR code for money transfers in Vietnam via the NAPAS 247 network.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate VietQR</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/vn/vietqr/generate
{
  "bankCode": "VCB", // Vietcombank
  "accountNo": "001100...",
  "amount": 250000,
  "currency": "VND",
  "memo": "Payment for Order #99"
}`} 
            />
          </div>
        );

      case 'phqr':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold rounded">PHILIPPINES</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">P2M</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PhQR (GCash / InstaPay)</h1>
            <p className="text-slate-600 dark:text-slate-400">
              The National QR Code Standard for the Philippines. Orchestrator Prime supports generating PhQR codes compatible with GCash, Maya, and InstaPay banks.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Generate PhQR</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/ph/phqr/generate
{
  "provider": "GCASH",
  "amount": {
    "value": "1250.00",
    "currency": "PHP"
  },
  "storeLabel": "Orchestrator Store"
}`} 
            />
          </div>
        );

      case 'bifast':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded">INDONESIA</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">REAL-TIME</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BI-FAST Transfers</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Initiate real-time interbank transfers (24/7) using the Bank Indonesia Fast Payment (BI-FAST) system. Supports proxy address resolution (Mobile/Email).
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">1. Account Inquiry</h3>
            <p className="text-sm text-slate-500">Resolve a proxy address to an account number.</p>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/snap/bifast/inquiry
{
  "proxyType": "MOBILE_PHONE_NO",
  "proxyValue": "08123456789"
}`} 
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">2. Credit Transfer</h3>
            <CodeBlock 
              lang="json" 
              code={`POST /v1/snap/bifast/transfer
{
  "amount": { "value": "500000.00", "currency": "IDR" },
  "beneficiaryAccountNo": "1234567890",
  "beneficiaryBankCode": "BCA",
  "remark": "Invoice #9923"
}`} 
            />
          </div>
        );
      
      case 'va':
          return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded">INDONESIA</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Virtual Accounts</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                      Create distinct collection numbers (Virtual Accounts) for customers to transfer funds into. Supported by major banks (Mandiri, BCA, BRI, BNI).
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Create VA</h3>
                  <CodeBlock lang="json" code={`POST /v1/snap/va/create
{
  "bankCode": "MANDIRI",
  "name": "CUSTOMER NAME",
  "amount": {
     "value": "200000.00",
     "currency": "IDR"
  },
  "isClosed": true,
  "expiryMinutes": 1440
}`} />
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Callback / Notification</h3>
                  <p className="text-sm text-slate-500">You will receive a webhook when the customer pays.</p>
                  <CodeBlock lang="json" code={`{
  "eventType": "VA_PAYMENT",
  "vaNumber": "88012938123",
  "amount": 200000,
  "status": "PAID"
}`} />
              </div>
          );

      case 'routing':
          return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Smart Routing</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                      Orchestrator Prime allows you to define logic to route transactions to different processors (Stripe, Adyen, TabaPay) based on cost, availability, or region.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 my-6">
                      <GitGraph size={32} className="text-purple-500 mb-4" />
                      <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Logic Engine</h3>
                      <p className="text-sm text-slate-500">Rules are evaluated top-down. The first rule that matches the condition triggers the routing decision.</p>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Rule Object</h3>
                  <CodeBlock lang="json" code={`{
  "priority": 1,
  "name": "High Value EU",
  "condition": "Currency == 'EUR' && Amount > 500",
  "destination": "Adyen"
}`} />

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Example Scenarios</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400 ml-2">
                      <li>Route all <strong>USD Debit</strong> cards &lt; <strong>$20</strong> to <strong>TabaPay</strong> (Lower fixed fee).</li>
                      <li>Route all <strong>IDR</strong> traffic to <strong>BCA SNAP</strong>.</li>
                      <li>Route all <strong>High Risk</strong> transactions to <strong>Stripe</strong> (Better fraud tools).</li>
                  </ul>
              </div>
          );

      case 'webhooks':
          return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Webhooks</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                      Listen for events on your account so your integration can automatically trigger reactions (e.g. provisioning services after a payment).
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Events</h3>
                  <ul className="grid grid-cols-2 gap-2 text-sm font-mono text-slate-600 dark:text-slate-400 my-4">
                      <li className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">charge.succeeded</li>
                      <li className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">charge.failed</li>
                      <li className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">charge.refunded</li>
                      <li className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">va.paid</li>
                  </ul>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Verifying Signatures</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Orchestrator signs all webhook events. You should verify the signature to ensure the request came from us.
                  </p>
                  <CodeBlock lang="javascript" code={`const sig = request.headers['orchestrator-signature'];
const event = orchestrator.webhooks.constructEvent(request.body, sig, endpointSecret);`} />
              </div>
          );

      default:
        return <div className="text-slate-500">Select a topic from the sidebar.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#020617]/80 border-b border-slate-200 dark:border-slate-800 h-16 px-4 md:px-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <button onClick={onBack} className="md:hidden text-slate-500 mr-2">
                 <ArrowLeft size={20} />
             </button>
             <div onClick={onBack} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Hexagon className="text-blue-500 fill-blue-500/20" size={24} />
                <span className="font-bold tracking-tight text-lg hidden sm:block">ORCHESTRATOR <span className="text-blue-500">DOCS</span></span>
             </div>
             <div className="hidden md:flex items-center ml-8 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm text-slate-500 gap-2 w-64">
                <Search size={14} />
                <span>Search...</span>
                <span className="ml-auto text-xs border border-slate-300 dark:border-slate-700 px-1 rounded">⌘K</span>
             </div>
         </div>
         <div className="flex items-center gap-4">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-500">
                {mobileMenuOpen ? <X size={24}/> : <Menu size={24} />}
             </button>
             <button 
               onClick={onLogin}
               className="hidden md:block px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
             >
               Sign In to Dashboard
             </button>
         </div>
      </nav>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block pt-20 md:pt-8 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="px-6 pb-6 h-full overflow-y-auto">
              <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors">
                 <ArrowLeft size={16} /> Back to Home
              </button>
              
              <div className="space-y-8">
                 {SECTIONS.map((section, idx) => (
                    <div key={idx}>
                       <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">{section.category}</h5>
                       <ul className="space-y-1">
                          {section.items.map(item => (
                             <li key={item.id}>
                                <button 
                                  onClick={() => {
                                      setActiveDoc(item.id);
                                      setMobileMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeDoc === item.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                   {item.title}
                                </button>
                             </li>
                          ))}
                       </ul>
                    </div>
                 ))}
              </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12 md:px-12 lg:px-24 overflow-y-auto min-h-[calc(100vh-64px)]">
           <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm text-blue-500 font-medium mb-4">
                 <span>Docs</span>
                 <ChevronRight size={14} />
                 <span>{SECTIONS.find(s => s.items.find(i => i.id === activeDoc))?.category}</span>
                 <ChevronRight size={14} />
                 <span className="text-slate-900 dark:text-white">{SECTIONS.find(s => s.items.find(i => i.id === activeDoc))?.items.find(i => i.id === activeDoc)?.title}</span>
              </div>
              
              {renderContent()}

              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                 <div className="text-sm text-slate-500">
                    Last updated: <span className="text-slate-900 dark:text-slate-300">2 days ago</span>
                 </div>
                 <div className="flex gap-4">
                    <button className="text-sm text-slate-500 hover:text-blue-500">Edit on GitHub</button>
                    <button className="text-sm text-slate-500 hover:text-blue-500">Report Issue</button>
                 </div>
              </div>
           </div>
        </main>

        {/* Right TOC (Desktop Only) */}
        <div className="hidden xl:block w-64 py-12 px-6 sticky top-16 h-[calc(100vh-64px)]">
           <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">On this page</h5>
           <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-4">
              <li className="text-blue-500 font-medium border-l-2 border-blue-500 -ml-[17px] pl-4">Overview</li>
              <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Request Format</li>
              <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Response</li>
              <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Error Codes</li>
           </ul>
        </div>

      </div>
    </div>
  );
};

export default Documentation;
