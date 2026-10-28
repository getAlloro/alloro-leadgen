import React, { memo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Star,
  Globe,
} from "lucide-react";
import { BusinessProfile, ReviewsDistribution } from "../../types";
import { trackEvent, setCurrentStage } from "../../lib/tracking";

/** Reviews drawn on a phone, where the stage must fit one screen. */
const REVIEWS_ON_PHONE = 3;
/** Reviews drawn on a wider screen, where the column runs to the bottom. */
const REVIEWS_ON_DESKTOP = 8;

const STAR_KEYS: { stars: number; key: keyof ReviewsDistribution }[] = [
  { stars: 5, key: "fiveStar" },
  { stars: 4, key: "fourStar" },
  { stars: 3, key: "threeStar" },
  { stars: 2, key: "twoStar" },
  { stars: 1, key: "oneStar" },
];

/**
 * How many reviews the profile has at each star, with each bar's width as a
 * share of the longest one. Empty when the profile carries no breakdown.
 */
function ratingBreakdown(distribution: ReviewsDistribution | undefined) {
  if (!distribution) return [];
  const rows = STAR_KEYS.map(({ stars, key }) => ({
    stars,
    count: Number(distribution[key]) || 0,
  }));
  const most = Math.max(...rows.map((row) => row.count));
  if (most <= 0) return [];
  return rows.map((row) => ({ ...row, share: (row.count / most) * 100 }));
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
      {children}
    </span>
    <div className="h-px flex-1 bg-gray-200" />
  </div>
);

/**
 * GBP Analysis Stage — single-page view combining the profile card and the
 * top reviews. Previously a 3-page carousel (Profile → Reviews → Photos);
 * collapsed to one page so the entire stage IS this single panel.
 *
 * ⛔ On md+ the two cards run the full height of the stage. The green scan
 * line sweeps the whole stage, and the cards used to stop at their own
 * height (about 355px), so on a tall screen the line spent half its sweep
 * over empty page. The extra height is filled with facts the profile
 * already holds (rating breakdown, opening hours, more reviews), each shown
 * only where the screen is tall enough for it. Phones keep the compact
 * stacked layout that fits one screen.
 *
 * Memoized for performance.
 */
const STAGE_DISPLAY_MS = 5000;

