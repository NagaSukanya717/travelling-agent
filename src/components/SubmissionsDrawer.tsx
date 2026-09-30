import React from 'react';
import { X, History, Trash2, ArrowUpRight, Compass, Calendar, Users, DollarSign, Mail } from 'lucide-react';
import { SubmissionResult } from '../types/travel';

interface SubmissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: SubmissionResult[];
  onClearHistory: () => void;
  onLoadSubmission: (sub: SubmissionResult) => void;
}

export const SubmissionsDrawer: React.FC<SubmissionsDrawerProps> = ({
  isOpen,
  onClose,
  submissions,
  onClearHistory,
  onLoadSubmission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Travel Requests</h3>
                <p className="text-xs text-slate-400">Stored locally in your browser</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <Compass className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-medium">No trip requests submitted yet.</p>
                <p className="text-xs text-slate-500">
                  Use the planner form to dispatch your first Travelling Agent workflow!
                </p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold block">
                        {sub.submissionId}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {sub.tripSummary.startLocation} → {sub.tripSummary.destination}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{sub.tripSummary.travelDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{sub.tripSummary.travelers} traveler(s)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-amber-300 font-semibold">{sub.tripSummary.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{sub.tripSummary.email}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Dispatched ({sub.durationMs}ms)
                    </span>
                    <button
                      onClick={() => {
                        onLoadSubmission(sub);
                        onClose();
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      Load into Form <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {submissions.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <button
                onClick={onClearHistory}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Submission History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
