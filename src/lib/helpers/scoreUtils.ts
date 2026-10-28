/**
 * Score utility functions and color mappings
 */

/**
 * Parse score values that might be string or number
 */
export const parseScoreValue = (
  value: string | number | undefined
): number => {
  if (typeof value === "number") return Math.round(value);
  if (typeof value === "string") return Math.round(parseFloat(value));
  return 0;
};

/**
 * A pillar we could not read data for. It has no score and must never be
 * shown as 0%. Older reports carry no flag and count as checked.
 */
export const isPillarUnchecked = (pillar: {
  checked?: boolean;
  score: string | number | null;
}): boolean =>
  pillar.checked === false || pillar.score === null || pillar.score === undefined;

/**
 * Get color based on score threshold (green >= 90, yellow >= 70, red < 70)
 */
export const getColorFromScore = (
  score: number
): "green" | "yellow" | "red" => {
  if (score >= 90) return "green";
  if (score >= 70) return "yellow";
  return "red";
};

/**
 * Color class mappings for Tailwind
 */
export const colorClasses = {
  brand: "text-brand-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
  blue: "text-blue-500",
} as const;

export const bgColorClasses = {
  brand: "text-brand-100",
  green: "text-green-100",
  yellow: "text-yellow-100",
  red: "text-red-100",
  blue: "text-blue-100",
} as const;

export const glowClasses = {
  brand: "drop-shadow-[0_0_12px_rgba(214,104,83,0.6)]",
  green: "drop-shadow-[0_0_12px_rgba(79,138,91,0.6)]",
  yellow: "drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]",
  red: "drop-shadow-[0_0_12px_rgba(204,74,61,0.6)]",
  blue: "drop-shadow-[0_0_12px_rgba(23,22,21,0.6)]",
} as const;
