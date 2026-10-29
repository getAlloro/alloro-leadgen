/**
 * Where the website screenshot "browses" to next on the website scan step.
 *
 * The scan step shows a full-page screenshot inside the monitor. While the step runs, the picture glides to a
 * spot, pauses, and glides to another, like someone skimming the page. A stop is a fraction of the scrollable
 * height: 0 = the top, 1 = the bottom. Pure functions, so the choices can be tested; `rand` defaults to Math.random.
 */

/** Every fourth move goes back to the top, the way people check the header again. */
const BACK_TO_TOP_EVERY = 4;
/** A move travels at least this far, so the page visibly moves rather than twitching. */
const MIN_JUMP = 0.2;

export function nextBrowseStop(current: number, move: number, rand: () => number = Math.random): number {
  if (move > 0 && move % BACK_TO_TOP_EVERY === 0) return 0;
  for (let i = 0; i < 8; i++) {
    const stop = Math.round(rand() * 100) / 100;
    if (Math.abs(stop - current) >= MIN_JUMP) return stop;
  }
  return current < 0.5 ? 0.85 : 0.15;
}

/** Seconds a move takes: longer for longer distances, between 0.9s and 2.6s. */
export function browseDuration(from: number, to: number, scrollablePx: number): number {
  const px = Math.abs(to - from) * scrollablePx;
  return Math.min(2.6, Math.max(0.9, px / 900));
}

/** Seconds to rest on a spot before the next move: 0.6s to 1.5s. */
export function browsePause(rand: () => number = Math.random): number {
  return 0.6 + rand() * 0.9;
}
