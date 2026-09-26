export type Currency = "USD" | "NGN";

type Price = Record<Currency, number>;

export const hourly: Price = { USD: 25, NGN: 20_000 };

export type Package = {
  name: string;
  forWho: string;
  from: Price;
  timeline: string;
  includes: string[];
  featured?: boolean;
};

// "Starting at" prices. Scope, deadline and custom features move the final quote.
export const packages: Package[] = [
  {
    name: "Landing page",
    forWho: "A launch, a product or a campaign",
    from: { USD: 400, NGN: 180_000 },
    timeline: "About 1 week",
    includes: [
      "One responsive page, designed and built",
      "Scroll and hover animations",
      "Contact or sign-up form",
      "SEO basics and link previews",
      "Deployed on your domain",
    ],
  },
  {
    name: "Business website",
    forWho: "A company that needs a proper home online",
    from: { USD: 1_200, NGN: 400_000 },
    timeline: "2–3 weeks",
    includes: [
      "Up to 6 pages",
      "Content you can edit yourself",
      "Blog or news section",
      "Analytics and a performance audit",
      "Accessibility checked with a keyboard and screen reader",
    ],
    featured: true,
  },
  {
    name: "Web app or dashboard",
    forWho: "Internal tools, SaaS screens, admin panels",
    from: { USD: 3_000, NGN: 750_000 },
    timeline: "4–8 weeks",
    includes: [
      "Sign-in and user roles",
      "Tables, filters and charts",
      "Connected to your API or database",
      "Tests and CI on every change",
      "Handover docs for your team",
    ],
  },
  {
    name: "Web3 frontend",
    forWho: "dApps that need a UI people trust",
    from: { USD: 2_500, NGN: 600_000 },
    timeline: "3–6 weeks",
    includes: [
      "Wallet connection (browser and WalletConnect)",
      "Contract reads, writes and transaction states",
      "Plain-language errors instead of raw reverts",
      "Testnet rehearsal before launch",
    ],
  },
];

export const adjustments = [
  { label: "Rush delivery", effect: "+25%", detail: "Delivered on a deadline shorter than the package timeline." },
  { label: "Flexible timeline", effect: "−10%", detail: "No fixed deadline, so I can schedule around other work." },
];

export const terms = [
  "50% to start, 50% on delivery.",
  "Two rounds of revisions included. Further rounds are billed at the hourly rate.",
  "Custom features outside a package are quoted at the hourly rate.",
  "Hosting, domains and third-party fees are paid by you, at cost.",
];

export function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
