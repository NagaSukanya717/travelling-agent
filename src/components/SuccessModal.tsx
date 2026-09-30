import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Plane,
  Mail,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Download,
  ExternalLink,
  X,
  Clock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { SubmissionResult } from '../types/travel';

interface SuccessModalProps {
  result: SubmissionResult | null;
  onClose: () => void;
  onPlanAnother: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ result, onClose, onPlanAnother }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (!result) return;
    // Animate the progression through the n8n agent workflow
    setActiveStep(1);
    const t1 = setTimeout(() => setActiveStep(2), 700);
    const t2 = setTimeout(() => setActiveStep(3), 1600);
    const t3 = setTimeout(() => setActiveStep(4), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [result]);

  if (!result) return null;

  const downloadSummary = () => {
    const text = `VOYAGEIQ - TRAVELLING AGENT DOSSIER
==============================================
Submission ID: ${result.submissionId}
Timestamp: ${result.timestamp}
Target Webhook: ${result.endpoint}

TRIP SPECIFICATIONS:
- Origin: ${result.tripSummary.startLocation}
- Destination: ${result.tripSummary.destination}
- Departure: ${result.tripSummary.travelDate}
- Return: ${result.tripSummary.returnDate}
- Party Size: ${result.tripSummary.travelers} traveler(s)
- Allocated Budget: ${result.tripSummary.budget}
- Delivery Email: ${result.tripSummary.email}
- Special Notes: ${result.tripSummary.notes || 'None specified'}

N8N AGENT STATUS:
Dispatched successfully (Duration: ${result.durationMs}ms)
Status: Active autonomous synthesis in progress.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoyageIQ-Trip-${result.submissionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ID: {result.submissionId}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Travelling Agent Dispatched!
          </h3>
          <p className="text-slate-300 text-sm mt-2 max-w-lg">
            Your journey request has been received by the n8n automation engine at{' '}
            <span className="font-mono text-amber-400 font-semibold">student-2628.app.n8n.cloud</span>.
          </p>
        </div>

        {/* Live Autonomous Pipeline Steps */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
            n8n Automation Execution Pipeline
          </span>

          <div className="space-y-3.5">
            {[
              {
                step: 1,
                title: 'Parameters Received & Parsed',
                desc: 'Validated coordinates, dates, and party size.',
              },
              {
                step: 2,
                title: 'Autonomous Travel Intelligence',
                desc: 'Matching optimal flight windows & curated boutique stays.',
              },
              {
                step: 3,
                title: 'Itinerary Synthesis & Budget Allocation',
                desc: 'Structuring daily activities, culinary spots, and insider advice.',
              },
              {
                step: 4,
                title: `Dispatching Dossier to ${result.tripSummary.email}`,
                desc: 'Check your email inbox shortly for the full itinerary brief.',
              },
            ].map((s) => {
              const isDone = activeStep > s.step;
              const isCurrent = activeStep === s.step;
              return (
                <div key={s.step} className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : s.step}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xs font-semibold ${
                        isDone ? 'text-slate-200' : isCurrent ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dispatched Parameters Summary */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
            Dispatched Request Summary
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">ROUTE</span>
              <span className="font-semibold text-white">
                {result.tripSummary.startLocation} → {result.tripSummary.destination}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DATES</span>
              <span className="font-semibold text-white">
                {result.tripSummary.travelDate} to {result.tripSummary.returnDate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">TRAVELERS</span>
              <span className="font-semibold text-white">{result.tripSummary.travelers} traveler(s)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">BUDGET</span>
              <span className="font-semibold text-amber-400">{result.tripSummary.budget}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">RECIPIENT INBOX</span>
              <span className="font-semibold text-white truncate block">{result.tripSummary.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DISPATCH LATENCY</span>
              <span className="font-mono text-emerald-400 font-semibold">{result.durationMs}ms</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={downloadSummary}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Download Request Dossier (.txt)
          </button>

          <button
            onClick={() => {
              onClose();
              onPlanAnother();
            }}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            Plan Another Trip
          </button>
        </div>
      </div>
    </div>
  );
};
