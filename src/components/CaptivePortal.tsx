import React, { useState } from 'react';
import { MOCK_TENANTS, BusinessTenant } from '../data/mockData';
import { 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Zap, 
  Lock, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface CaptivePortalProps {
  onSessionAuthenticated?: (businessId: string, guestName: string, phone: string, marketingOptIn: boolean) => void;
  onNavigateToCustomerPortal?: () => void;
}

export const CaptivePortal: React.FC<CaptivePortalProps> = ({
  onSessionAuthenticated,
  onNavigateToCustomerPortal,
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>(MOCK_TENANTS[0].id);
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  
  // Captive Portal State Machine: 'SPLASH' | 'AUTH' | 'OTP' | 'SUCCESS'
  const [portalStep, setPortalStep] = useState<'SPLASH' | 'AUTH' | 'OTP' | 'SUCCESS'>('SPLASH');
  
  // Auth Form
  const [authMode, setAuthMode] = useState<'universal' | 'new_guest'>('universal');
  const [identifier, setIdentifier] = useState('+254712345678');
  const [guestName, setGuestName] = useState('James Ndung’u');
  const [roomNumber, setRoomNumber] = useState('Suite 402');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const tenant = MOCK_TENANTS.find(t => t.id === selectedTenantId) || MOCK_TENANTS[0];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setAuthError('You must review and accept the Guest Wi-Fi Terms of Use to proceed.');
      return;
    }
    setAuthError('');
    setOtpSent(true);
    setPortalStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '4928' && otpCode.length < 4) {
      setAuthError('Please enter a valid 4-digit verification code (Demo Code: 4928).');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPortalStep('SUCCESS');
      if (onSessionAuthenticated) {
        onSessionAuthenticated(
          tenant.id,
          authMode === 'universal' ? 'James Ndung’u' : guestName,
          identifier,
          marketingConsent
        );
      }
    }, 600);
  };

  const handleReset = () => {
    setPortalStep('SPLASH');
    setOtpCode('');
    setOtpSent(false);
    setAuthError('');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Captive Portal Sandbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Network redirection and RADIUS AAA authentication preview.
            </p>
          </div>
        </div>

        {/* Establishment Switcher & Device Frame Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="establishment-select" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Venue:
            </label>
            <select
              id="establishment-select"
              value={selectedTenantId}
              onChange={(e) => {
                setSelectedTenantId(e.target.value);
                handleReset();
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {MOCK_TENANTS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.industryLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Viewport Frame Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                deviceFrame === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Smartphone View (390px)"
              aria-label="Smartphone View (390px)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                deviceFrame === 'tablet'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Tablet View (640px)"
              aria-label="Tablet View (640px)"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                deviceFrame === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Desktop View"
              aria-label="Desktop View"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Simulator Meta Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-mono flex flex-wrap items-center justify-between gap-3 border border-slate-800 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SSID: <strong className="text-white">{tenant.wifiConfig.ssid}</strong></span>
          <span className="text-slate-600">|</span>
          <span>NAS-IP: {tenant.wifiConfig.nasIp}</span>
          <span className="text-slate-600">|</span>
          <span>Gateway: {tenant.wifiConfig.gatewayType}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Bandwidth Cap: {tenant.wifiConfig.downloadSpeedMbps} Mbps DL / {tenant.wifiConfig.uploadSpeedMbps} Mbps UL</span>
          <button
            onClick={handleReset}
            className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2"
          >
            Restart Flow
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center py-4 bg-slate-100/60 dark:bg-slate-950/40 rounded-3xl p-4 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrame === 'mobile'
              ? 'max-w-md'
              : deviceFrame === 'tablet'
              ? 'max-w-2xl'
              : 'max-w-4xl'
          }`}
        >
          {/* Captive Portal Device Shell */}
          <div className="bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            {/* Top Device Bar */}
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-slate-300 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-teal-400" />
                Captive Network Assistant
              </span>
              <span className="text-slate-400">portal.echo-wifi.net</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
            </div>

            {/* Portal Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Co-Branded Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label="Establishment Logo">
                    {tenant.logo}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      {tenant.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Complimentary High-Speed Guest Wi-Fi
                    </p>
                  </div>
                </div>

                {/* ECHO Verified Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ECHO Secure</span>
                </div>
              </div>

              {/* STEP 1: SPLASH SCREEN */}
              {portalStep === 'SPLASH' && (
                <div className="space-y-6 text-center py-4">
                  <div className="inline-flex p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                    <Wifi className="w-10 h-10" />
                  </div>

                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Welcome to {tenant.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      High-speed guest Wi-Fi access.
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-3 gap-3 text-left py-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Speed Tier</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Up to {tenant.wifiConfig.downloadSpeedMbps} Mbps</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Session</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{tenant.wifiConfig.sessionTimeoutMins / 60}h Auto-renew</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1" />
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Zero Spam</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Kenya DPA 2019</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPortalStep('AUTH')}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    <span>Connect to Wi-Fi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: AUTHENTICATION FORM */}
              {portalStep === 'AUTH' && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAuthMode('universal')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        authMode === 'universal'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Universal ECHO ID (Fast)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('new_guest')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        authMode === 'new_guest'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      New Guest Register
                    </button>
                  </div>

                  {authMode === 'universal' ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-300 leading-relaxed">
                        ✨ Enter mobile number or email for instant recognition across participating venues.
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number or Email
                        </label>
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="+254 7XX XXX XXX or guest@domain.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                          Pre-filled demo identifier: James Ndung’u (+254712345678)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Jane Wanjiku"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Mobile Number (for SMS Verification OTP)
                        </label>
                        <input
                          type="tel"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="+254 7XX XXX XXX"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Room / Table / Seat (Optional)
                        </label>
                        <input
                          type="text"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          placeholder="e.g. Room 304 or Table 12"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* UNBUNDLED CONSENT ARCHITECTURE (CRITICAL PRIVACY SPECIFICATION) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {/* Mandatory Wi-Fi Terms */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500"
                      />
                      <span>
                        <strong className="text-slate-900 dark:text-slate-100">Required:</strong> I accept the{' '}
                        <span className="text-teal-600 dark:text-teal-400 underline">Guest Wi-Fi Terms & Privacy Notice</span>.
                      </span>
                    </label>

                    {/* Optional Business-Specific Marketing Consent */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                            Optional: Keep me updated with {tenant.name} privileges
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-normal">
                            Receive personalized booking perks, dining offers, and loyalty rewards via SMS/WhatsApp. You can revoke this at any time in your ECHO profile.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {authError}
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setPortalStep('SPLASH')}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <span>Request Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: OTP VERIFICATION */}
              {portalStep === 'OTP' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5 text-center py-2">
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Enter Verification Code
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      A 4-digit code was sent to <strong className="text-slate-900 dark:text-slate-100">{identifier}</strong>
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto space-y-3">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • •"
                      className="w-full tracking-widest text-center text-2xl font-mono py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />

                    {/* Quick Demo Autofill Helper */}
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setOtpCode('4928')}
                        className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                      >
                        ⚡ Demo Auto-fill (4928)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setAuthError('');
                        }}
                        className="text-slate-500 dark:text-slate-400 hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {authError}
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setPortalStep('AUTH')}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Change Number
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer disabled:opacity-60"
                    >
                      {isVerifying ? (
                        <span>Authorizing with RADIUS AAA...</span>
                      ) : (
                        <>
                          <span>Verify & Connect</span>
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: ACCESS GRANTED / SUCCESS */}
              {portalStep === 'SUCCESS' && (
                <div className="space-y-6 text-center py-4">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Internet Access Authorized!
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                      Welcome, <strong className="text-slate-900 dark:text-slate-100">{authMode === 'universal' ? 'James Ndung’u' : guestName}</strong>. You are now connected to the high-speed network at {tenant.name}.
                    </p>
                  </div>

                  {/* RADIUS AAA Handshake Telemetry card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>RADIUS Status:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Access-Accept (RFC 2865)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Session Lease:</span>
                      <span className="text-slate-900 dark:text-slate-100">4 Hours (Auto-Renewable)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>ECHO Customer ID:</span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">GH-001 (Universal: ECHO-10001)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Marketing Opt-In:</span>
                      <span className={marketingConsent ? 'text-teal-600 font-semibold' : 'text-slate-500'}>
                        {marketingConsent ? 'Granted (SMS/WhatsApp)' : 'Declined (Respecting Privacy)'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={onNavigateToCustomerPortal}
                      className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Manage Your Sovereign ECHO Identity</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleReset}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:underline"
                    >
                      Disconnect & Test Another Flow
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
