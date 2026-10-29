/**
 * Where the website screenshot "browses" to next on the website scan step.
 *
 * The scan step shows a full-page screenshot inside the monitor. While the step runs, the picture moves up or
 * down by a small, medium or large jump, each taking a random time, then pauses, like someone skimming the page.
 * A stop is a fraction of the scrollable height: 0 = the top, 1 = the bottom. Pure functions, so the choices can
 * be tested; `rand` defaults to Math.random.
 */

/** Every fourth move goes back to the top, the way people check the header again. */
const BACK_TO_TOP_EVERY = 4;

/** Jump sizes, as a share of the scrollable height. One is picked at random for each move. */
export const JUMPS = {
  small: [0.04, 0.12],
  medium: [0.15, 0.35],
  large: [0.4, 0.8],
} as const;

const SIZES = Object.keys(JUMPS) as (keyof typeof JUMPS)[];

export function nextBrowseStop(current: number, move: number, rand: () => number = Math.random): number {
  if (move > 0 && move % BACK_TO_TOP_EVERY === 0 && current > 0) return 0;
  const [lo, hi] = JUMPS[SIZES[Math.min(SIZES.length - 1, Math.floor(rand() * SIZES.length))]];
  const jump = lo + rand() * (hi - lo);
  const dir = rand() < 0.5 ? -1 : 1;
  // Up or down at random; if that runs off the page, go the other way; if both do, go to the far end.
  let stop = current + dir * jump;
  if (stop < 0 || stop > 1) stop = current - dir * jump;
  if (stop < 0 || stop > 1) stop = current < 0.5 ? 1 : 0;
  return Math.round(stop * 1000) / 1000;
}

/** Seconds a move takes: random, 0.8s to 2.6s, whatever the distance. */
export function browseDuration(rand: () => number = Math.random): number {
  return 0.8 + rand() * 1.8;
}

/** Seconds to rest on a spot before the next move: 0.6s to 1.5s. */
export function browsePause(rand: () => number = Math.random): number {
  return 0.6 + rand() * 0.9;
}
