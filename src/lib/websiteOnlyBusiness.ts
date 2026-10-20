import type { AuditStatusResponse, BusinessProfile } from "../types";

/**
 * A finished audit whose business has no Google Maps listing. The backend
 * completes it with website results only: no listing, no competitors and no
 * Google analysis. The report must show the website part and say plainly that
 * no listing was found — never fill the gaps with sample data.
 */
export function isWebsiteOnlyAudit(
  audit: AuditStatusResponse | null | undefined,
): boolean {
  return (
    !!audit &&
    audit.status === "completed" &&
    !audit.self_gbp &&
    !audit.gbp_analysis
  );
}

/** Strips a "Name, Full Address" search string down to the name. */
function nameFromSearchString(search: string | null | undefined): string {
  const name = (search ?? "").split(",")[0]?.trim() ?? "";
  return name;
}

/**
 * The business card for a website-only report. Every field the Google
 * listing would have filled stays empty, so nothing on the page is invented.
 */
export function websiteOnlyBusiness(opts: {
  searchString?: string | null;
  fallbackName?: string | null;
  website?: string | null;
}): BusinessProfile {
  const name =
    nameFromSearchString(opts.searchString) ||
    (opts.fallbackName ?? "").trim() ||
    "Your business";
  return {
    title: name,
    price: null,
    categoryName: "Not on Google Maps",
    address: "",
    neighborhood: null,
    street: "",
    city: "",
    postalCode: "",
    state: "",
    countryCode: "",
    phone: "",
    phoneUnformatted: "",
    website: opts.website ?? "",
    claimThisBusiness: false,
    totalScore: 0,
    permanentlyClosed: false,
    temporarilyClosed: false,
    placeId: "",
    reviewsCount: 0,
    reviewsDistribution: {
      oneStar: 0,
      twoStar: 0,
      threeStar: 0,
      fourStar: 0,
      fiveStar: 0,
    },
    imagesCount: 0,
    imageCategories: [],
    imageUrl: "",
    imageUrls: [],
    location: { lat: 0, lng: 0 },
    plusCode: "",
    fid: "",
    cid: "",
    categories: [],
    openingHours: [],
    reviews: [],
    reviewsTags: [],
    additionalInfo: {} as BusinessProfile["additionalInfo"],
    peopleAlsoSearch: [],
    ownerUpdates: [],
    bookingLinks: [],
    url: "",
    searchPageUrl: "",
    searchString: opts.searchString ?? "",
    language: "en",
    rank: 0,
    isAdvertisement: false,
    kgmid: "",
  };
}
