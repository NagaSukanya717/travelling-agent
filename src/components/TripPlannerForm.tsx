import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Mail,
  Send,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Code,
  Sliders,
  Plane,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { TripFormData, SubmissionResult, DestinationPreset } from '../types/travel';

interface TripPlannerFormProps {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  activeN8nUrl: string;
}

const ORIGIN_HUBS = [
  'New York (JFK)',
  'San Francisco (SFO)',
  'London (LHR)',
  'Paris (CDG)',
  'Tokyo (HND)',
  'Dubai (DXB)',
  'Singapore (SIN)',
  'Mumbai (BOM)',
];

const BUDGET_PRESETS = [
  { label: 'Backpacker / Nomad', amount: '$1,200', desc: 'Hostels, public transit, street food' },
  { label: 'Comfortable Explorer', amount: '$3,200', desc: 'Boutique hotels, mid-tier dining, key tours' },
  { label: 'Luxury & Curated', amount: '$6,500', desc: '5-star resorts, private transfers, fine dining' },
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  error,
  activeN8nUrl,
}) => {
  const [viewMode, setViewMode] = useState<'smart' | 'n8n_raw'>('smart');
  const [currency, setCurrency] = useState<string>('USD');

  // Calculate duration between travelDate and returnDate
  const getDurationText = () => {
    if (!formData.travelDate || !formData.returnDate) return null;
    const start = new Date(formData.travelDate);
    const end = new Date(formData.returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Invalid dates (return must be after departure)';
    return `${diffDays} days / ${diffDays - 1} nights`;
  };

  const handleQuickDuration = (days: number) => {
    const today = formData.travelDate ? new Date(formData.travelDate) : new Date();
    if (!formData.travelDate) {
      // Set start date to tomorrow if empty
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startStr = tomorrow.toISOString().split('T')[0];
      const returnDate = new Date(tomorrow);
      returnDate.setDate(returnDate.getDate() + days);
      const endStr = returnDate.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, travelDate: startStr, returnDate: endStr }));
    } else {
      const returnDate = new Date(today);
      returnDate.setDate(returnDate.getDate() + days);
      const endStr = returnDate.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, returnDate: endStr }));
    }
  };

  const handleFillSample = () => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(today.getDate() + 21);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + 9);

    setFormData({
      startLocation: 'San Francisco (SFO)',
      destination: 'Tokyo & Kyoto, Japan',
      travelDate: dep.toISOString().split('T')[0],
      returnDate: ret.toISOString().split('T')[0],
      travelers: '2',
      budget: '$3,800',
      email: 'traveler@example.com',
      notes: 'Boutique ryokans, food markets, Shinkansen experience, photography',
      tripStyle: 'Culture & Gastronomy',
    });
  };

  return (
    <section id="planner" className="py-16 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
            <Plane className="w-3.5 h-3.5" />
            <span>Interactive Dispatch Station</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>n8n Webhook Connected</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Commission Your Travelling Agent
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Complete the trip parameters below. Your criteria will be transmitted directly to the n8n
            automation workflow to initiate autonomous destination intelligence.
          </p>

          {/* View mode toggle & fast test */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('smart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'smart'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Smart Station
              </button>
              <button
                type="button"
                onClick={() => setViewMode('n8n_raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'n8n_raw'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                n8n Schema Inspector (field-0 to 6)
              </button>
            </div>

            <button
              type="button"
              onClick={handleFillSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Sample Data
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Submission failed</p>
                <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {viewMode === 'smart' ? (
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Row 1: Start Location & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Location (field-0) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-0" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Departure City / Airport <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-0</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      id="field-0"
                      name="startLocation"
                      type="text"
                      required
                      placeholder="e.g. San Francisco (SFO) or London"
                      value={formData.startLocation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startLocation: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                  {/* Origin Hub Presets */}
                  <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-500 mr-1">Popular hubs:</span>
                    {ORIGIN_HUBS.slice(0, 4).map((hub) => (
                      <button
                        key={hub}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, startLocation: hub }))}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {hub.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination (field-1) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-1" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Dream Destination <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-1</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Compass className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      id="field-1"
                      name="destination"
                      type="text"
                      required
                      placeholder="e.g. Tokyo & Kyoto, Amalfi Coast, or Reykjavik"
                      value={formData.destination}
                      onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-slate-500 mr-1">Ideas:</span>
                    {['Tokyo', 'Amalfi Coast', 'Swiss Alps', 'Bali', 'Paris'].map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, destination: dest }))}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Travel Dates (field-2 & field-3) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                {/* Departure Date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-2" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Departure Date <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-2</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      id="field-2"
                      name="travelDate"
                      type="date"
                      required
                      value={formData.travelDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, travelDate: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors scheme-dark"
                    />
                  </div>
                </div>

                {/* Return Date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-3" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Return Date <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-3</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      id="field-3"
                      name="returnDate"
                      type="date"
                      required
                      value={formData.returnDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors scheme-dark"
                    />
                  </div>
                </div>

                {/* Duration calculation banner */}
                <div className="md:col-span-2 pt-1 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Calculated duration:</span>
                    <span className="text-amber-300 font-semibold font-mono">
                      {getDurationText() || 'Select dates to compute'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Quick duration:</span>
                    {[5, 7, 10, 14].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => handleQuickDuration(days)}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        +{days}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Travelers count (field-4) & Budget (field-5) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Travelers (field-4) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-4" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      No. of People Travelling <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-4</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Users className="w-4 h-4 text-amber-400" />
                      </div>
                      <input
                        id="field-4"
                        name="travelers"
                        type="number"
                        min="1"
                        max="30"
                        required
                        placeholder="e.g. 2"
                        value={formData.travelers}
                        onChange={(e) => setFormData((prev) => ({ ...prev, travelers: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                  {/* Category helper buttons */}
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {[
                      { label: 'Solo (1)', val: '1' },
                      { label: 'Couple (2)', val: '2' },
                      { label: 'Family (4)', val: '4' },
                      { label: 'Group (6+)', val: '6' },
                    ].map((cat) => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, travelers: cat.val }))}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                          formData.travelers === cat.val
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget (field-5) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-5" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Total Estimated Budget <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">n8n: field-5</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      id="field-5"
                      name="budget"
                      type="text"
                      required
                      placeholder="e.g. $3,500 or €4,000"
                      value={formData.budget}
                      onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                  {/* Budget Presets */}
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {BUDGET_PRESETS.map((preset) => (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, budget: preset.amount }))}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                          formData.budget === preset.amount
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                        title={preset.desc}
                      >
                        {preset.amount} ({preset.label.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Email Address (field-6) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="field-6" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Traveler Email Address <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">n8n: field-6</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    id="field-6"
                    name="email"
                    type="email"
                    required
                    placeholder="Where should the Travelling Agent send the completed itinerary?"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  The n8n Travelling Agent workflow uses this address to dispatch the comprehensive travel brief.
                </p>
              </div>

              {/* Optional Travel Notes & Style */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Travel Preferences & Interests <span className="text-slate-500 text-[10px] lowercase">(appended to agent dossier)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Optional</span>
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder="e.g. Scenic train routes, vegetarian cuisine, historic architecture, quiet boutique stays"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting to n8n Travelling Agent...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-slate-950" />
                      <span>Submit to Travelling Agent Workflow</span>
                      <ArrowRight className="w-5 h-5 text-slate-950" />
                    </>
                  )}
                </button>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Target Webhook:</span>
                  <code className="text-amber-400 font-mono text-[11px]">
                    student-2628.app.n8n.cloud/form/...
                  </code>
                </div>
              </div>
            </form>
          ) : (
            /* Raw Schema Mode */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    n8n Form Field Mapping Specification
                  </span>
                  <span className="text-xs font-mono text-slate-400">Schema ID: 751f3faf</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This form translates your parameters into standard multipart/form-data matching the exact n8n
                  node specification found at the target URL:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Field Name</th>
                        <th className="p-2.5">n8n Form Label</th>
                        <th className="p-2.5">Current Value</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-0</td>
                        <td className="p-2.5">start location</td>
                        <td className="p-2.5 text-slate-200">{formData.startLocation || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-1</td>
                        <td className="p-2.5">Destination</td>
                        <td className="p-2.5 text-slate-200">{formData.destination || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-2</td>
                        <td className="p-2.5">travel date</td>
                        <td className="p-2.5 text-slate-200">{formData.travelDate || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-3</td>
                        <td className="p-2.5">return date</td>
                        <td className="p-2.5 text-slate-200">{formData.returnDate || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-4</td>
                        <td className="p-2.5">no of people travelling</td>
                        <td className="p-2.5 text-slate-200">{formData.travelers || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-5</td>
                        <td className="p-2.5">budget</td>
                        <td className="p-2.5 text-slate-200">{formData.budget || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">field-6</td>
                        <td className="p-2.5">Email</td>
                        <td className="p-2.5 text-slate-200">{formData.email || '(empty)'}</td>
                        <td className="p-2.5 text-emerald-400">Required (Email)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw JSON Payload Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2">Live Outgoing Payload Preview:</span>
                <pre className="text-xs font-mono text-amber-300/90 overflow-x-auto p-3 bg-slate-900 rounded-lg">
                  {JSON.stringify(
                    {
                      targetUrl: activeN8nUrl,
                      method: 'POST',
                      contentType: 'multipart/form-data',
                      fields: {
                        'field-0': formData.startLocation,
                        'field-1': formData.destination,
                        'field-2': formData.travelDate,
                        'field-3': formData.returnDate,
                        'field-4': formData.travelers,
                        'field-5': formData.budget + (formData.notes ? ` [${formData.notes}]` : ''),
                        'field-6': formData.email,
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('smart')}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
                >
                  Return to Smart Form
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting...' : 'Dispatch Raw Payload'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
