import { useEffect, useRef } from "react";
import type { AuditStage } from "../types";
import { nextScanStep, startScanStep, type ScanStepState } from "../lib/scanSteps";

const TICK_MS = 250;

interface UseScanStepsOptions {
  /** The screen on show. */
  shown: AuditStage;
  /** How far the server says the audit has got. */
  target: AuditStage;
  /** An audit is in hand and the server has answered at least once. */
  enabled: boolean;
  /** The screen on show has its data drawn. */
  ready: boolean;
  /** The audit finished with no Google listing. */
  websiteOnly: boolean;
  /** Show another screen. */
  onShow: (stage: AuditStage) => void;
}

/**
 * Runs the scan screens (see lib/scanSteps) against the real clock and the
 * tab's visibility, and shows the next screen when it is time.
 */
export function useScanSteps({
  shown,
  target,
  enabled,
  ready,
  websiteOnly,
  onShow,
}: UseScanStepsOptions): void {
  const stateRef = useRef<ScanStepState>(startScanStep(shown));
  const inputsRef = useRef({ target, ready, websiteOnly, onShow });
  inputsRef.current = { target, ready, websiteOnly, onShow };

  // The screen was changed from outside (a retry, a sidebar click): count it from zero.
  if (stateRef.current.shown !== shown) {
    stateRef.current = startScanStep(shown);
  }

  useEffect(() => {
    if (!enabled) return;

    let last = performance.now();
    const step = () => {
      const now = performance.now();
      // A background tab's timers are slowed, so one late tick can carry
      // seconds of hidden time. No tick counts for more than two of itself.
      const elapsed = Math.min(now - last, TICK_MS * 2);
      last = now;

      const inputs = inputsRef.current;
      const before = stateRef.current;
      const after = nextScanStep(before, elapsed, {
        target: inputs.target,
        ready: inputs.ready,
        websiteOnly: inputs.websiteOnly,
        visible: document.visibilityState === "visible",
      });
      stateRef.current = after;
      if (after.shown !== before.shown) inputs.onShow(after.shown);
    };

    step();
    const timer = window.setInterval(step, TICK_MS);
    return () => window.clearInterval(timer);
  }, [enabled]);
}
