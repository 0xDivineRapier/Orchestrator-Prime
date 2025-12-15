
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, FileCheck, Globe, Server, UserCheck } from 'lucide-react';

interface CompliancePageProps {
  onBack: () => void;
  onLogin: () => void;
}

const CompliancePage: React.FC<CompliancePageProps> = ({ onBack, onLogin }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Home</span>
          </button>
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
             <ShieldCheck size={16} /> SOC2 TYPE II CERTIFIED
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                Compliance as Code
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Navigate the complex landscape of global financial regulations without slowing down. 
                Built-in PCI compliance, automated KYB, and data sovereignty.
            </p>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
                {
                    icon: <Lock size={32} className="text-blue-500" />,
                    title: "PCI DSS Vault",
                    desc: "Our tokenization engine isolates your infrastructure from sensitive card data. We take on the SAQ-D burden so you qualify for SAQ-A."
                },
                {
                    icon: <UserCheck size={32} className="text-purple-500" />,
                    title: "Automated KYB/KYC",
                    desc: "Verify merchants and sub-merchants instantly. We check business registries, sanctions lists (OFAC), and beneficial ownership automatically."
                },
                {
                    icon: <Globe size={32} className="text-emerald-500" />,
                    title: "Data Sovereignty",
                    desc: "Keep user data in its region of origin. Our CockroachDB clusters are geo-partitioned to satisfy GDPR, RBI, and OJK regulations."
                }
            ].map((feature, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>

        {/* Deep Dive: Data Residency */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
             <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-12 overflow-hidden relative">
                 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                         <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                             <Server className="text-indigo-500" />
                             Geo-Partitioning Logic
                         </h2>
                         <p className="text-slate-400 mb-6 leading-relaxed">
                             In traditional systems, you have to spin up separate instances for each region (e.g., US, EU, India) to comply with data localization laws.
                         </p>
                         <p className="text-slate-400 mb-8 leading-relaxed">
                             With Orchestrator Prime, it's one database. The system automatically pins rows to specific physical nodes based on the `country_code` column.
                         </p>
                         <button className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-2">
                             Read the Engineering Blog <ArrowLeft className="rotate-180" size={16} />
                         </button>
                     </div>
                     <div className="bg-[#0d1117] rounded-xl border border-slate-800 shadow-2xl p-6 font-mono text-sm">
                         <div className="text-slate-500 mb-2">// schema.sql</div>
                         <pre className="text-slate-300">
{`CREATE TABLE users (
  id UUID PRIMARY KEY,
  name STRING,
  country_code STRING,
  
  -- The Magic: Computed Partitioning
  region STRING AS (
    CASE 
      WHEN country_code = 'ID' THEN 'asia-southeast1'
      WHEN country_code = 'IN' THEN 'asia-south1'
      ELSE 'us-east1'
    END
  ) STORED
) PARTITION BY LIST (region);`}
                         </pre>
                     </div>
                 </div>
             </div>
        </div>

        {/* Certifications Bar */}
        <div className="border-y border-slate-800 bg-slate-900/30 py-16">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Audited & Verified By</p>
                <div className="flex flex-wrap justify-center gap-12 text-slate-400 font-bold text-xl">
                    <div className="flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> SOC2 Type II</div>
                    <div className="flex items-center gap-2"><Lock className="text-blue-500"/> PCI DSS Level 1</div>
                    <div className="flex items-center gap-2"><FileCheck className="text-purple-500"/> ISO 27001</div>
                    <div className="flex items-center gap-2"><Globe className="text-orange-500"/> GDPR Compliant</div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default CompliancePage;
