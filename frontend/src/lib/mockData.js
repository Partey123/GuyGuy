// Mock data for the GuyGuy frontend prototype.

export const TRADES = [
  { id: "electrician", label: "Electrician", icon: "⚡", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80" },
  { id: "plumber", label: "Plumber", icon: "🔧", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80" },
  { id: "painter", label: "Painter", icon: "🎨", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80" },
  { id: "welder", label: "Welder", icon: "🔥", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80" },
  { id: "carpenter", label: "Carpenter", icon: "🪚", image: "https://images.unsplash.com/photo-1572297794595-c096b9d50509?w=400&q=80" },
  { id: "ac-tech", label: "AC Technician", icon: "❄️", image: "https://images.unsplash.com/photo-1631545806609-fac5e2d9ed2d?w=400&q=80" },
  { id: "phone-repair", label: "Phone Repair", icon: "📱", image: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=400&q=80" },
  { id: "makeup", label: "Makeup Artist", icon: "💄", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80" },
  { id: "photographer", label: "Photographer", icon: "📷", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" },
  { id: "tailor", label: "Tailor", icon: "🧵", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80" },
  { id: "tutor", label: "Home Tutor", icon: "📚", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80" },
];

export const ARTISANS = [
  {
    id: "a1",
    slug: "kwame-asante",
    name: "Kwame Asante",
    trade: "electrician",
    tradeLabel: "Electrician",
    avatar: "https://i.pravatar.cc/200?img=12",
    location: "Suame, Kumasi",
    distanceKm: 2.4,
    rating: 4.9,
    reviewCount: 128,
    completedJobs: 214,
    verified: true,
    boosted: true,
    available: true,
    badgeTier: "gold",
    momo_number: "0244123456",
    momo_network: "mtn",
    bio: "10+ years wiring residential homes, fans, sockets, full installations. Quick, neat, and I clean up after myself.",
    rateFrom: 80,
    portfolio: [
      "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=600",
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600",
    ],
  },
  {
    id: "a2",
    slug: "ama-mensah",
    name: "Ama Mensah",
    trade: "makeup",
    tradeLabel: "Makeup Artist",
    avatar: "https://i.pravatar.cc/200?img=47",
    location: "Nhyiaeso, Kumasi",
    distanceKm: 4.1,
    rating: 5.0,
    reviewCount: 86,
    completedJobs: 142,
    verified: true,
    boosted: false,
    available: true,
    badgeTier: "silver",
    momo_number: "0204556677",
    momo_network: "vodafone",
    bio: "Bridal & event makeup. Will travel to your venue.",
    rateFrom: 250,
    portfolio: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
    ],
  },
  {
    id: "a3",
    slug: "yaw-boateng",
    name: "Yaw Boateng",
    trade: "plumber",
    tradeLabel: "Plumber",
    avatar: "https://i.pravatar.cc/200?img=33",
    location: "Airport Hills, Kumasi",
    distanceKm: 5.6,
    rating: 4.7,
    reviewCount: 64,
    completedJobs: 91,
    verified: true,
    boosted: false,
    available: false,
    badgeTier: "none",
    momo_number: "0244998877",
    momo_network: "mtn",
    bio: "Bathroom and kitchen specialist. Leak repair, tiling, full installs.",
    rateFrom: 120,
    portfolio: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600",
    ],
  },
  {
    id: "a4",
    slug: "akosua-darko",
    name: "Akosua Darko",
    trade: "tailor",
    tradeLabel: "Tailor",
    avatar: "https://i.pravatar.cc/200?img=20",
    location: "Appiadu, Kumasi",
    distanceKm: 3.2,
    rating: 4.8,
    reviewCount: 51,
    completedJobs: 78,
    verified: true,
    boosted: true,
    available: true,
    badgeTier: "bronze",
    momo_number: "0274112233",
    momo_network: "airteltigo",
    bio: "Custom kaba & slit, kente styling, alterations.",
    rateFrom: 60,
    portfolio: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
    ],
  },
  {
    id: "a5",
    slug: "kojo-ofori",
    name: "Kojo Ofori",
    trade: "ac-tech",
    tradeLabel: "AC Technician",
    avatar: "https://i.pravatar.cc/200?img=15",
    location: "Asokwa, Kumasi",
    distanceKm: 6.8,
    rating: 4.6,
    reviewCount: 39,
    completedJobs: 52,
    verified: false,
    boosted: false,
    available: true,
    badgeTier: "none",
    momo_number: "0244665544",
    momo_network: "mtn",
    bio: "Split AC servicing, gas refill, installation.",
    rateFrom: 100,
    portfolio: [],
  },
  {
    id: "a6",
    slug: "abena-owusu",
    name: "Abena Owusu",
    trade: "photographer",
    tradeLabel: "Photographer",
    avatar: "https://i.pravatar.cc/200?img=9",
    location: "Adum, Kumasi",
    distanceKm: 1.9,
    rating: 4.9,
    reviewCount: 73,
    completedJobs: 110,
    verified: true,
    boosted: false,
    available: true,
    badgeTier: "none",
    momo_number: "0264887766",
    momo_network: "mtn",
    bio: "Events, portraits, weddings. Same-day previews.",
    rateFrom: 400,
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    ],
  },
];

const now = Date.now();
const inHours = (h) => new Date(now + h * 60 * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

const buildBooking = (b) => {
  const labour = b.labourAmount || 0;
  const materials = b.materialsAmount || 0;
  const amount = labour + materials;
  const commissionAmount = Math.round(labour * 0.1);
  return {
    ...b,
    amount,
    commissionAmount,
    artisanPayout: amount - commissionAmount,
  };
};

export const BOOKINGS = [
  buildBooking({
    id: "b1",
    artisanId: "a1",
    clientName: "You",
    title: "Replace ceiling fan in living room",
    description: "Fan is wobbling and the light no longer works. Need full replacement.",
    status: "in_progress",
    jobType: "labour_and_materials",
    labourAmount: 180,
    materialsAmount: 40,
    createdAt: hoursAgo(72),
    scheduledFor: inHours(24),
    address: "Plot 12, Nhyiaeso",
    escrow: "held",
  }),
  buildBooking({
    id: "b2",
    artisanId: "a3",
    clientName: "You",
    title: "Bathroom sink leak",
    description: "Slow leak under the basin, water collecting in the cabinet.",
    status: "requested",
    jobType: "labour_only",
    labourAmount: 150,
    materialsAmount: 0,
    createdAt: hoursAgo(18),
    scheduledFor: null,
    address: "Plot 12, Nhyiaeso",
    escrow: "pending",
  }),
  buildBooking({
    id: "b3",
    artisanId: "a2",
    clientName: "You",
    title: "Bridal makeup, Saturday",
    description: "Outdoor wedding, soft glam.",
    status: "completed",
    jobType: "labour_only",
    labourAmount: 600,
    materialsAmount: 0,
    createdAt: hoursAgo(24 * 14),
    scheduledFor: hoursAgo(24 * 8),
    address: "Royal Lamerta Hotel",
    escrow: "released",
  }),
  buildBooking({
    id: "b4",
    artisanId: "a4",
    clientName: "You",
    title: "Custom kaba and slit",
    description: "Need it altered for an engagement next weekend.",
    status: "completed_by_artisan",
    jobType: "labour_only",
    labourAmount: 220,
    materialsAmount: 0,
    createdAt: hoursAgo(48),
    scheduledFor: hoursAgo(8),
    artisanCompletedAt: hoursAgo(2),
    autoReleaseAt: inHours(48),
    address: "Bantama, Kumasi",
    escrow: "held",
  }),
  buildBooking({
    id: "b5",
    artisanId: "a5",
    clientName: "You",
    title: "AC servicing — bedroom split unit",
    description: "Not cooling properly. Suspect needs gas refill.",
    status: "disputed",
    jobType: "labour_and_materials",
    labourAmount: 200,
    materialsAmount: 80,
    createdAt: hoursAgo(96),
    scheduledFor: hoursAgo(48),
    address: "Asokwa, Kumasi",
    escrow: "held",
    disputeReason: "Poor quality work",
    disputeNote: "Unit still not cooling 2 days after the visit.",
  }),
];

export const ARTISAN_BOOKINGS = BOOKINGS;

export const MESSAGES = [
  { id: "m1", bookingId: "b1", from: "artisan", text: "Good morning, I can come by 2pm tomorrow.", at: hoursAgo(20) },
  { id: "m2", bookingId: "b1", from: "client", text: "Perfect, see you then. Address is in the booking.", at: hoursAgo(20) },
  { id: "m3", bookingId: "b1", from: "artisan", text: "Noted. Should I bring a new fan or do you have one?", at: hoursAgo(19) },
  { id: "m4", bookingId: "b1", from: "client", text: "I have one already, just bring your tools.", at: hoursAgo(18) },
  { id: "m5", bookingId: "b2", from: "artisan", text: "I can swing by this evening to check the leak.", at: hoursAgo(6) },
  { id: "m6", bookingId: "b2", from: "client", text: "That works. Around 6pm?", at: hoursAgo(5) },
  { id: "m7", bookingId: "b2", from: "artisan", text: "6pm confirmed. Wo akwaaba.", at: hoursAgo(5) },
];

export const REVIEWS = [
  { id: "r1", artisanId: "a1", author: "Esi A.", rating: 5, text: "Punctual and clean. Fixed three sockets in under an hour.", at: "2026-04-12" },
  { id: "r2", artisanId: "a1", author: "Kwabena O.", rating: 5, text: "Great work and fair price.", at: "2026-03-30" },
  { id: "r3", artisanId: "a1", author: "Ama K.", rating: 4, text: "Came a bit late but did the job well.", at: "2026-03-21" },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "New message from Kwame", body: "Should I bring a new fan or do you have one?", at: hoursAgo(19), unread: true, link: "/bookings/b1" },
  { id: "n2", title: "Akosua marked your job complete", body: "Confirm within 48h or it auto-releases.", at: hoursAgo(2), unread: true, link: "/bookings/b4" },
  { id: "n3", title: "Payment released", body: "GHS 600 released to Ama Mensah.", at: hoursAgo(24 * 8), unread: false, link: "/bookings/b3" },
];

export const EARNINGS_SERIES = [
  { week: "W1", amount: 420 },
  { week: "W2", amount: 680 },
  { week: "W3", amount: 510 },
  { week: "W4", amount: 920 },
  { week: "W5", amount: 1100 },
  { week: "W6", amount: 870 },
  { week: "W7", amount: 1340 },
];

export const findArtisan = (idOrSlug) =>
  ARTISANS.find((a) => a.id === idOrSlug || a.slug === idOrSlug);

export const findBooking = (id) => BOOKINGS.find((b) => b.id === id);

// Cover images for portrait cards
ARTISANS.forEach((a, i) => {
  const covers = [
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  ];
  if (!a.coverImage) a.coverImage = covers[i % covers.length];
});

export const PLATFORM_STATS = [
  { value: "100+", label: "Verified artisans" },
  { value: "₵150", label: "Avg. job value" },
  { value: "4.9★", label: "Average rating" },
  { value: "Kumasi", label: "Launching now" },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Esi Ankrah",
    role: "Homeowner, Accra",
    avatar: "https://i.pravatar.cc/100?img=49",
    quote:
      "I booked a plumber on Sunday evening and he was at my door in 40 minutes. The escrow made me feel safe paying upfront.",
  },
  {
    id: "t2",
    name: "Kwabena Osei",
    role: "Property manager",
    avatar: "https://i.pravatar.cc/100?img=14",
    quote:
      "We manage 30 apartments. GuyGuy replaced our entire vendor spreadsheet — every artisan is rated and verified.",
  },
  {
    id: "t3",
    name: "Adwoa Mensah",
    role: "Bride",
    avatar: "https://i.pravatar.cc/100?img=24",
    quote:
      "Found my makeup artist, photographer and tailor in one afternoon. The reviews are real — exactly what I got.",
  },
];

export { DISPUTE_REASONS } from "@/lib/constants";