export const GBPAnalysisStage = memo(
  ({
    data,
    isLoading = false,
    onCarouselComplete,
  }: {
    data: BusinessProfile | null;
    isLoading?: boolean;
    onCarouselComplete?: () => void;
  }) => {
    const onCompleteRef = React.useRef(onCarouselComplete);
    onCompleteRef.current = onCarouselComplete;
    const completedRef = React.useRef(false);

    // Fire stage_viewed_2 once on mount (GBP analysis screen)
    useEffect(() => {
      setCurrentStage("stage_viewed_2");
      trackEvent("stage_viewed_2");
    }, []);

    // Fire completion callback once data has rendered for STAGE_DISPLAY_MS.
    // Replaces the old 3-page carousel timing. (Kept from main: the step timing is not part of the UI polish.)
    useEffect(() => {
      if (isLoading || !data || completedRef.current) return;
      const timer = setTimeout(() => {
        completedRef.current = true;
        onCompleteRef.current?.();
      }, STAGE_DISPLAY_MS);
      return () => clearTimeout(timer);
    }, [isLoading, data]);

    const breakdown = ratingBreakdown(data?.reviewsDistribution);
    const hours = (data?.openingHours ?? []).filter(
      (entry) => entry && entry.day && entry.hours,
    );
    const photoCount = Number(data?.imagesCount) || 0;
    const reviews = data?.reviews ?? [];
    const hasReviews = reviews.length > 0;

    return (
      <div className="h-full flex flex-col items-center justify-start md:justify-center p-3 md:p-6 bg-beige overflow-hidden">
        <div className="mb-3 md:mb-6 text-center shrink-0">
          <h2 className="text-lg md:text-3xl font-bold text-gray-900 tracking-tight">
            {isLoading || !data
              ? "Finding Your Google Listing"
              : "Google Business Profile"}
          </h2>
          <div className="inline-flex items-center gap-2 mt-2 md:mt-4 px-3 md:px-4 py-1 bg-brand-50 rounded-full border border-brand-100">
            <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
            <p className="text-brand-600 text-xs md:text-sm font-semibold">
              {isLoading || !data
                ? "Looking up your business on Google Maps..."
                : "Analyzing profile + sentiment"}
            </p>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto relative flex-1 min-h-0 flex flex-col">
          {/* Green horizontal scanning line */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent z-30 pointer-events-none"
            style={{
              boxShadow: "0 0 20px 2px rgba(79,138,91,0.5)",
              animation: "gbpScanVertical 1.5s linear infinite",
            }}
          />

          {isLoading || !data ? (
            <GBPLoadingSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="space-y-3 md:space-y-0 md:flex-1 md:min-h-0 md:grid md:grid-cols-[1.2fr_1fr] md:grid-rows-[minmax(0,1fr)] md:gap-5 lg:gap-8"
            >
              {/* Profile Card — stacks on mobile, a full-height grid column on md+ */}
              <div
                className={`bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-200 flex flex-col md:flex-row relative md:min-h-0 ${
                  hasReviews ? "" : "md:col-span-2"
                }`}
              >
                <div className="w-full h-44 md:w-[38%] md:h-auto md:min-h-[260px] relative shrink-0">
                  <img
                    src={data.imageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover md:absolute md:inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white pr-3">
                    <div className="bg-brand-500 text-xs font-bold px-3 py-1.5 rounded-lg mb-2 inline-block shadow-lg shadow-brand-500/30">
                      {data.categoryName}
                    </div>
                    {data.location && (
                      <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-white/90">
                        <MapPin className="w-3.5 h-3.5" />{" "}
                        {data.location.lat?.toFixed(4)},{" "}
                        {data.location.lng?.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-center overflow-hidden gap-3 md:gap-4 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <h3
                      className="font-heading text-xl md:text-[1.75rem] md:leading-[1.1] font-bold text-gray-900 flex-1 leading-tight"
                      title={data.title}
                    >
                      {data.title}
                    </h3>
                    <div className="bg-green-100 text-green-700 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1 md:gap-1.5 shadow-sm shrink-0">
                      <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 md:space-y-2.5">
                    <div className="flex items-center gap-3 text-gray-600 p-2.5 md:p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-1.5 md:p-2 bg-brand-100 rounded-lg shrink-0">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-600" />
                      </div>
                      <span
                        className="text-xs md:text-sm font-medium truncate"
                        title={data.address}
                      >
                        {data.address}
                      </span>
                    </div>
                    {data.website && (
                      <div className="flex items-center gap-3 text-gray-600 p-2.5 md:p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg shrink-0">
                          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <span
                          className="text-xs md:text-sm font-medium truncate"
                          title={data.website}
                        >
                          {data.website}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`grid grid-cols-2 gap-3 ${
                      photoCount > 0 ? "xl:grid-cols-3" : ""
                    }`}
                  >
                    <div className="text-center p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl md:rounded-2xl border border-yellow-200 shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-black text-gray-900">
                        {data.totalScore}
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                        Star Rating
                      </div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl border border-blue-200 shadow-sm">
                      <div className="text-xl md:text-2xl font-black text-gray-900">
                        {data.reviewsCount}
                      </div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                        Reviews
                      </div>
                    </div>
                    {/* A third tile on xl+, where the card has the width for it. */}
                    {photoCount > 0 && (
                      <div className="hidden xl:block text-center p-4 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl border border-brand-200 shadow-sm">
                        <div className="text-2xl font-black text-gray-900">
                          {photoCount}
                        </div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                          Photos
                        </div>
                      </div>
                    )}
                  </div>

                  {/* The two blocks below fill a tall card. Each is drawn only where
                      the screen is wide and tall enough to hold it, so nothing is
                      cut off. */}
                  {breakdown.length > 0 && (
                    <div className="hidden lg:[@media(min-height:700px)]:block">
                      <SectionLabel>Rating Breakdown</SectionLabel>
                      <div className="space-y-1.5">
                        {breakdown.map((row, i) => (
                          <div
                            key={row.stars}
                            className="flex items-center gap-2.5 text-xs text-gray-600"
                          >
                            <span className="w-7 shrink-0 flex items-center gap-0.5 font-semibold">
                              {row.stars}
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${row.share}%` }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.7 }}
                              />
                            </div>
                            <span className="w-7 shrink-0 text-right font-semibold tabular-nums">
                              {row.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hours.length > 0 && (
                    <div className="hidden lg:[@media(min-height:880px)]:block">
                      <SectionLabel>Opening Hours</SectionLabel>
                      <dl className="grid grid-cols-2 gap-x-5 gap-y-1 text-xs">
                        {hours.map((entry) => (
                          <div
                            key={entry.day}
                            className="flex items-baseline justify-between gap-2 min-w-0"
                          >
                            <dt className="font-semibold text-gray-700 shrink-0">
                              {entry.day.slice(0, 3)}
                            </dt>
                            <dd
                              className="text-gray-500 truncate"
                              title={entry.hours}
                            >
                              {entry.hours}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Column — a full-height panel beside the profile card on
                  md+, stacks below on mobile. On md+ it holds as many reviews as
                  fit and fades the last one out at the bottom edge. */}
              {hasReviews && (
                <div className="space-y-2 md:space-y-0 md:min-w-0 md:min-h-0 md:flex md:flex-col md:rounded-3xl md:border md:border-gray-200 md:bg-white/70 md:p-4 md:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2 mb-1 md:mb-3 shrink-0">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      Recent Reviews
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <div className="space-y-2 md:space-y-2.5 md:flex-1 md:min-h-0 md:overflow-hidden md:[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]">
                    {reviews.slice(0, REVIEWS_ON_DESKTOP).map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + i * 0.12,
                          type: "spring",
                          stiffness: 120,
                        }}
                        className={`bg-white p-3 md:p-3.5 rounded-xl md:rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] md:shadow-[0_6px_20px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden ${
                          i >= REVIEWS_ON_PHONE ? "hidden md:block" : ""
                        }`}
                      >
                        <motion.div
                          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${review.stars * 20}%` }}
                          transition={{ delay: 0.4 + i * 0.12, duration: 0.8 }}
                        />
                        <div className="flex justify-between items-start mb-1.5 md:mb-2">
                          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center font-bold text-brand-700 shadow-inner text-xs md:text-sm shrink-0">
                              {review.name?.charAt(0) ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 text-xs md:text-sm truncate">
                                {review.name}
                              </div>
                              <div className="flex text-yellow-400 text-xs gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, si) => (
                                  <Star
                                    key={si}
                                    className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${
                                      si < review.stars
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200 fill-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 md:py-1 rounded-full shrink-0 ml-2">
                            {review.publishAt}
                          </span>
                        </div>
                        {review.text && (
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">
                            "{review.text}"
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

const GBPLoadingSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-200 flex flex-col md:flex-row min-h-[280px] md:flex-1 md:min-h-0 relative">
    <div className="w-full md:w-2/5 h-64 md:h-auto relative">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 skeleton-pulse" />
    </div>
    <div className="p-8 flex-1 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-5">
        <div className="h-8 w-48 bg-gray-200 rounded-lg skeleton-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse-delay-1" />
      </div>
      <div className="space-y-3 mb-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 skeleton-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="p-2 bg-gray-200 rounded-lg w-10 h-10" />
            <div className="h-4 bg-gray-200 rounded flex-1" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="text-center p-4 bg-gray-100 rounded-2xl border border-gray-200 skeleton-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="h-7 w-12 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
