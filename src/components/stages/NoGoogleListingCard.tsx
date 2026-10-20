import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cardVariants } from "../../lib/animations/variants";

/**
 * Takes the place of the Google Business Profile and Local Ranking grade
 * cards when the business has no Google Maps listing. It states the fact and
 * what to do about it; it never shows a grade, because there is nothing to
 * grade.
 */
export const NoGoogleListingCard = () => (
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
      listing, you don&apos;t show up there at all. This report covers your
      website only. Add a free Google Business Profile, then run the check
      again to see your Google grade and how you rank against nearby
      competitors.
    </p>
  </motion.div>
);

NoGoogleListingCard.displayName = "NoGoogleListingCard";
