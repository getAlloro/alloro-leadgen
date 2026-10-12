/**
 * Static mapping of grade/pillar category names to "Why this matters" descriptions.
 * Used by WhyThisMattersTooltip component throughout the dashboard.
 */
export const WHY_THIS_MATTERS: Record<string, string> = {
  // Grade cards (top 3 circular progress cards)
  "Website Performance Grade":
    "Your website is the digital front door to your business. A high-performing site builds trust instantly, ranks higher in search results, and converts visitors into customers.",
  "Google Business Profile Grade":
    "Your Google Business Profile is how customers find and evaluate you. A complete, optimized profile increases your visibility in local searches and builds credibility before customers even visit your site.",
  "Local Ranking":
    "Local ranking determines where you appear when customers search for services in your area. Higher rankings mean more visibility, more clicks, and more new customer bookings.",

  // Website pillars
  "Trust & Authority":
    "Trust signals like testimonials, reviews, and credentials are what convince customers to choose you over competitors. Without them, visitors leave before booking.",
  Accessibility:
    "An accessible website reaches all customers, including those with disabilities. It also improves SEO and demonstrates your commitment to inclusive service.",
  "Customer Journey":
    "A smooth customer journey—from landing to booking—reduces friction and increases conversions. Every extra click or unclear step costs you appointments.",
  // The report still names this pillar "Patient Journey" until the server prompt is reworded; both names find the same words.
  "Patient Journey":
    "A smooth customer journey—from landing to booking—reduces friction and increases conversions. Every extra click or unclear step costs you appointments.",
  "Technical Reliability":
    "Site speed, security, and uptime directly impact rankings and user experience. Technical issues frustrate customers and signal unprofessionalism to Google.",

  // GBP pillars
  "Profile Integrity":
    "Consistent business information across all platforms builds trust with both Google and customers. Inconsistencies confuse search engines and hurt your rankings.",
  "Trust & Engagement":
    "Reviews and customer interactions are the strongest trust signals online. High review volume and active engagement directly correlate with new customer acquisition.",
  "Visual Authority":
    "Photos humanize your business and showcase your facilities. Profiles with quality images receive significantly more engagement and direction requests.",
  "Search Conversion":
    "Optimized posts and keywords help you appear for high-intent searches. Without them, customers searching for your services find your competitors instead.",
  "Competitor Analysis":
    "Understanding your competitive position reveals where you're winning and losing. This insight drives strategic decisions that help you capture more market share.",
};
