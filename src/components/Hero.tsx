import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Mail, Compass, Globe } from 'lucide-react';
import { DestinationPreset } from '../types/travel';

interface HeroProps {
  onSelectQuickTrip: (preset: DestinationPreset) => void;
  destinations: DestinationPreset[];
}

export const Hero: React.FC<HeroProps> = ({ onSelectQuickTrip, destinations }) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet text kicker with typographic separator (no pills) */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wider uppercase">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                n8n Cloud Automation
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Workflow student-2628</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Autonomous Travel Agent</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              The Travelling Agent.{' '}
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                Engineered for bespoke journeys.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Eliminate hours of manual research across dozens of travel tabs. Submit your departure,
              dates, and budget — our autonomous n8n Travelling Agent workflow synthesizes flight options,
              boutique stays, and daily bespoke itineraries delivered directly to your inbox.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#planner"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-xl shadow-amber-500/15 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                Dispatch Your Travel Agent
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>

              <a
                href="#sample-dossier"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-sm font-semibold transition-all"
              >
                Inspect Sample Dossier
              </a>
            </div>

            {/* Zero-Pill Unboxed Key Metrics */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200 font-semibold">Sub-second webhook</span>
                <span className="text-slate-500">at n8n cloud</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200 font-semibold">Automated delivery</span>
                <span className="text-slate-500">to traveler email</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-semibold">Direct POST schema</span>
                <span className="text-slate-500">field-0 to field-6</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Trip Inspiration Card Deck */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer decorative card frame */}
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Popular Agent Presets</h3>
                    <p className="text-xs text-slate-400">Click to autofill the travel form instantly</p>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                    Live Form Sync
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {destinations.slice(0, 4).map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => onSelectQuickTrip(dest)}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/60 hover:border-amber-500/40 transition-all group flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.image}
                          alt={dest.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700/60 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {dest.title}
                            </span>
                            <span className="text-xs text-slate-400">· {dest.country}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{dest.tagline}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono text-amber-400 font-semibold">{dest.typicalBudget}</div>
                        <div className="text-[11px] text-slate-500">{dest.suggestedDays} days</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    n8n Webhook: <code className="text-amber-400 font-mono">751f3faf...</code>
                  </span>
                  <a
                    href="#planner"
                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 group"
                  >
                    Custom Route <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
