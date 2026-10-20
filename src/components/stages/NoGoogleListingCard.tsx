import { motion } from "framer-motion";
import { ArrowRight, MapPin, RotateCcw } from "lucide-react";
import { cardVariants } from "../../lib/animations/variants";

/**
 * Takes the place of the Google Business Profile and Local Ranking grade
 * cards when the business has no Google Maps listing. It states the fact and
 * what to do about it; it never shows a grade, because there is nothing to
 * grade.
 */
export const NoGoogleListingCard = ({
  websiteGraded = true,
  websiteBlocked = false,
}: {
  // False when no website was given or our scan was blocked: then the report
  // has no website grade either, and the card must not say it does.
  websiteGraded?: boolean;
  websiteBlocked?: boolean;
}) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 overflow-hidden relative lg:col-span-2"
    custom={2}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    data-testid="no-google-listing-card"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">
        <MapPin className="w-5 h-5 text-gray-500" />
      </div>
      <h3 className="text-sm font-bold text-gray-700">
        Google Business Profile
      </h3>
    </div>
    <p className="text-lg font-bold text-gray-900 mb-2">
      We couldn&apos;t find this business on Google Maps.
    </p>
    <p className="text-sm text-gray-600 max-w-xl">
      Most customers look for a local business on Google Maps first. Without a
      listing, you don&apos;t show up there at all.{" "}
      {websiteGraded
        ? "This report covers your website only. "
        : websiteBlocked
        ? "Your website also blocks automated checks, so we couldn't grade it. "
        : "We couldn't check a website either. "}
      Add a free Google Business Profile, then run the check again to see your
      Google grade and how you rank against nearby competitors.
    </p>
    <div className="flex flex-wrap gap-3 mt-5">
      <a
        href="https://business.google.com/create"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
      >
        Create a free Google Business Profile
        <ArrowRight className="w-4 h-4" />
      </a>
      {/* A fresh check from the start page: the lead searches again once the
          listing is live. Same tab, so it reads as one flow. */}
      <a
        href="/"
        className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Run the check again
      </a>
    </div>
  </motion.div>
);

NoGoogleListingCard.displayName = "NoGoogleListingCard";
