import React from 'react';
import { Compass, ArrowRight, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { CURATED_DESTINATIONS } from '../data/destinations';
import { DestinationPreset } from '../types/travel';

interface DestinationsGridProps {
  onSelectDestination: (preset: DestinationPreset) => void;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({ onSelectDestination }) => {
  return (
    <section id="destinations" className="py-16 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Travel Escapes</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>1-Click Form Dispatch</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Pre-Engineered Destinations
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Choose from high-affinity global destinations calibrated for optimal travel seasons,
              curated stays, and experiential depth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Image banner */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-amber-300">
                  {dest.typicalBudget}
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
                    {dest.country}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{dest.title}</h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{dest.tagline}</p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Signature Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300">
                    {dest.highlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => onSelectDestination(dest)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 group-hover:bg-amber-500 text-slate-200 group-hover:text-slate-950 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700/80 group-hover:border-transparent transition-all"
                >
                  <span>Select & Dispatch Agent</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
