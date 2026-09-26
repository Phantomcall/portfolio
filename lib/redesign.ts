import type { StaticImageData } from "next/image";
import after from "@/assets/work/redesign-after.jpg";
import before from "@/assets/work/redesign-before.jpg";
import type { Currency } from "@/lib/rates";

// The worked example: this portfolio, first version (light) against the current one.
export const example: {
  before: StaticImageData;
  after: StaticImageData;
  beforeAlt: string;
  afterAlt: string;
} = {
  before,
  after,
  beforeAlt:
    "The first version of this site: a light grey page with a dark headline and a static grid of pull request squares.",
  afterAlt:
    "The redesigned site: a dark page with gradient headline words and an animated graph of pull requests branching and merging.",
};

export const redesignFrom: Record<Currency, number> = { USD: 600, NGN: 250_000 };
export const redesignTimeline = "1–3 weeks, depending on the number of pages";

// A real sequence, in order: each step's output feeds the next.
export const steps = [
  {
    title: "Audit",
    body: "I test your current site for speed, accessibility and mobile layout, read your analytics if you have them, and send a short report on what’s slowing people down or turning them away.",
  },
  {
    title: "Redesign",
    body: "A new layout and visual direction for your key pages. You approve the design before any code changes.",
  },
  {
    title: "Rebuild",
    body: "I rebuild the site on a modern stack, keep your content, and redirect any page whose address changes so search engines and old links still find it.",
  },
  {
    title: "Launch and compare",
    body: "The new site goes live, and you get a before-and-after report: speed, accessibility and mobile scores side by side.",
  },
];

export const keeps = [
  "Your content, moved over for you",
  "Your page addresses, or redirects from the old ones",
  "Content you can still edit yourself",
];

export const gains = [
  "A layout that works on every screen size",
  "Faster load times, measured before and after",
  "Accessibility fixes for keyboard, contrast and screen readers",
];
