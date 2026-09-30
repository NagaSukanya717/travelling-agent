import React from 'react';
import { Compass, ExternalLink, Shield, Heart } from 'lucide-react';

interface FooterProps {
  n8nUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ n8nUrl }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Compass className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-display text-base font-bold text-white tracking-tight">
                Voyage<span className="text-amber-400">IQ</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                n8n Travelling Agent
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Autonomous travel planning interface engineered on top of the n8n Cloud automation workflow{' '}
              <code className="text-amber-300 font-mono text-[11px]">student-2628.app.n8n.cloud</code>.
            </p>
          </div>

          {/* n8n Webhook References */}
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-3">
              Automation Specs
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="text-slate-300">Trigger:</span> Form Webhook Node
              </li>
              <li>
                <span className="text-slate-300">Schema:</span> 7 Fields (0-6)
              </li>
              <li>
                <span className="text-slate-300">Payload:</span> multipart/form-data
              </li>
              <li>
                <a
                  href={n8nUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  n8n Form Link <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-3">
              Navigation
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#planner" className="hover:text-amber-300 transition-colors">
                  Commission Agent
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-300 transition-colors">
                  Curated Escapes
                </a>
              </li>
              <li>
                <a href="#sample-dossier" className="hover:text-amber-300 transition-colors">
                  Agent Sample Dossier
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-amber-300 transition-colors">
                  Pipeline Architecture
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} VoyageIQ. Powered by n8n Cloud Automation.</p>
          <div className="flex items-center gap-2">
            <span>Built for autonomous travel intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Zero-pill design discipline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
