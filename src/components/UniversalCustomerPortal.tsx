import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Building2, 
  Sliders, 
  Download, 
  Trash2, 
  Check, 
  AlertCircle,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';

export const UniversalCustomerPortal: React.FC = () => {
  // Sovereign identity state for James Ndung'u (ECHO-10001)
  const [globalOptOut, setGlobalOptOut] = useState(false);
  const [preferredLang, setPreferredLang] = useState('en');
  const [activeTab, setActiveTab] = useState<'relationships' | 'privacy' | 'devices'>('relationships');
  const [showExportToast, setShowExportToast] = useState(false);
  const [showErasureModal, setShowErasureModal] = useState(false);

  // Business-specific relationships state
  const [relationships, setRelationships] = useState([
    {
      businessId: 'ORG-GRAND-HORIZON',
      businessName: 'Grand Horizon Resort & Spa',
      businessCustomerId: 'GH-001',
      category: 'Luxury Hotel & Resort',
      totalVisits: 8,
      lastVisit: '4 days ago',
      loyaltyTier: 'Silver Guest (1,250 Pts)',
      smsOptIn: true,
      whatsAppOptIn: false,
      emailOptIn: true,
      notes: 'Prefers ocean-view suite & early check-in',
    },
    {
      businessId: 'ORG-JAVA-COFFEE',
      businessName: 'Java House Artisan Roastery',
      businessCustomerId: 'JC-018',
      category: 'Specialty Café',
      totalVisits: 14,
      lastVisit: 'Yesterday',
      loyaltyTier: 'Gold Patron (210 Pts)',
      smsOptIn: false,
      whatsAppOptIn: true,
      emailOptIn: true,
      notes: 'Oat Flat White, terrace table',
    },
    {
      businessId: 'ORG-MARA-SAFARI',
      businessName: 'Mara River Luxury Tented Camp',
      businessCustomerId: 'MR-102',
      category: 'Safari Lodge & Conservancy',
      totalVisits: 1,
      lastVisit: '8 months ago',
      loyaltyTier: 'Explorer (100 Pts)',
      smsOptIn: false,
      whatsAppOptIn: false,
      emailOptIn: true,
      notes: 'Conservancy conservation partner',
    },
  ]);

  // Connected Devices
  const [devices, setDevices] = useState([
    { id: 'DEV-01', name: 'iPhone 15 Pro', mac: '7E:4B:92:1A:3C:F0', lastSeen: 'Today at 09:14 AM', type: 'phone' },
    { id: 'DEV-02', name: 'MacBook Pro M3', mac: 'A2:89:C4:02:51:77', lastSeen: 'Yesterday at 04:30 PM', type: 'laptop' },
  ]);

  const handleToggleConsent = (businessId: string, channel: 'sms' | 'whatsapp' | 'email') => {
    setRelationships(prev =>
      prev.map(r => {
        if (r.businessId === businessId) {
          if (channel === 'sms') return { ...r, smsOptIn: !r.smsOptIn };
          if (channel === 'whatsapp') return { ...r, whatsAppOptIn: !r.whatsAppOptIn };
          if (channel === 'email') return { ...r, emailOptIn: !r.emailOptIn };
        }
        return r;
      })
    );
  };

  const handleRevokeDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleExportData = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Identity Card Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 dark:bg-teal-400/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-teal-400 border border-slate-700 dark:border-slate-700 flex items-center justify-center text-2xl font-bold shadow-md">
              JN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  James Ndung’u
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified ECHO ID
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                ECHO-10001 • james.ndungu@example.ke • +254 712 345 678
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Export Personal Data</span>
            </button>
            <button
              onClick={() => setShowErasureModal(true)}
              className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Right to Erasure</span>
            </button>
          </div>
        </div>

        {/* Global Opt-Out Toggle Banner */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Master Communication Opt-Out
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Overrides all venue marketing permissions across all participating establishments.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={globalOptOut}
              onChange={(e) => setGlobalOptOut(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-rose-600"></div>
            <span className="ml-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {globalOptOut ? 'Global Opt-Out Active' : 'Normal Permissions'}
            </span>
          </label>
        </div>
      </div>

      {showExportToast && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-600" />
            <span>
              <strong>GDPR / Kenya DPA Data Archive generated:</strong> Your sovereign identity file (JSON format) has been compiled including 3 business relationship profiles.
            </span>
          </div>
          <button
            onClick={() => setShowExportToast(false)}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('relationships')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'relationships'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Connected Businesses ({relationships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'devices'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Authorized Devices ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'privacy'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Dual-Identity Guard</span>
        </button>
      </div>

      {/* TAB 1: CONNECTED BUSINESSES */}
      {activeTab === 'relationships' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Zero Cross-Establishment Tracking:</strong>
              Each venue profile is partitioned. Your visit histories and preferences are never shared between businesses.
            </div>
          </div>

          <div className="grid gap-4">
            {relationships.map((rel) => (
              <div
                key={rel.businessId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {rel.businessName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
                        Customer ID: {rel.businessCustomerId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {rel.category} • {rel.loyaltyTier}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                      {rel.totalVisits} Recorded Physical Visits
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Last visit: {rel.lastVisit}
                    </span>
                  </div>
                </div>

                {/* Preferences Note */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Private Venue Preferences: </span>
                  {rel.notes}
                </div>

                {/* Independent Channel Consent Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Marketing Permissions for {rel.businessName}:
                  </span>

                  <div className="flex items-center gap-4">
                    {/* SMS */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={rel.smsOptIn && !globalOptOut}
                        disabled={globalOptOut}
                        onChange={() => handleToggleConsent(rel.businessId, 'sms')}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                      />
                      <span className={globalOptOut ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>
                        SMS
                      </span>
                    </label>

                    {/* WhatsApp */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={rel.whatsAppOptIn && !globalOptOut}
                        disabled={globalOptOut}
                        onChange={() => handleToggleConsent(rel.businessId, 'whatsapp')}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                      />
                      <span className={globalOptOut ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>
                        WhatsApp
                      </span>
                    </label>

                    {/* Email */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={rel.emailOptIn && !globalOptOut}
                        disabled={globalOptOut}
                        onChange={() => handleToggleConsent(rel.businessId, 'email')}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                      />
                      <span className={globalOptOut ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>
                        Email
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUTHORIZED DEVICES */}
      {activeTab === 'devices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Connected Hardware Devices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Devices associated with your Universal ECHO profile for fast seamless Wi-Fi auto-connect.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {devices.map((device) => (
              <div key={device.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {device.type === 'phone' ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {device.name}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      MAC: {device.mac} • {device.lastSeen}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeDevice(device.id)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  Revoke Device
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY & DUAL-IDENTITY GUARD */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Regulatory Rights & Transparency Statement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compliant with Kenya Data Protection Act 2019 and European General Data Protection Regulation (GDPR).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                No Cross-Establishment Tracking
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When you visit Grand Horizon Hotel, the management cannot view whether you also frequent Java Coffee House or Mara Safari Lodge. Your business profiles remain cryptographically partitioned.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Quiet Hours Guarantee
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No automated reconnection or loyalty message can ever be transmitted to your phone between 21:00 (9:00 PM) and 08:00 (8:00 AM) venue local time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Erasure Confirmation Modal */}
      {showErasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Exercise Right to Erasure?
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Under Kenya DPA 2019 Section 40 and GDPR Article 17, requesting erasure will permanently purge your Universal ECHO ID (<code className="text-xs font-mono">ECHO-10001</code>) and unlink all connected business relationships. This action is irreversible.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowErasureModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowErasureModal(false);
                  alert('Erasure request simulated: Cryptographic purge job queued.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Erasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
