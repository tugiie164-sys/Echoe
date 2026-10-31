import React from 'react';
import { 
  Wifi, 
  Building2, 
  User, 
  ShieldAlert, 
  BookOpen, 
  Sun, 
  Moon, 
  Globe,
  Radio
} from 'lucide-react';

export type ActiveView = 'website' | 'captive' | 'customer' | 'business' | 'admin' | 'architecture';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'captive', label: 'Captive Wi-Fi', icon: Wifi },
    { id: 'customer', label: 'Universal ID', icon: User },
    { id: 'business', label: 'Business CRM', icon: Building2 },
    { id: 'admin', label: 'Super Admin', icon: ShieldAlert },
    { id: 'architecture', label: 'Architecture Specs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <button
            onClick={() => onNavigate('website')}
            className="flex items-center gap-3 text-left group cursor-pointer"
            aria-label="ECHO Home"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-teal-500 text-teal-400 dark:text-slate-950 flex items-center justify-center font-black text-lg shadow-md transition-transform group-hover:scale-105">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 dark:text-slate-100 text-base tracking-wider">
                  ECHO
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                  SaaS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none font-medium">
                Every Visit Leaves an Echo.
              </span>
            </div>
          </button>

          {/* Prototype View Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Dark Mode & Prototype Status */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Prototype
            </span>

            {/* Dark Mode Accessible Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Drawer */}
        <div className="lg:hidden py-2 border-t border-slate-100 dark:border-slate-800 flex overflow-x-auto gap-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
