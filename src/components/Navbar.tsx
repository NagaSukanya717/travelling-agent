import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Settings, ExternalLink, History } from 'lucide-react';
import { AgentStatus } from '../types/travel';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  submissionsCount: number;
  agentStatus: AgentStatus;
  onRefreshStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenHistory,
  submissionsCount,
  agentStatus,
  onRefreshStatus,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-white tracking-tight">
                  Voyage<span className="text-amber-400">IQ</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                  n8n Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Travel Intelligence</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a
              href="#planner"
              className="hover:text-amber-300 transition-colors"
            >
              Plan Trip
            </a>
            <a
              href="#destinations"
              className="hover:text-amber-300 transition-colors"
            >
              Curated Destinations
            </a>
            <a
              href="#sample-dossier"
              className="hover:text-amber-300 transition-colors"
            >
              Agent Itinerary
            </a>
            <a
              href="#workflow"
              className="hover:text-amber-300 transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Live n8n Agent status */}
            <button
              onClick={onRefreshStatus}
              title="Click to re-ping n8n Travelling Agent"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-colors"
            >
              {agentStatus.status === 'checking' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : agentStatus.status === 'online' ? (
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="hidden sm:inline font-mono text-[11px] text-slate-300">
                {agentStatus.status === 'checking'
                  ? 'Pinging n8n...'
                  : agentStatus.status === 'online'
                  ? `n8n Agent Online (${agentStatus.latencyMs ?? 120}ms)`
                  : 'Agent Endpoint Offline'}
              </span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="View your submitted travel requests"
            >
              <History className="w-4 h-4" />
              {submissionsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {submissionsCount}
                </span>
              )}
            </button>

            {/* Settings / Webhook button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Inspect n8n webhook settings & payload"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* CTA button */}
            <a
              href="#planner"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-all shadow-md shadow-amber-500/10 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              Launch Agent
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
