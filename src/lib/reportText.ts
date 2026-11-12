/**
 * Small text rules for the free-check report.
 */

/**
 * Google review text can carry HTML line breaks (`<br>`), which React prints
 * as literal text. Turn breaks into spaces, drop any other tag, and decode the
 * few entities that come with them. React still escapes the result, so this
 * never renders HTML.
 */
export function cleanReviewText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export interface GapCandidate {
  /** Name the visitor reads, e.g. "Trust & Engagement". */
  label: string;
  /** 0–100. Null or NaN means we could not check it, so it is skipped. */
  score: number | null;
}

/**
 * The single biggest gap: the lowest score we actually measured. Ties keep the
 * first one given, so callers list the most important area first. Returns
 * null when nothing was measured.
 */
export function biggestGap(candidates: GapCandidate[]): GapCandidate | null {
  let worst: GapCandidate | null = null;
  for (const c of candidates) {
    if (c.score === null || !Number.isFinite(c.score)) continue;
    if (worst === null || c.score < (worst.score as number)) worst = c;
  }
  return worst;
}
