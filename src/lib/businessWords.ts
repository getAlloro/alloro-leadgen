/**
 * Words that fit the visitor's kind of business.
 *
 * The free check runs for dentists, restaurants, plumbers and everyone else,
 * so no screen may hard-code one industry's words. The kind is read from the
 * Google category the report header already shows (`business.categoryName`).
 * Anything we cannot place gets the general words, never the dental ones.
 */
export type BusinessKind = "health" | "food" | "trades" | "general";

const HEALTH = [
  // Not a bare "dent": it sits inside "residential" and "student".
  "dental", "dentist", "orthodont", "endodont", "periodont", "oral surg", "doctor",
  "physician", "clinic", "medical", "health", "chiropract", "physiother",
  "physical therap", "therapist", "optometr", "ophthalm", "dermatolog",
  "pediatric", "veterinar", "animal hospital", "hospital", "urgent care",
  "podiatr", "audiolog", "psycholog", "counsel",
];

const FOOD = [
  "restaurant", "cafe", "café", "coffee", "bakery", "bar", "pub", "pizza",
  "food", "grill", "diner", "bistro", "taco", "burger", "sushi", "catering",
  "brewery", "brew", "tea", "ice cream", "deli", "kitchen", "eatery",
  "steak", "barbecue", "bbq", "noodle", "ramen", "sandwich", "donut",
  "dessert", "winery", "juice", "taqueria", "pho",
];

const TRADES = [
  "plumb", "electric", "roof", "hvac", "heating", "air condition", "contractor",
  "landscap", "lawn", "cleaning", "cleaner", "painter", "painting", "handyman",
  "construction", "remodel", "pest", "garage door", "locksmith", "moving",
  "mover", "carpet", "floor", "fence", "pool", "tree service", "auto repair",
  "mechanic", "auto body", "towing", "window", "gutter", "solar", "concrete",
  "masonry", "septic", "pressure wash", "junk", "welding", "carpent", "drywall",
  "insulation", "restoration", "builder",
];

function matches(category: string, words: string[]): boolean {
  return words.some((w) => {
    // "bar" and "pub" are short; match them as whole words so "barber" and
    // "public" do not read as food.
    if (w.length <= 3) return new RegExp(`\\b${w}\\b`).test(category);
    return category.includes(w);
  });
}

export function businessKind(category?: string | null): BusinessKind {
  const c = (category ?? "").toLowerCase().trim();
  if (!c) return "general";
  if (matches(c, HEALTH)) return "health";
  if (matches(c, FOOD)) return "food";
  if (matches(c, TRADES)) return "trades";
  return "general";
}

/**
 * The sample dashboard is a picture of the product. It uses an invented
 * business so no real customer appears on a stranger's report, and the
 * invented business is the same kind as the visitor's.
 */
export interface SampleBusiness {
  personName: string;
  businessName: string;
  locationName: string;
  cityLabel: string;
}

const SAMPLE_BY_KIND: Record<BusinessKind, SampleBusiness> = {
  health: {
    personName: "Dr. Rivera",
    businessName: "Maple Street Clinic",
    locationName: "Springfield",
    cityLabel: "Springfield",
  },
  food: {
    personName: "Sam",
    businessName: "Maple Street Kitchen",
    locationName: "Springfield",
    cityLabel: "Springfield",
  },
  trades: {
    personName: "Alex",
    businessName: "Maple Street Home Services",
    locationName: "Springfield",
    cityLabel: "Springfield",
  },
  general: {
    personName: "Alex",
    businessName: "Maple Street Co.",
    locationName: "Springfield",
    cityLabel: "Springfield",
  },
};

export function sampleBusiness(kind: BusinessKind): SampleBusiness {
  return SAMPLE_BY_KIND[kind];
}

/** What more customers look like for this kind of business. */
const MORE_CUSTOMERS_BY_KIND: Record<BusinessKind, string> = {
  health: "More new patients reaching out, every month",
  food: "More new guests finding you, every month",
  trades: "More people asking for a quote, every month",
  general: "More new customers reaching out, every month",
};

export function moreCustomersLine(kind: BusinessKind): string {
  return MORE_CUSTOMERS_BY_KIND[kind];
}

/**
 * The website analysis returns the pillar key "Patient Journey" for every
 * business. The key is fixed on the server (a renderer matches on it), so the
 * words are chosen here. Keep using the raw key for lookups; use this only for
 * what the visitor reads.
 */
export function pillarDisplayName(key: string, kind: BusinessKind): string {
  if (key === "Patient Journey" && kind !== "health") return "Customer Journey";
  return key;
}
