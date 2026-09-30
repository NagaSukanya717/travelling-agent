/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripPlannerForm } from './components/TripPlannerForm';
import { DestinationsGrid } from './components/DestinationsGrid';
import { SampleItineraryViewer } from './components/SampleItineraryViewer';
import { AgentWorkflowSection } from './components/AgentWorkflowSection';
import { SuccessModal } from './components/SuccessModal';
import { SubmissionsDrawer } from './components/SubmissionsDrawer';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';

import { CURATED_DESTINATIONS } from './data/destinations';
import { TripFormData, SubmissionResult, AgentStatus, DestinationPreset } from './types/travel';

const DEFAULT_N8N_URL = 'https://student-2628.app.n8n.cloud/form/751f3faf-fec6-4519-ae5e-0aa4c9a0b018';
const STORAGE_KEY_SUBMISSIONS = 'voyageiq_submissions';
const STORAGE_KEY_URL = 'voyageiq_n8n_url';

export default function App() {
  const [activeN8nUrl, setActiveN8nUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_N8N_URL;
  });

  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    destination: '',
    travelDate: '',
    returnDate: '',
    travelers: '2',
    budget: '$3,500',
    email: '',
    notes: '',
    tripStyle: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<SubmissionResult | null>(null);

  // Submissions history
  const [submissions, setSubmissions] = useState<SubmissionResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI Drawers / Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Agent Health Status
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'checking',
    endpoint: activeN8nUrl,
  });

  // Check n8n agent health on mount
  const checkAgentHealth = async (urlToCheck?: string) => {
    const target = urlToCheck || activeN8nUrl;
    setAgentStatus({ status: 'checking', endpoint: target });
    try {
      const res = await fetch(`/api/agent-status?url=${encodeURIComponent(target)}`);
      const data = await res.json();
      setAgentStatus({
        status: data.status,
        statusCode: data.statusCode,
        latencyMs: data.latencyMs,
        endpoint: target,
        lastChecked: data.lastChecked,
      });
    } catch (err: any) {
      setAgentStatus({
        status: 'offline',
        endpoint: target,
        error: err.message,
      });
    }
  };

  useEffect(() => {
    checkAgentHealth();
  }, [activeN8nUrl]);

  // Handle trip submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const res = await fetch('/api/submit-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customN8nUrl: activeN8nUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch to n8n travelling agent.');
      }

      const result: SubmissionResult = {
        success: true,
        submissionId: data.submissionId,
        timestamp: data.timestamp,
        durationMs: data.durationMs,
        endpoint: data.endpoint,
        n8nRawResponse: data.n8nRawResponse,
        message: data.message,
        tripSummary: data.tripSummary,
      };

      setLastSubmissionResult(result);

      // Save to local storage
      const updated = [result, ...submissions];
      setSubmissions(updated);
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
    } catch (err: any) {
      setSubmissionError(err.message || 'Error communicating with n8n travelling agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (preset: DestinationPreset) => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(today.getDate() + 30);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + preset.suggestedDays);

    setFormData((prev) => ({
      ...prev,
      startLocation: prev.startLocation || preset.startLocationDefault,
      destination: `${preset.title}, ${preset.country}`,
      travelDate: dep.toISOString().split('T')[0],
      returnDate: ret.toISOString().split('T')[0],
      budget: preset.typicalBudget,
      tripStyle: preset.vibe,
      notes: `Interested in: ${preset.highlights.join(', ')}`,
    }));

    // Scroll to planner form
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUseDestinationFromSample = (destName: string, days: number, budget: string) => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(today.getDate() + 25);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + days);

    setFormData((prev) => ({
      ...prev,
      destination: destName,
      travelDate: dep.toISOString().split('T')[0],
      returnDate: ret.toISOString().split('T')[0],
      budget: budget || prev.budget,
    }));

    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveN8nUrl = (newUrl: string) => {
    const validUrl = newUrl.trim() || DEFAULT_N8N_URL;
    setActiveN8nUrl(validUrl);
    localStorage.setItem(STORAGE_KEY_URL, validUrl);
    checkAgentHealth(validUrl);
  };

  const handleClearHistory = () => {
    setSubmissions([]);
    localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
  };

  const handleLoadSubmission = (sub: SubmissionResult) => {
    setFormData({
      startLocation: sub.tripSummary.startLocation,
      destination: sub.tripSummary.destination,
      travelDate: sub.tripSummary.travelDate,
      returnDate: sub.tripSummary.returnDate,
      travelers: sub.tripSummary.travelers,
      budget: sub.tripSummary.budget,
      email: sub.tripSummary.email,
      notes: sub.tripSummary.notes || '',
    });
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-custom">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        submissionsCount={submissions.length}
        agentStatus={agentStatus}
        onRefreshStatus={() => checkAgentHealth()}
      />

      <main className="flex-1">
        <Hero onSelectQuickTrip={handleSelectPreset} destinations={CURATED_DESTINATIONS} />

        <TripPlannerForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={submissionError}
          activeN8nUrl={activeN8nUrl}
        />

        <DestinationsGrid onSelectDestination={handleSelectPreset} />

        <SampleItineraryViewer onUseDestination={handleUseDestinationFromSample} />

        <AgentWorkflowSection n8nUrl={activeN8nUrl} />
      </main>

      <Footer n8nUrl={activeN8nUrl} />

      {/* Modals & Drawers */}
      <SuccessModal
        result={lastSubmissionResult}
        onClose={() => setLastSubmissionResult(null)}
        onPlanAnother={() => {
          setLastSubmissionResult(null);
          const el = document.getElementById('planner');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <SubmissionsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        submissions={submissions}
        onClearHistory={handleClearHistory}
        onLoadSubmission={handleLoadSubmission}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={activeN8nUrl}
        onSaveUrl={handleSaveN8nUrl}
        agentStatus={agentStatus}
        onTestConnection={() => checkAgentHealth(activeN8nUrl)}
      />
    </div>
  );
}
