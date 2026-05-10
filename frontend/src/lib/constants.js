export const APP_NAME = "GuyGuy";
export const APP_TAGLINE = "The right guy. Every time.";
export const APP_TAGLINE_ARTISAN = "Your skills. Your profile. Your income.";

export const ROLES = {
  CLIENT: "client",
  ARTISAN: "artisan",
  ADMIN: "admin",
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED_BY_ARTISAN: "completed_by_artisan",
  COMPLETED: "completed",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const BADGE_TIERS = {
  NONE: "none",
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
};

export const BOOST_PLANS = [
  {
    id: "monthly",
    label: "Monthly Boost",
    duration: "30 days",
    price: 25,
    badge: null,
    badgeLabel: null,
    perks: [
      "Appear above non-boosted artisans",
      "Boosted tag on your profile card",
      "Renewed monthly",
    ],
  },
  {
    id: "bronze",
    label: "Bronze Plan",
    duration: "3 months",
    price: 60,
    badge: "bronze",
    badgeLabel: "🥉 Bronze",
    perks: [
      "All Monthly Boost perks",
      "Bronze badge on your profile",
      "Sustained visibility for 3 months",
    ],
  },
  {
    id: "silver",
    label: "Silver Plan",
    duration: "6 months",
    price: 110,
    badge: "silver",
    badgeLabel: "🥈 Silver",
    perks: [
      "All Bronze perks",
      "Silver badge — signals 6 months of commitment",
      "Placed in Recommended section on home",
    ],
  },
  {
    id: "gold",
    label: "Gold Plan",
    duration: "12 months",
    price: 200,
    badge: "gold",
    badgeLabel: "🥇 Gold",
    perks: [
      "All Silver perks",
      "Gold badge — top trust signal",
      "Featured on the home screen hero",
      "Top of all search results",
    ],
  },
];

export const COMMISSION_RATE = 0.10;

export const DISPUTE_REASONS = [
  "Job not completed",
  "Poor quality work",
  "Wrong materials used",
  "Artisan didn't show up",
  "Pricing dispute",
];

// TRADES is exported from @/lib/mockData (object form). Do not duplicate here.
