
import React, { useState } from 'react';
import { Shield, Key, Webhook, Users, Bell, Save, RotateCw, Eye, EyeOff, Copy, Check, GitGraph, Plus, Trash2, Zap, ArrowRight, AlertCircle, Play, Palette, Globe } from 'lucide-react';
import { RoutingRule } from '../types';
import { MOCK_RULES } from '../services/mockData';
import { useTheme } from '../services/themeContext';

const Settings: React.FC = () => {
  const { branding, updateBranding } = useTheme();
  const [activeTab, setActiveTab] = useState<'branding' | 'security' | 'routing' | 'webhooks' | 'team'>('branding');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Branding State (Local state for form)
  const [portalName, setPortalName] = useState(branding.portalName);
  const [brandColor, setBrandColor] = useState(branding.brandColor);
  const [customDomain, setCustomDomain] = useState(branding.customDomain || '');
  const [savingBranding, setSavingBranding] = useState(false);

  // Routing State
  const [rules, setRules] = useState<RoutingRule[]>(MOCK_RULES);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<RoutingRule>>({
      name: '',
      priority: rules.length + 1,
      condition: '',
      destination: 'Stripe',
      active: true
  });

  // Condition Builder State
  const [condField, setCondField] = useState('Amount');
  const [condOp, setCondOp] = useState('>');
  const [condVal, setCondVal] = useState('');

  const MOCK_API_KEY = "api_key_mock_82938120398123";

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_API_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteRule = (id: string) => {
      setRules(rules.filter(r => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
      setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleSaveBranding = () => {
    setSavingBranding(true);
    setTimeout(() => {
        updateBranding({
            portalName,
            brandColor,
            customDomain
        });
        setSavingBranding(false);
    }, 1000);
  };

  const handleSaveRule = () => {
      const builtCondition = `${condField} ${condOp} ${condVal}`;
      const rule: RoutingRule = {
          id: `RULE_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          name: newRule.name || 'Untitled Rule',
          priority: Number(newRule.priority),
          condition: builtCondition,
          destination: newRule.destination || 'Stripe',
          active: true
      };
      
      const updatedRules = [...rules, rule].sort((a, b) => a.priority - b.priority);
      setRules(updatedRules);
      setIsRuleModalOpen(false);
      // Reset form
      setNewRule({ name: '', priority: updatedRules.length + 1, destination: 'Stripe' });
      setCondVal('');
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      
      {/* Rule Creation Modal */}
      {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <GitGraph className="text-blue-500" size={20} />
                              New Routing Rule
                          </h3>
                          <p className="text-xs text-slate-500">Define logic to route transactions to specific gateways.</p>
                      </div>
                      <button onClick={() => setIsRuleModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          <Trash2 size={18} />
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rule Name</label>
                          <input 
                              type="text" 
                              value={newRule.name}
                              onChange={e => setNewRule({...newRule, name: e.target.value})}
                              placeholder="e.g. High Value EU Traffic"
                              className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>

                      <div className="flex gap-4">
                          <div className="w-1/3">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                              <input 
                                  type="number" 
                                  value={newRule.priority}
                                  onChange={e => setNewRule({...newRule, priority: Number(e.target.value)})}
                                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                              />
                          </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                          <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
                              <Zap size={12} /> Condition Logic (IF)
                          </label>
                          <div className="flex gap-2">
                              <select 
                                value={condField} 
                                onChange={e => setCondField(e.target.value)}
                                className="flex-1 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm px-2 outline-none"
                              >
                                  <option value="Amount">Amount</option>
                                  <option value="Currency">Currency</option>
                                  <option value="CardType">Card Type</option>
                                  <option value="RiskScore">Risk Score</option>
                                  <option value="Region">Region</option>
                              </select>
                              <select 
                                value={condOp}
                                onChange={e => setCondOp(e.target.value)}
                                className="w-20 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm px-2 outline-none font-mono"
                              >
                                  <option value="==">==</option>
                                  <option value="!=">!=</option>
                                  <option value=">">&gt;</option>
                                  <option value="<">&lt;</option>
                              </select>
                              <input 
                                  type="text" 
                                  value={condVal}
                                  onChange={e => setCondVal(e.target.value)}
                                  placeholder="Value"
                                  className="flex-1 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm px-2 outline-none"
                              />
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono pl-1">
                              Preview: <span className="text-blue-500">{condField} {condOp} {condVal || '...'}</span>
                          </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                          <label className="block text-xs font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-2">
                              <ArrowRight size={12} /> Route To (THEN)
                          </label>
                          <select 
                             value={newRule.destination}
                             onChange={e => setNewRule({...newRule, destination: e.target.value})}
                             className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm outline-none"
                          >
                              <option value="Stripe">Stripe (Global)</option>
                              <option value="Adyen">Adyen (Europe)</option>
                              <option value="Chase Paymentech">Chase Paymentech (US)</option>
                              <option value="TabaPay">TabaPay (Debit Low Cost)</option>
                              <option value="BCA (SNAP)">BCA SNAP (Indonesia)</option>
                              <option value="Mandiri (SNAP)">Mandiri SNAP (Indonesia)</option>
                          </select>
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                             onClick={() => setIsRuleModalOpen(false)}
                             className="flex-1 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                             onClick={handleSaveRule}
                             className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/20"
                          >
                              Save Rule
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">Configure your PG white-labeling and core rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-2">
            {[
                { id: 'branding', label: 'White Label & Branding', icon: <Palette size={18} /> },
                { id: 'routing', label: 'Smart Routing', icon: <GitGraph size={18} /> },
                { id: 'security', label: 'API Keys & Security', icon: <Key size={18} /> },
                { id: 'webhooks', label: 'Webhooks', icon: <Webhook size={18} /> },
                { id: 'team', label: 'Sub-Merchants', icon: <Users size={18} /> },
            ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm dark:shadow-xl overflow-y-auto transition-colors">
            
            {/* --- BRANDING / WHITE LABEL --- */}
            {activeTab === 'branding' && (
                <div className="space-y-8 animate-in fade-in">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Platform Customization</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Rebrand the dashboard for your sub-merchants. The settings below apply to all merchant logins.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Portal Name</label>
                                <input 
                                    type="text" 
                                    value={portalName}
                                    onChange={(e) => setPortalName(e.target.value)}
                                    className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custom Domain</label>
                                <div className="flex items-center">
                                    <span className="h-10 bg-slate-100 dark:bg-slate-900 border-y border-l border-slate-200 dark:border-slate-800 rounded-l-lg px-3 text-sm text-slate-500 flex items-center">
                                        https://
                                    </span>
                                    <input 
                                        type="text" 
                                        value={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.value)}
                                        placeholder="payments.yourbrand.com"
                                        className="flex-1 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-r-lg px-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                    <AlertCircle size={10} /> Add CNAME record pointing to <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">alias.orchestrator.com</code>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                                    />
                                    <input 
                                        type="text"
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="w-24 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 text-sm font-mono text-slate-900 dark:text-white outline-none uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center">
                            <div className="w-full max-w-[200px] space-y-3 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
                                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
                                <div className="h-8 w-full rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: brandColor }}>
                                    Your Button
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{portalName}</span>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-500 uppercase tracking-wider font-bold">Live Preview</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={handleSaveBranding}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                        >
                            {savingBranding ? <RotateCw size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Configuration
                        </button>
                    </div>
                </div>
            )}

            {/* --- ROUTING ENGINE --- */}
            {activeTab === 'routing' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Routing Engine</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Drag to reorder priority. Logic executes top-down.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <Play size={16} /> Simulator
                            </button>
                            <button 
                                onClick={() => setIsRuleModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors"
                            >
                                <Plus size={16} /> New Rule
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <div 
                                key={rule.id} 
                                className={`group relative p-4 rounded-xl border-2 transition-all ${rule.active ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-500/50' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50 opacity-60'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-slate-500 text-sm">
                                        {rule.priority}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white">{rule.name}</span>
                                            {!rule.active && <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 rounded">Inactive</span>}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-mono">
                                            <span className="text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                                IF {rule.condition}
                                            </span>
                                            <ArrowRight size={12} className="text-slate-400" />
                                            <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-500/20">
                                                {rule.destination}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleToggleRule(rule.id)}
                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                            title={rule.active ? "Disable Rule" : "Enable Rule"}
                                        >
                                            <RotateCw size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRule(rule.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {rules.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                            <GitGraph className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
                            <p className="text-slate-500 text-sm">No routing rules defined.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'security' && (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Standard API Keys</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">These keys allow full access to the Orchestration API. Keep them secret.</p>
                        
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Secret Key (Test)</div>
                                <div className="font-mono text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    {showKey ? MOCK_API_KEY : "api_key_mock_•••••••••••••••••"}
                                    <button onClick={() => setShowKey(!showKey)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                                <button className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded border border-slate-300 dark:border-slate-700">
                                    Roll Key
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Signing Keys (JWT)</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage the RSA-2048 keys used to sign authentication tokens.</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/20 border border-blue-200 dark:border-blue-600/30 rounded text-xs font-bold transition-colors">
                                <RotateCw size={14} /> Rotate Now
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 border border-green-500/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <div>
                                        <div className="text-sm font-mono text-slate-700 dark:text-slate-200">kid_8273...9283</div>
                                        <div className="text-xs text-slate-500">Created 2 hours ago</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                                    <div>
                                        <div className="text-sm font-mono text-slate-700 dark:text-slate-200">kid_1123...4421</div>
                                        <div className="text-xs text-slate-500">Revoked 26 hours ago</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">REVOKED</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'webhooks' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Webhook Endpoints</h3>
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded">Add Endpoint</button>
                     </div>
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-sm text-slate-700 dark:text-slate-300">https://api.merchant.com/webhooks/payment</span>
                                <span className="text-xs bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 dark:border-green-500/20">Live</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded">charge.succeeded</span>
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded">charge.failed</span>
                            </div>
                            <div className="text-xs text-slate-500">Last delivery: 2 mins ago (200 OK)</div>
                        </div>
                     </div>
                </div>
            )}

            {activeTab === 'team' && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="mb-4">Manage your Sub-Merchants and Team Members.</p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm">Add New Merchant</button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
