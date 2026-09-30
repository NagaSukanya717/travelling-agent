import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Utensils,
  Lightbulb,
  DollarSign,
  MapPin,
  ChevronRight,
  Sparkles,
  Plane,
  Building,
  Coffee,
} from 'lucide-react';
import { SAMPLE_ITINERARIES } from '../data/destinations';
import { SampleItinerary } from '../types/travel';

interface SampleItineraryViewerProps {
  onUseDestination: (destinationName: string, days: number, budget: string) => void;
}

export const SampleItineraryViewer: React.FC<SampleItineraryViewerProps> = ({ onUseDestination }) => {
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(SAMPLE_ITINERARIES[0].id);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const activeItinerary =
    SAMPLE_ITINERARIES.find((it) => it.id === selectedItineraryId) || SAMPLE_ITINERARIES[0];
  const activeDay = activeItinerary.days[activeDayIndex] || activeItinerary.days[0];

  return (
    <section id="sample-dossier" className="py-16 relative scroll-mt-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agent Output Preview</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Sample Synthesized Briefs</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What the Travelling Agent Delivers
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Inspect an interactive sample dossier synthesized by the n8n Travelling Agent workflow,
              complete with timed experiences, culinary gems, and budget allocation models.
            </p>
          </div>

          {/* Destination Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {SAMPLE_ITINERARIES.map((it) => (
              <button
                key={it.id}
                onClick={() => {
                  setSelectedItineraryId(it.id);
                  setActiveDayIndex(0);
                }}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                  selectedItineraryId === it.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {it.destination.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Itinerary Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary Overview & Budget Chart */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl">
              <div className="relative h-48">
                <img
                  src={activeItinerary.heroImage}
                  alt={activeItinerary.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest block font-bold">
                    Agent Dossier
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">{activeItinerary.destination}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 italic">{activeItinerary.tagline}</p>

                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Duration:</span>
                    <span className="text-white font-semibold">{activeItinerary.daysCount} Days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Target:</span>
                    <span className="text-amber-400 font-semibold font-mono">
                      {activeItinerary.estimatedBudget}
                    </span>
                  </div>
                </div>

                {/* Budget Allocation Breakdown */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Autonomous Budget Breakdown
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Plane className="w-3.5 h-3.5 text-blue-400" /> Flights & Transit
                      </span>
                      <span className="font-mono text-slate-200">{activeItinerary.budgetBreakdown.flights}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full"
                        style={{ width: `${activeItinerary.budgetBreakdown.flights}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Building className="w-3.5 h-3.5 text-amber-400" /> Stays & Lodging
                      </span>
                      <span className="font-mono text-slate-200">
                        {activeItinerary.budgetBreakdown.accommodation}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full"
                        style={{ width: `${activeItinerary.budgetBreakdown.accommodation}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Coffee className="w-3.5 h-3.5 text-emerald-400" /> Dining & Gastronomy
                      </span>
                      <span className="font-mono text-slate-200">{activeItinerary.budgetBreakdown.dining}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full"
                        style={{ width: `${activeItinerary.budgetBreakdown.dining}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Button to load this itinerary into the form */}
                <button
                  onClick={() =>
                    onUseDestination(
                      activeItinerary.destination,
                      activeItinerary.daysCount,
                      activeItinerary.estimatedBudget.split(' ')[0]
                    )
                  }
                  className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Customize This Route in Form
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Schedule Tabs & Activities */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {/* Day Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800">
              {activeItinerary.days.map((day, idx) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    activeDayIndex === idx
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="mt-6 space-y-6">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  Day {activeDay.day} Schedule
                </span>
                <h4 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {activeDay.title}
                </h4>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                {/* Morning */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Morning (08:00 – 12:00)
                  </div>
                  <p className="text-sm text-slate-200 pl-4">{activeDay.morning}</p>
                </div>

                {/* Afternoon */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Afternoon (12:30 – 17:30)
                  </div>
                  <p className="text-sm text-slate-200 pl-4">{activeDay.afternoon}</p>
                </div>

                {/* Evening */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Evening (18:00 – Late)
                  </div>
                  <p className="text-sm text-slate-200 pl-4">{activeDay.evening}</p>
                </div>
              </div>

              {/* Bottom Cards: Dining Pick & Agent Pro-Tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                    <Utensils className="w-3.5 h-3.5" />
                    Curated Dining Pick
                  </div>
                  <p className="text-xs text-slate-300">{activeDay.diningPick}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Agent Pro-Tip
                  </div>
                  <p className="text-xs text-slate-300">{activeDay.proTip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
