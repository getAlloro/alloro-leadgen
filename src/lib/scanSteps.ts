import type { AuditStage } from "../types";

/**
 * Which scan screen the visitor sees, and when it moves on.
 *
 * The server says how far the audit has got (its progress number). This file
 * decides which screen is shown. The two are kept apart on purpose:
 *
 *   - The server checks the website and the Google listing at the same time.
 *     When the listing finishes first, its progress goes from "website"
 *     straight to "competitors" in a few milliseconds. The page only asks for
 *     progress every 2.5 seconds, so it never sees the listing step. Following
 *     the server directly is what skipped the Google listing screen.
 *   - So the screens are shown in one fixed order and none is jumped over.
 *     The listing screen stays at least 5 seconds with the listing drawn; the
 *     competitor map stays at least 4.5 seconds. The website screen keeps its
 *     old timing: it moves on as soon as the server has.
 *   - Only time with the tab on screen counts. An animation playing behind
 *     another tab is seen by nobody.
 *   - A screen still waiting for its data STUCK_MS after the server moved past
 *     it is left, so nobody is held on a loading screen.
 *
 * No React here: `nextScanStep` is a pure step, tested with a stand-in clock
 * in scanSteps.test.ts.
 */

/** The scan screens, in the order a visitor sees them. */
export const SCAN_ORDER: readonly AuditStage[] = [
  "scanning_website",
  "analyzing_gbp",
  "competitor_map",
  "dashboard",
];

/** The least time each screen stays, in milliseconds with the tab on screen and its data drawn. */
export const MIN_VISIBLE_MS: Partial<Record<AuditStage, number>> = {
  scanning_website: 0,
  analyzing_gbp: 5000,
  competitor_map: 4500,
};

/** A screen still without its data this long after the server moved past it is left. */
export const STUCK_MS = 20000;

export interface ScanStepState {
  /** The screen on show. */
  shown: AuditStage;
  /** Time on this screen with the tab on screen and the data drawn. */
  seenMs: number;
  /** Time on this screen with the tab on screen since the server moved past it. */
  behindMs: number;
}

export interface ScanStepInputs {
  /** How far the server says the audit has got. */
  target: AuditStage;
  /** The tab is on screen. */
  visible: boolean;
  /** The screen on show has its data drawn. */
  ready: boolean;
  /** The audit finished with no Google listing: there is no listing or map to show. */
  websiteOnly: boolean;
}

export function startScanStep(shown: AuditStage): ScanStepState {
  return { shown, seenMs: 0, behindMs: 0 };
}

const placeOf = (stage: AuditStage): number => SCAN_ORDER.indexOf(stage);

/**
 * One step: `elapsedMs` of clock time went by on the screen on show.
 * Returns the same object when nothing changed.
 */
export function nextScanStep(
  state: ScanStepState,
  elapsedMs: number,
  inputs: ScanStepInputs,
): ScanStepState {
  const { target, visible, ready, websiteOnly } = inputs;
  if (target === "input") return state;

  // An audit with no Google listing has only the website part: straight to the report.
  if (websiteOnly) {
    return state.shown === "dashboard" ? state : startScanStep("dashboard");
  }

  // Not on a scan screen yet (a report or running audit opened from its link):
  // start where the server is. The scan screens are for an audit started here.
  if (placeOf(state.shown) < 0) return startScanStep(target);

  // The report is the end.
  if (state.shown === "dashboard") return state;

  // The server went back (the audit was started again): go back with it.
  if (placeOf(target) < placeOf(state.shown)) return startScanStep(target);

  if (!visible || elapsedMs <= 0) return state;

  const isBehind = placeOf(target) > placeOf(state.shown);
  const next: ScanStepState = {
    shown: state.shown,
    seenMs: state.seenMs + (ready ? elapsedMs : 0),
    behindMs: state.behindMs + (isBehind ? elapsedMs : 0),
  };
  if (!isBehind) return next;

  const isSeen = next.seenMs >= (MIN_VISIBLE_MS[state.shown] ?? 0);
  const isStuck = next.behindMs >= STUCK_MS;
  if (!isSeen && !isStuck) return next;

  // One screen forward, never more.
  return startScanStep(SCAN_ORDER[placeOf(state.shown) + 1]);
}
