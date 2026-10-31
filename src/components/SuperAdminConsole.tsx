import React, { useState } from 'react';
import { 
  MOCK_TENANTS, 
  MOCK_AUDIT_LOGS, 
  MOCK_CUSTOMERS, 
  BreakGlassAuditEntry, 
  BusinessTenant 
} from '../data/mockData';
import { maskPII } from '../lib/identityPrivacy';
import { 
  ShieldAlert, 
  Building2, 
  Server, 
  CreditCard, 
  Lock, 
  Unlock, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Key, 
  FileText,
  DollarSign,
  TrendingUp,
  Cpu,
  Search
} from 'lucide-react';

export const SuperAdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'infra' | 'breakglass' | 'finance'>('overview');
  const [tenants, setTenants] = useState<BusinessTenant[]>(MOCK_TENANTS);
  const [auditLogs, setAuditLogs] = useState<BreakGlassAuditEntry[]>(MOCK_AUDIT_LOGS);

  // Break-glass emergency unmasking state
  const [isBreakGlassActive, setIsBreakGlassActive] = useState(false);
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [ticketId, setTicketId] = useState('INC-90455');
  const [justification, setJustification] = useState(
    'Investigating false-positive captive portal lockout reported by guest via Grand Horizon helpdesk.'
  );

  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const newTier = t.tier === 'ENTERPRISE' ? 'PROFESSIONAL' : 'ENTERPRISE';
          return { ...t, tier: newTier };
        }
        return t;
      })
    );
  };

  const handleActivateBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: BreakGlassAuditEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      operatorEmail: 'superadmin.sec@echo-platform.io',
      targetCustomerEchoId: 'ALL_TENANTS_MASK_RELEASE',
      justification,
      ticketId,
      status: 'ACTIVE_LEASE',
      expiresInMinutes: 15,
    };

    setAuditLogs([newLog, ...auditLogs]);
    setIsBreakGlassActive(true);
    setShowBreakGlassModal(false);
  };

  const handleRevokeBreakGlass = () => {
    setIsBreakGlassActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold tracking-wider uppercase text-rose-400">
              ECHO Global Super Admin Console
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Privileged Root Infrastructure Tier • Hardware AAA & Multi-Tenant Orchestration
          </p>
        </div>

        {/* Break-Glass Status Pill */}
        <div className="flex items-center gap-3">
          {isBreakGlassActive ? (
            <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-600 px-3 py-1.5 rounded-xl text-rose-300 text-xs">
              <Unlock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Break-Glass Elevated Lease Active (14m remaining)</span>
              <button
                onClick={handleRevokeBreakGlass}
                className="ml-2 text-xs font-bold underline hover:text-white"
              >
                Revoke Now
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowBreakGlassModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Privileged Break-Glass Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'tenants'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Subscribed Organizations ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('infra')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'infra'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Infrastructure Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('breakglass')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'breakglass'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit & Privacy Guard ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'finance'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Commercial & M-Pesa Gateways</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Monthly Recurring Revenue</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">KSh 3,450,000</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+18.4% YoY</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Active Subscribed Businesses</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">48</span>
              <span className="text-[11px] text-slate-400 block mt-1">Across 112 hotel & café branches</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Authenticated Sessions</span>
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">142,500+</span>
              <span className="text-[11px] text-slate-400 block mt-1">Processed this month</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Platform Churn Rate</span>
              <span className="text-2xl font-bold text-emerald-600">0.8%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Benchmark: &lt; 2.5%</span>
            </div>
          </div>

          {/* Infrastructure quick health bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Core Subsystems Health Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">FreeRADIUS AAA</div>
                  <div className="text-[10px] text-slate-400">38ms avg latency</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">n8n Retention Jobs</div>
                  <div className="text-[10px] text-slate-400">24 active workers</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">M-Pesa Webhook API</div>
                  <div className="text-[10px] text-slate-400">100% verified sigs</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Meta WA Cloud API</div>
                  <div className="text-[10px] text-slate-400">Tier 2 Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENANT MANAGEMENT */}
      {activeTab === 'tenants' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Tenant Organizations Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provisioning, branch allocations, and subscription plan tiers.
              </p>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
              + Onboard New Business
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Business Entity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Branches</th>
                  <th className="py-3 px-4">Active Guests</th>
                  <th className="py-3 px-4">Subscription Tier</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{t.logo}</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {t.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{t.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.industryLabel}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {t.branchesCount} Branches
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.activeGuestsCount.toLocaleString()} guests
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold text-[11px]">
                        {t.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      KSh {t.monthlyRevenueKsh.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleTenantStatus(t.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Adjust Tier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INFRASTRUCTURE TELEMETRY */}
      {activeTab === 'infra' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                FreeRADIUS AAA Cluster (RFC 2865/2866)
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Primary auth servers in Frankfurt (Primary) and Cape Town (Edge Acceleration) with round-robin failover.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs space-y-1">
                <div>[STATUS] Node-01 (FRA): ONLINE • Load: 12% • Uptime: 99.98%</div>
                <div>[STATUS] Node-02 (CPT): ONLINE • Load: 8% • Uptime: 99.99%</div>
                <div>[PORT] Auth: 1812/UDP • Acct: 1813/UDP • TLS: 2083/TCP</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                n8n Automation & Cadence Cron Daemon
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Executes hourly retention classification cron, evaluates cooling thresholds, and dispatches compliant reconnection triggers.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-purple-300 font-mono text-xs space-y-1">
                <div>[WORKER] CadenceEvaluatorJob: Completed (0.8s)</div>
                <div>[WORKER] QuietHoursGovernor: Active (Enforcing 21:00-08:00)</div>
                <div>[QUEUE] BullMQ Redis: 0 failed / 42 completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS & ZERO-BACKDOOR PII MASKING */}
      {activeTab === 'breakglass' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Privileged Access Policy:</strong>
              Customer PII is cryptographically masked by default. Break-glass elevation requires an authorized incident ticket and generates an immutable audit record.
            </div>
          </div>

          {/* Sample Customer Record Preview showing Masked vs Unmasked */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Infrastructure Audit View of Customer Database
              </h4>
              <span className="text-xs text-slate-400">
                Mode: <strong className={isBreakGlassActive ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                  {isBreakGlassActive ? 'UNMASKED (Break-Glass Active)' : 'MASKED (Default Security)'}
                </strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {MOCK_CUSTOMERS.slice(0, 3).map((cust) => (
                <div key={cust.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {cust.name}
                    </span>
                    <span className="text-slate-400 ml-2 font-mono">({cust.echoId})</span>
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-300">
                    Phone: {maskPII(cust.phone, 'phone', isBreakGlassActive)} • Email: {maskPII(cust.email, 'email', isBreakGlassActive)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Immutable Privileged Access Audit Trail
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Audit ID</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Operator</th>
                    <th className="py-2.5 px-4">Incident Ticket</th>
                    <th className="py-2.5 px-4">Mandatory Justification</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {log.id}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{log.timestamp.slice(0, 16)}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {log.operatorEmail}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-teal-600 font-semibold">
                        {log.ticketId}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={log.justification}>
                        {log.justification}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            log.status === 'ACTIVE_LEASE'
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL & M-PESA DARAJA */}
      {activeTab === 'finance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Payment Gateway Reconciliation & Invoicing
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                M-Pesa Daraja API Integration (Kenya)
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automated C2B/B2B subscription collection via Paybill 890422. Instant webhook signature validation and invoice clearing.
              </p>
              <div className="text-[11px] font-mono text-emerald-600 font-semibold">
                Status: ACTIVE • Transacting KSh 3.4M/month
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                International Card Billing (Stripe)
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                PCI DSS Level 1 certified recurring card billing for international hotel groups and overseas branches.
              </p>
              <div className="text-[11px] font-mono text-emerald-600 font-semibold">
                Status: ACTIVE • Multi-Currency (USD, EUR, KSh)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Break-Glass Authorization Modal */}
      {showBreakGlassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <form
            onSubmit={handleActivateBreakGlass}
            className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Break-Glass Elevated Privilege Request
                </h3>
                <span className="text-[11px] text-rose-600 font-semibold uppercase">
                  Audited Security Incident Protocol
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Unmasking customer identifiers is strictly monitored under legal compliance standards. An immutable audit record will be logged with your timestamp, IP, and justification.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident / Ticket ID
              </label>
              <input
                type="text"
                required
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="e.g. INC-90455"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Regulatory Justification
              </label>
              <textarea
                rows={3}
                required
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="State the technical reason, customer authorization, or dispute context..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              ></textarea>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowBreakGlassModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Abort
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Authorize 15-Min Lease
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
