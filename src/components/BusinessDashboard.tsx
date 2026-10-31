import React, { useState, useMemo } from 'react';
import { 
  MOCK_TENANTS, 
  MOCK_CUSTOMERS, 
  MOCK_CAMPAIGNS, 
  CustomerRecord, 
  ReconnectionCampaign,
  BusinessTenant
} from '../data/mockData';
import { 
  classifyCustomerRetention, 
  IndustryType, 
  RetentionClassification, 
  INDUSTRY_DEFAULTS 
} from '../lib/retentionEngine';
import { RetentionBadge, RETENTION_CONFIG } from './RetentionBadge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Wifi, 
  Send, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  Search, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Sliders,
  Radio,
  FileCode2,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';

export interface ComputedCustomerRecord extends CustomerRecord {
  computedClassification: RetentionClassification;
  reason: string;
  retentionScore: number;
  recommendedAction: string;
}

export const BusinessDashboard: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>(MOCK_TENANTS[0].id);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(MOCK_TENANTS[0].branches[0].id);
  const [activeTab, setActiveTab] = useState<'retention' | 'customers' | 'reconnection' | 'wifi' | 'hardware'>('retention');

  // Customer filter and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<ComputedCustomerRecord | null>(null);

  // Industry Calibration Override
  const currentTenant = MOCK_TENANTS.find(t => t.id === selectedTenantId) || MOCK_TENANTS[0];
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>(currentTenant.industry);

  // Reconnection Campaigns State
  const [campaigns, setCampaigns] = useState<ReconnectionCampaign[]>(MOCK_CAMPAIGNS);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignStage, setNewCampaignStage] = useState<RetentionClassification>('COOLING');
  const [newCampaignChannel, setNewCampaignChannel] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp');
  const [newCampaignTemplate, setNewCampaignTemplate] = useState(
    'Hello {{name}}, we miss you at {{business_name}}! Come in this week and enjoy your customary table with a complimentary drink on us.'
  );

  // Compute live retention classification for all customers of this tenant
  const tenantCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(c => c.businessId === currentTenant.id).map(customer => {
      const classificationResult = classifyCustomerRetention(
        {
          totalVisits: customer.totalVisits,
          daysSinceLastVisit: customer.lastVisitDaysAgo,
          firstVisitDaysAgo: customer.firstVisitDaysAgo,
        },
        activeIndustry
      );

      return {
        ...customer,
        computedClassification: classificationResult.classification,
        reason: classificationResult.reason,
        retentionScore: classificationResult.retentionScore,
        recommendedAction: classificationResult.recommendedAction,
      };
    });
  }, [currentTenant.id, activeIndustry]);

  // Stage counts for metrics
  const stageCounts = useMemo(() => {
    const counts: Record<RetentionClassification, number> = {
      NEW: 0,
      ACTIVE: 0,
      LOYAL: 0,
      RETURNING: 0,
      COOLING: 0,
      AT_RISK: 0,
      INACTIVE: 0,
      POTENTIALLY_LOST: 0,
    };
    tenantCustomers.forEach(c => {
      if (counts[c.computedClassification] !== undefined) {
        counts[c.computedClassification]++;
      }
    });
    return counts;
  }, [tenantCustomers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return tenantCustomers.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.echoId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage =
        selectedStageFilter === 'ALL' || c.computedClassification === selectedStageFilter;
      return matchesSearch && matchesStage;
    });
  }, [tenantCustomers, searchQuery, selectedStageFilter]);

  const handleApproveCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: 'ACTIVE' } : c))
    );
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: ReconnectionCampaign = {
      id: `CAMP-00${campaigns.length + 1}`,
      name: newCampaignName,
      targetStage: newCampaignStage,
      channel: newCampaignChannel,
      messageTemplate: newCampaignTemplate,
      sentCount: 0,
      reactivatedCount: 0,
      status: 'PENDING_APPROVAL',
      lastRunDate: 'Not started',
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsCreatingCampaign(false);
    setNewCampaignName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Tenant & Branch Context Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            {currentTenant.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {currentTenant.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                {currentTenant.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tenant ID: {currentTenant.id} • Multi-Tenant Isolated Customer Data Store
            </p>
          </div>
        </div>

        {/* Tenant & Branch Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Tenant:
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => {
                setSelectedTenantId(e.target.value);
                const t = MOCK_TENANTS.find(item => item.id === e.target.value);
                if (t) {
                  setSelectedBranchId(t.branches[0].id);
                  setActiveIndustry(t.industry);
                }
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            >
              {MOCK_TENANTS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Branch:
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            >
              {currentTenant.branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.activeDevices} devices online)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('retention')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'retention'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Retention Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'customers'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Roster ({tenantCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reconnection')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'reconnection'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Reconnection Automation ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wifi')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'wifi'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Wi-Fi Network Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'hardware'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Hardware & RADIUS AAA</span>
        </button>
      </div>

      {/* TAB 1: RETENTION INTELLIGENCE OVERVIEW */}
      {activeTab === 'retention' && (
        <div className="space-y-6">
          {/* Industry Archetype Calibration Banner */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold tracking-wide uppercase text-teal-400">
                  Return Cadence Calibration
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Select venue archetype to apply calibrated visit return intervals across active guests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              {(['hotel', 'cafe', 'restaurant', 'safari_lodge'] as IndustryType[]).map((ind) => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    activeIndustry === ind
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ind.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Current Calibrated Thresholds Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Cadence (Return)</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                ≤ {INDUSTRY_DEFAULTS[activeIndustry].expectedReturnDays} days
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Cooling Stage</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {INDUSTRY_DEFAULTS[activeIndustry].expectedReturnDays + 1} - {INDUSTRY_DEFAULTS[activeIndustry].coolingDays}d
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">At-Risk Stage</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {INDUSTRY_DEFAULTS[activeIndustry].coolingDays + 1} - {INDUSTRY_DEFAULTS[activeIndustry].atRiskDays}d
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Inactive Threshold</span>
              <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                {INDUSTRY_DEFAULTS[activeIndustry].atRiskDays + 1} - {INDUSTRY_DEFAULTS[activeIndustry].inactiveDays}d
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Potentially Lost</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                &gt; {INDUSTRY_DEFAULTS[activeIndustry].potentiallyLostDays}d
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">VIP Min Visits</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                ≥ {INDUSTRY_DEFAULTS[activeIndustry].loyalVisitCountMin} visits
              </span>
            </div>
          </div>

          {/* 8-Stage Retention Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Retention Distribution
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                8 calibrated retention stages
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(RETENTION_CONFIG) as RetentionClassification[]).map((stage) => {
                const conf = RETENTION_CONFIG[stage];
                const count = stageCounts[stage] || 0;
                return (
                  <button
                    key={stage}
                    onClick={() => {
                      setSelectedStageFilter(stage);
                      setActiveTab('customers');
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 text-left transition-all shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <RetentionBadge classification={stage} size="sm" />
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {count}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {conf.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER ROSTER */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID or ECHO ID..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Stage filter & count */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                Showing {filteredCustomers.length} of {tenantCustomers.length} guests
              </span>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedStageFilter}
                  onChange={(e) => setSelectedStageFilter(e.target.value)}
                  className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">All Stages ({tenantCustomers.length})</option>
                  {(Object.keys(RETENTION_CONFIG) as RetentionClassification[]).map((st) => (
                    <option key={st} value={st}>
                      {st} ({stageCounts[st]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            {filteredCustomers.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No matching guests found
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No records match your selected stage filter or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStageFilter('ALL');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Retention State</th>
                      <th className="py-3 px-4">Visits</th>
                      <th className="py-3 px-4">Last Visit</th>
                      <th className="py-3 px-4">Marketing Consent</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {cust.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            ID: {cust.id} • {cust.echoId}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <RetentionBadge classification={cust.computedClassification} size="sm" />
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {cust.totalVisits} visits
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {cust.lastVisitDaysAgo} days ago
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {cust.marketingConsent.smsOptIn && (
                              <span className="px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                SMS
                              </span>
                            )}
                            {cust.marketingConsent.whatsAppOptIn && (
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                WA
                              </span>
                            )}
                            {cust.marketingConsent.emailOptIn && (
                              <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                Email
                              </span>
                            )}
                            {!cust.marketingConsent.smsOptIn &&
                              !cust.marketingConsent.whatsAppOptIn &&
                              !cust.marketingConsent.emailOptIn && (
                                <span className="text-slate-400 italic">None (Private)</span>
                              )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors cursor-pointer"
                          >
                            Deep Dive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Deep Dive Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {selectedCustomer.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Customer ID: {selectedCustomer.id} • {selectedCustomer.echoId}
                    </p>
                  </div>
                  <RetentionBadge classification={selectedCustomer.computedClassification} />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      Retention Reason:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedCustomer.reason}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 space-y-1">
                    <span className="font-semibold block">Recommended Action:</span>
                    <p className="leading-relaxed">{selectedCustomer.recommendedAction}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Total Visits</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedCustomer.totalVisits}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Loyalty Points</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {selectedCustomer.loyaltyPoints} pts
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Preferences & Notes</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedCustomer.customNotes}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECONNECTION AUTOMATION */}
      {activeTab === 'reconnection' && (
        <div className="space-y-6">
          {/* Header & Campaign Trigger */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Reconnection Campaigns
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated outreach triggered when visit cadence slows down.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingCampaign(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Campaign</span>
            </button>
          </div>

          {/* Quiet Hours & Policy Status Banner */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-900 dark:text-teal-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>
                <strong>Quiet Hours (21:00 – 08:00 Local):</strong> Automated suppression active outside operating hours.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
              Ready to Dispatch
            </span>
          </div>

          {/* Campaign List */}
          <div className="grid gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {camp.channel === 'whatsapp' ? (
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                      ) : camp.channel === 'sms' ? (
                        <Smartphone className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {camp.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Targeting: <RetentionBadge classification={camp.targetStage} size="sm" /> • Channel: <span className="uppercase font-semibold">{camp.channel}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {camp.status.replace('_', ' ')}
                    </span>

                    {camp.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => handleApproveCampaign(camp.id)}
                        className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Manager Approve
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{camp.messageTemplate}"
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-4">
                    <span>Dispatched: <strong className="text-slate-900 dark:text-slate-100">{camp.sentCount}</strong></span>
                    <span>Reactivated Guests: <strong className="text-emerald-600 dark:text-emerald-400">{camp.reactivatedCount}</strong></span>
                    <span>Reactivation Lift: <strong className="text-slate-900 dark:text-slate-100">{camp.sentCount > 0 ? Math.round((camp.reactivatedCount / camp.sentCount) * 100) : 0}%</strong></span>
                  </div>
                  <span>Last Executed: {camp.lastRunDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* New Campaign Modal */}
          {isCreatingCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleCreateCampaignSubmit}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Create Targeted Reconnection Campaign
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCampaign(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="e.g. Autumn Retreat VIP Win-back"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Retention Stage
                    </label>
                    <select
                      value={newCampaignStage}
                      onChange={(e) => setNewCampaignStage(e.target.value as RetentionClassification)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    >
                      <option value="COOLING">COOLING (Past cadence)</option>
                      <option value="AT_RISK">AT_RISK (High urgency)</option>
                      <option value="INACTIVE">INACTIVE (Dormant)</option>
                      <option value="POTENTIALLY_LOST">POTENTIALLY LOST</option>
                      <option value="LOYAL">LOYAL (VIP appreciation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Communication Channel
                    </label>
                    <select
                      value={newCampaignChannel}
                      onChange={(e) => setNewCampaignChannel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    >
                      <option value="whatsapp">WhatsApp Business API</option>
                      <option value="sms">Carrier SMS Gateway</option>
                      <option value="email">Transactional Email</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Template (Tags: <code className="text-teal-600 font-mono">{'{{name}}'}</code>, <code className="text-teal-600 font-mono">{'{{business_name}}'}</code>)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newCampaignTemplate}
                    onChange={(e) => setNewCampaignTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
                  ></textarea>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCampaign(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    Save & Queue for Approval
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WI-FI NETWORK TELEMETRY */}
      {activeTab === 'wifi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Connected Devices</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">122</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+14% vs yesterday</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Authenticated Sessions</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,489</span>
              <span className="text-[11px] text-slate-400 block mt-1">This month</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Captive Portal Conversion</span>
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">92.4%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Accept vs Abandon</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Average Dwell Duration</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">3h 42m</span>
              <span className="text-[11px] text-slate-400 block mt-1">Per authenticated device</span>
            </div>
          </div>

          {/* Access Points Telemetry */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Live Access Point (AP) Controller Telemetry
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">AP-LOBBY-01 (Main Reception)</div>
                    <div className="text-[11px] font-mono text-slate-400">MAC: 44:D9:E7:01:2A:44 • Channel 6 (2.4GHz) / 36 (5GHz)</div>
                  </div>
                </div>
                <div className="text-xs text-right">
                  <span className="font-bold text-slate-900 dark:text-slate-100">48 Active Clients</span>
                  <span className="text-[11px] text-slate-400 block">Bandwidth: 142 GB (24h)</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">AP-POOLSIDE-OUTDOOR (Terrace & Gardens)</div>
                    <div className="text-[11px] font-mono text-slate-400">MAC: 44:D9:E7:01:2A:98 • Channel 11 (2.4GHz) / 149 (5GHz)</div>
                  </div>
                </div>
                <div className="text-xs text-right">
                  <span className="font-bold text-slate-900 dark:text-slate-100">36 Active Clients</span>
                  <span className="text-[11px] text-slate-400 block">Bandwidth: 98 GB (24h)</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">AP-CONF-BALLROOM (Conference Hall)</div>
                    <div className="text-[11px] font-mono text-slate-400">MAC: 44:D9:E7:02:11:F2 • Channel 1 (2.4GHz) / 44 (5GHz)</div>
                  </div>
                </div>
                <div className="text-xs text-right">
                  <span className="font-bold text-slate-900 dark:text-slate-100">38 Active Clients</span>
                  <span className="text-[11px] text-slate-400 block">Bandwidth: 210 GB (24h)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: HARDWARE & RADIUS AAA INTEGRATION */}
      {activeTab === 'hardware' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Hardware Abstraction Layer & Network AAA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrate with your existing network infrastructure (MikroTik, UniFi, Omada) or deploy proprietary ECHO Cloud Gateways.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border-2 border-teal-500 bg-teal-50/20 dark:bg-teal-950/20 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white font-semibold text-[10px]">
                Active Connector
              </span>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                MikroTik RouterOS Hotspot
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Direct integration with RouterOS v6/v7 API. Automated walled garden provisioning and RADIUS authentication.
              </p>
              <div className="pt-2 text-[11px] font-mono text-teal-700 dark:text-teal-300">
                NAS IP: {currentTenant.wifiConfig.nasIp}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                Supported
              </span>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Ubiquiti UniFi Controller
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                External Portal Server integration via UniFi REST API with HMAC token validation.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                Roadmap
              </span>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Proprietary ECHO Gateway
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dedicated plug-and-play Wi-Fi gateway appliance with embedded WireGuard tunnel to ECHO cloud.
              </p>
            </div>
          </div>

          {/* Generated MikroTik Script Preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-teal-600" />
              Generated MikroTik Hotspot Configuration Script
            </span>
            <pre className="p-4 rounded-2xl bg-slate-950 text-teal-400 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`/radius add service=hotspot address=radius.echo-wifi.net secret="echo_radius_${currentTenant.id.toLowerCase()}" authentication-port=1812 accounting-port=1813 timeout=3s
/ip hotspot profile set [find default=yes] login-by=http-chap,http-pap,cookie use-radius=yes radius-accounting=yes
/ip hotspot walled-garden ip add dst-host=portal.echo-wifi.net action=accept
/ip hotspot walled-garden ip add dst-host=api.echo-wifi.net action=accept
# Configuration ready for tenant: ${currentTenant.name}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
