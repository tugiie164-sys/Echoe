import React, { useState, useEffect } from 'react';
import { Navbar, ActiveView } from './components/Navbar';
import { PublicWebsite } from './components/PublicWebsite';
import { CaptivePortal } from './components/CaptivePortal';
import { UniversalCustomerPortal } from './components/UniversalCustomerPortal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { ShieldCheck, Info } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('website');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark mode class on HTML root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Session authenticated notification banner
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const handleSessionAuthenticated = (
    businessId: string,
    guestName: string,
    phone: string,
    marketingOptIn: boolean
  ) => {
    setSessionNotice(
      `Wi-Fi Session Established for ${guestName} (${phone}) at ${businessId}. Dual identity synchronized.`
    );
    setTimeout(() => setSessionNotice(null), 6000);
  };

  // Dismissible environment badge
  const [showEnvBadge, setShowEnvBadge] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Skip to Content for WCAG 2.2 AA Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Primary Header & Role Switcher */}
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Global Prototype Notice Bar (Dismissible & Concise) */}
      {showEnvBadge && (
        <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 py-1.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              <strong>ECHO Prototype Sandbox:</strong> Verified dual-identity engine & offline AAA controllers.
            </span>
          </div>
          <button
            onClick={() => setShowEnvBadge(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 cursor-pointer"
            aria-label="Dismiss prototype notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Auth Toast */}
      {sessionNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{sessionNotice}</span>
            </div>
            <button
              onClick={() => setSessionNotice(null)}
              className="text-teal-700 dark:text-teal-300 font-bold hover:underline cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'website' && <PublicWebsite onNavigate={setActiveView} />}
        {activeView === 'captive' && (
          <CaptivePortal
            onSessionAuthenticated={handleSessionAuthenticated}
            onNavigateToCustomerPortal={() => setActiveView('customer')}
          />
        )}
        {activeView === 'customer' && <UniversalCustomerPortal />}
        {activeView === 'business' && <BusinessDashboard />}
        {activeView === 'admin' && <SuperAdminConsole />}
        {activeView === 'architecture' && <ArchitectureViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">ECHO Platform</span>
            <span>•</span>
            <span>Every Visit Leaves an Echo.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Kenya Data Protection Act, 2019</span>
            <span>•</span>
            <span>GDPR Ready</span>
            <span>•</span>
            <span>RFC 2865/2866 RADIUS AAA</span>
            <span>•</span>
            <span>WCAG 2.2 AA Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
