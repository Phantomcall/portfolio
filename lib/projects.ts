import type { StaticImageData } from "next/image";
import forgeShot from "@/assets/work/forge.png";
import hackoddsShot from "@/assets/work/hackodds.png";
import mirrorShot from "@/assets/work/mirror.png";

export type Project = {
  name: string;
  summary: string;
  context?: string;
  role: string;
  work: string[];
  stack: string[];
  image: StaticImageData;
  imageAlt: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: "Forge",
    summary: "An on-chain labor market where AI agents take escrowed jobs and get paid in USDC.",
    context: "Encode Club × Circle “Build on Arc” hackathon, Agentic Economy track",
    role: "Lead frontend engineer · 26 of 29 frontend commits",
    work: [
      "Built the whole app: the job board, agent profiles, leaderboard, job pipeline view and landing page.",
      "Drew the landing page’s particle globe and ambient field by hand on HTML Canvas, reacting to the cursor.",
      "Designed a glass component system, generated identicons and a light and dark theme with smooth transitions.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion", "Supabase", "Zod"],
    image: forgeShot,
    imageAlt: "Forge landing page: a particle globe crossed by two orbit rings beside the headline “An onchain labor market for autonomous agents.”",
    links: [
      { label: "Live site", href: "https://forge-onchain.vercel.app/" },
      { label: "Code", href: "https://github.com/Forge-hackaton-arc/Forge-Frontend" },
    ],
  },
  {
    name: "Mirror",
    summary:
      "A tamper-proof track record and hard-capped copy-trading vault for trading agents on Robinhood Chain.",
    context: "Hackathon build, deployed to Robinhood Chain and Arbitrum Sepolia testnets",
    role: "Frontend engineer",
    work: [
      "Built the vault flows (deposit, follow, kill switch and withdraw) with transaction toasts and wallet gating.",
      "Decoded raw smart-contract reverts into plain messages that tell people exactly why an action was rejected.",
      "Made every modal work by keyboard and screen reader, with focus trapping, live announcements and a skip link.",
    ],
    stack: ["Next.js", "TypeScript", "wagmi", "viem", "TanStack Query", "Vitest"],
    image: mirrorShot,
    imageAlt: "Mirror landing page: a dark starfield with a glowing ring behind the headline “Every trade on-chain. Every follow capped.”",
    links: [
      { label: "Live site", href: "https://mirror-onchain.vercel.app/" },
      { label: "Code", href: "https://github.com/Chibey-max/Mirror" },
    ],
  },
  {
    name: "HackOdds",
    summary: "A live board that ranks every open hackathon by its prize against the people who actually entered.",
    role: "Frontend engineer and UI designer",
    work: [
      "Designed and built a dense ranking board fed by six sources, with detail pages that explain every score.",
      "Shows missing data as unknown rather than zero, so a gap in a feed never looks like a good bet.",
      "Explored three complete visual directions before settling the final design language.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: hackoddsShot,
    imageAlt: "HackOdds home page: the headline “Every live hackathon, ranked by your odds” beside a grid of hackathon cards showing prize pools and days left.",
    links: [{ label: "Live site", href: "https://hackodds-live.vercel.app/" }],
  },
];
