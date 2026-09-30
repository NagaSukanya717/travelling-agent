import React, { useState } from 'react';
import {
  GitFork,
  ArrowRight,
  Database,
  Cpu,
  Mail,
  CheckCircle,
  ExternalLink,
  Code,
  Copy,
  Check,
  Globe,
  Terminal,
} from 'lucide-react';

interface AgentWorkflowSectionProps {
  n8nUrl: string;
}

export const AgentWorkflowSection: React.FC<AgentWorkflowSectionProps> = ({ n8nUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(n8nUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCommand = `curl -X POST "${n8nUrl}" \\
  -F "field-0=New York (JFK)" \\
  -F "field-1=Tokyo, Japan" \\
  -F "field-2=2026-10-10" \\
  -F "field-3=2026-10-20" \\
  -F "field-4=2" \\
  -F "field-5=$3,500" \\
  -F "field-6=traveler@example.com"`;

  return (
    <section id="workflow" className="py-20 relative border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
            <GitFork className="w-3.5 h-3.5" />
            <span>Workflow Architecture</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>n8n Cloud Automation</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How n8n Powers the Travelling Agent
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Every submission triggers an autonomous automation graph hosted on n8n Cloud. Here is how your
            inputs journey from form submission to inbox delivery.
          </p>
        </div>

        {/* 4 Pipeline Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'n8n Form Trigger',
              node: 'Webhook Node',
              desc: 'Listens for multipart/form-data with fields 0-6. Validates parameters and triggers execution.',
              icon: Database,
              color: 'text-amber-400',
              bg: 'bg-amber-400/10',
            },
            {
              step: '02',
              title: 'Travel Intelligence',
              node: 'LLM Agent Node',
              desc: 'Autonomous agent models optimal routes, flight timing, weather trends, and neighborhood hubs.',
              icon: Cpu,
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
            },
            {
              step: '03',
              title: 'Itinerary Synthesis',
              node: 'Data Transform Node',
              desc: 'Structures day-by-day morning/afternoon/evening slots and calculates exact budget breakdown.',
              icon: GitFork,
              color: 'text-purple-400',
              bg: 'bg-purple-400/10',
            },
            {
              step: '04',
              title: 'Email Dispatch',
              node: 'Send Email Node',
              desc: 'Compiles formatted dossier and transmits straight to the traveler email provided in field-6.',
              icon: Mail,
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
            },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-display font-bold text-slate-600">{s.step}</span>
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                    {s.node}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Endpoint Box & cURL testing */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                Connected n8n Endpoint
              </span>
              <p className="text-sm font-mono text-slate-200 break-all">{n8nUrl}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
              </button>
              <a
                href={n8nUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Original Form</span>
              </a>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Direct cURL Dispatch Command
            </span>
            <pre className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-amber-300/80 overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
