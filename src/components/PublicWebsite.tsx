import React, { useState } from 'react';
import { 
  Wifi, 
  ShieldCheck, 
  TrendingUp, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users, 
  Send, 
  Lock, 
  Zap, 
  DollarSign, 
  CreditCard,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PublicWebsiteProps {
  onNavigate: (view: 'captive' | 'customer' | 'business' | 'admin' | 'architecture') => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onNavigate }) => {
  const [currency, setCurrency] = useState<'KSH' | 'USD'>('KSH');
  
  // Interactive ROI Calculator State
  const [monthlyGuests, setMonthlyGuests] = useState(1200);
  const [avgSpend, setAvgSpend] = useState(2500); // KSh
  const [returnRateLift, setReturnRateLift] = useState(15); // % lift

  const estimatedReactivatedGuests = Math.round(monthlyGuests * (returnRateLift / 100));
  const estimatedAnnualRevenueGain = estimatedReactivatedGuests * avgSpend * 12;

  const pricingTiers = [
    {
      name: 'STARTER',
      tagline: 'Ideal for single-location cafés, boutique bistros & specialty bakeries.',
      priceKsh: '2,500',
      priceUsd: '20',
      period: '/month',
      badge: null,
      features: [
        'Single physical venue / branch',
        'Up to 500 active monthly guests',
        'Branded Guest Wi-Fi captive portal',
        'Automated 8-stage retention classification',
        'Kenya DPA 2019 consent compliance',
        'MikroTik & UniFi standard connectors',
      ],
    },
    {
      name: 'GROWTH',
      tagline: 'Designed for high-traffic restaurants, beach clubs & boutique hotels.',
      priceKsh: '5,000',
      priceUsd: '40',
      period: '/month',
      badge: 'POPULAR',
      features: [
        'Up to 3 branches under 1 organization',
        'Up to 2,500 active monthly guests',
        'Automated Reconnection Engine (SMS & Email)',
        'Configurable industry return cadences',
        'Customer loyalty points & visit milestones',
        'Quiet hours enforcement (21:00-08:00)',
        'M-Pesa Daraja payment integration',
      ],
    },
    {
      name: 'PROFESSIONAL',
      tagline: 'Full intelligence suite for luxury resorts, safari lodges & hotel groups.',
      priceKsh: '10,000',
      priceUsd: '80',
      period: '/month',
      badge: 'ENTERPRISE READY',
      features: [
        'Up to 8 branches with centralized management',
        'Up to 10,000 active monthly guests',
        'WhatsApp Business API automated outreach',
        'Deep-dive VIP preference tracking',
        'POS & Property Management System (PMS) sync',
        'Dedicated FreeRADIUS AAA server cluster',
        'Custom captive portal CSS & multi-lingual splash',
      ],
    },
    {
      name: 'ENTERPRISE',
      tagline: 'Multi-property hospitality conglomerates, airports & shopping centers.',
      priceKsh: 'Custom',
      priceUsd: 'Custom',
      period: 'tailored SLA',
      badge: 'UNLIMITED',
      features: [
        'Unlimited branches & global franchises',
        'Custom SLA with 99.99% RADIUS uptime guarantee',
        'Proprietary ECHO Gateway hardware leasing',
        'Dedicated tenant database partition',
        'Custom AI retention models & bespoke reporting',
        'Dedicated 24/7 technical account manager',
      ],
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Intelligence & Retention SaaS</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Every Visit Leaves an <span className="text-teal-400">Echo.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Physical businesses spend millions attracting guests but lose touch the moment they walk out the door. ECHO converts ordinary guest Wi-Fi authentication into sovereign customer identity, automated retention intelligence, and verified repeat visits.
            </p>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('captive')}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-teal-500/20 cursor-pointer"
            >
              <Wifi className="w-4 h-4" />
              <span>Captive Wi-Fi Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('business')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Business Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('architecture')}
              className="px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700/60 transition-colors cursor-pointer"
            >
              <span>Architecture & Specs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">92.4%</div>
              <div className="text-slate-400 text-[11px]">Captive conversion</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-teal-400">8 Stages</div>
              <div className="text-slate-400 text-[11px]">Retention classification</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
              <div className="text-slate-400 text-[11px]">DPA 2019 compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL IDENTITY ARCHITECTURE SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Sovereign Data Protection
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            The ECHO Dual Identity Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Convenient cross-establishment connection for guests, without creating a centralized surveillance state.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Universal Identity Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Universal Sovereign Account (ECHO-XXXXX)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Owned entirely by the customer. Managed independently.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Single verified phone or email for 1-tap connection anywhere</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Master communication kill-switch overrides all businesses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Device MAC registry for seamless auto-reconnect</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Right-to-be-forgotten and full personal data download</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('customer')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Preview Universal Customer Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Business-Specific Identity Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Business-Specific Relationship (GH-001, JC-018)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent relationship maintained strictly with that establishment.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Business A CANNOT see visits or preferences at Business B</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Independent marketing consent granted per establishment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Venue-specific loyalty points, VIP tiers, and table preferences</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Industry-calibrated retention lifecycle (Café vs Hotel)</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('business')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Business CRM Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE RETENTION ROI CALCULATOR */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Business Value Calculator
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Estimate Your Customer Retention Recovery
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See how much revenue your venue recovers by identifying cooling guests and re-engaging them before they become inactive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Unique Monthly Guests on Wi-Fi</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">{monthlyGuests.toLocaleString()} guests</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={monthlyGuests}
                onChange={(e) => setMonthlyGuests(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Average Transaction Value</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">KSh {avgSpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={avgSpend}
                onChange={(e) => setAvgSpend(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Expected Reconnection Lift (% of cooling won back)</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">{returnRateLift}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={returnRateLift}
                onChange={(e) => setReturnRateLift(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Projected Annual Value Recovered
            </span>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400">
                KSh {estimatedAnnualRevenueGain.toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Estimated incremental customer revenue per year
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Won-Back Guests / Month:</span>
                <strong className="text-slate-900 dark:text-slate-100">{estimatedReactivatedGuests} guests</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Monthly Revenue Protected:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">KSh {Math.round(estimatedAnnualRevenueGain / 12).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>ROI on Professional Plan:</span>
                <strong className="text-teal-600 font-bold">
                  {Math.round((estimatedAnnualRevenueGain / 12 / 10000) * 100)}% ROI
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMERCIAL PRICING SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Commercial Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Transparent SaaS Subscription Tiers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports automated recurring M-Pesa Daraja collection and international card billing.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start">
            <button
              onClick={() => setCurrency('KSH')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currency === 'KSH'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Kenyan Shillings (KSh)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              US Dollars ($)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 flex flex-col justify-between border transition-all shadow-xs ${
                tier.badge === 'POPULAR'
                  ? 'bg-white dark:bg-slate-900 border-2 border-teal-500 shadow-teal-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    {tier.name}
                  </h3>
                  {tier.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                    {currency === 'KSH' ? (
                      tier.priceKsh === 'Custom' ? 'Custom' : `KSh ${tier.priceKsh}`
                    ) : (
                      tier.priceUsd === 'Custom' ? 'Custom' : `$${tier.priceUsd}`
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{tier.period}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {tier.tagline}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('business')}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    tier.badge === 'POPULAR'
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Select {tier.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
