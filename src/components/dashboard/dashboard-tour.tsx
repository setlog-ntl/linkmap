'use client';

import { useEffect, useState, useCallback } from 'react';
import { TourTooltip } from '@/components/tour';
import { useUIStore } from '@/stores/ui-store';
import { dashboardTourSteps } from '@/data/ui/tour-steps';

const SEEN_KEY = 'linkmap-tour-dashboard-seen';

export function DashboardTour() {
  const { tourEnabled } = useUIStore();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const startTour = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const closeTour = useCallback(() => {
    setActive(false);
    localStorage.setItem(SEEN_KEY, 'true');
  }, []);

  // Auto-start on first visit
  useEffect(() => {
    if (!tourEnabled) return;
    if (localStorage.getItem(SEEN_KEY)) return;
    // Delay to let the page render
    const t = window.setTimeout(startTour, 600);
    return () => window.clearTimeout(t);
  }, [tourEnabled, startTour]);

  // Re-start on header button click
  useEffect(() => {
    const handler = () => {
      if (tourEnabled) startTour();
    };
    window.addEventListener('linkmap:tour:restart', handler);
    return () => window.removeEventListener('linkmap:tour:restart', handler);
  }, [tourEnabled, startTour]);

  // Stop when tourEnabled turns off
  useEffect(() => {
    if (!tourEnabled) setActive(false);
  }, [tourEnabled]);

  if (!active || !tourEnabled) return null;

  return (
    <TourTooltip
      steps={dashboardTourSteps}
      currentStep={step}
      onNext={() => setStep((s) => Math.min(s + 1, dashboardTourSteps.length - 1))}
      onPrev={() => setStep((s) => Math.max(s - 1, 0))}
      onClose={closeTour}
    />
  );
}
