import React, { useState } from 'react';
import { X, Settings, RefreshCw, CheckCircle2, AlertCircle, Globe, Link2, ExternalLink } from 'lucide-react';
import { AgentStatus } from '../types/travel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (newUrl: string) => void;
  agentStatus: AgentStatus;
  onTestConnection: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  agentStatus,
  onTestConnection,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    await onTestConnection();
    setIsTesting(false);
  };

  const handleSave = () => {
    onSaveUrl(urlInput.trim());
    onClose();
  };

  const handleResetDefault = () => {
    const defaultUrl = 'https://student-2628.app.n8n.cloud/form/751f3faf-fec6-4519-ae5e-0aa4c9a0b018';
    setUrlInput(defaultUrl);
    onSaveUrl(defaultUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">n8n Agent Integration</h3>
            <p className="text-xs text-slate-400">Manage workflow URL & webhook connectivity</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Target n8n Form Webhook URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://...app.n8n.cloud/form/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-amber-400 hover:underline"
              >
                Reset to Default student-2628 URL
              </button>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Connection Status Box */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Endpoint Health Status</span>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {agentStatus.status === 'online' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Online (HTTP {agentStatus.statusCode || 200})
                  </span>
                ) : agentStatus.status === 'checking' ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking...
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {agentStatus.status}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
              <div>
                <span>Ping Latency:</span>{' '}
                <span className="text-slate-200 font-semibold">{agentStatus.latencyMs ?? '—'} ms</span>
              </div>
              <div>
                <span>Last Verified:</span>{' '}
                <span className="text-slate-200">
                  {agentStatus.lastChecked
                    ? new Date(agentStatus.lastChecked).toLocaleTimeString()
                    : 'Just now'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTest}
              disabled={isTesting}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Connectivity...' : 'Ping n8n Endpoint Now'}</span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
