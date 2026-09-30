export interface TripFormData {
  startLocation: string;
  destination: string;
  travelDate: string;
  returnDate: string;
  travelers: string;
  budget: string;
  email: string;
  notes?: string;
  tripStyle?: string;
  customN8nUrl?: string;
}

export interface SubmissionResult {
  success: boolean;
  submissionId: string;
  timestamp: string;
  durationMs: number;
  endpoint: string;
  n8nRawResponse?: any;
  message: string;
  tripSummary: {
    startLocation: string;
    destination: string;
    travelDate: string;
    returnDate: string;
    travelers: string;
    budget: string;
    email: string;
    notes?: string;
  };
}

export interface AgentStatus {
  status: 'online' | 'degraded' | 'offline' | 'checking';
  statusCode?: number;
  latencyMs?: number;
  endpoint: string;
  lastChecked?: string;
  error?: string;
}

export interface DestinationPreset {
  id: string;
  title: string;
  country: string;
  tagline: string;
  image: string;
  startLocationDefault: string;
  suggestedDays: number;
  typicalBudget: string;
  vibe: string;
  highlights: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  diningPick: string;
  proTip: string;
}

export interface SampleItinerary {
  id: string;
  destination: string;
  tagline: string;
  daysCount: number;
  estimatedBudget: string;
  heroImage: string;
  days: ItineraryDay[];
  budgetBreakdown: {
    flights: number;
    accommodation: number;
    dining: number;
    activities: number;
  };
}
