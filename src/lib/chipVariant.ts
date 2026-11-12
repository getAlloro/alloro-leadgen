/**
 * Treatment 1: two versions of the three chips under the search box.
 *
 * A is today's chips. B is the challenger. Until the challenger's lines arrive,
 * B repeats A word for word, so both groups see the same screen and the
 * recorded split is clean from day one. Put only final page copy here.
 */
export type ChipVariant = "A" | "B";

export type ChipIcon = "sparkles" | "zap" | "users";

export interface Chip {
  icon: ChipIcon;
  text: string;
}

const CHIPS_A: Chip[] = [
  { icon: "sparkles", text: "Deep AI Analysis" },
  { icon: "zap", text: "Live Market Scan" },
  { icon: "users", text: "Beat Local Competitors" },
];

// Challenger lines go here. Same as A until they are written.
const CHIPS_B: Chip[] = CHIPS_A.map((c) => ({ ...c }));

export const CHIPS: Record<ChipVariant, Chip[]> = { A: CHIPS_A, B: CHIPS_B };

export function isChipVariant(value: unknown): value is ChipVariant {
  return value === "A" || value === "B";
}

/** 50/50. `random` returns a number in [0, 1), like Math.random. */
export function pickChipVariant(random: () => number = Math.random): ChipVariant {
  return random() < 0.5 ? "A" : "B";
}
