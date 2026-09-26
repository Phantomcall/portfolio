import type { Metadata } from "next";
import { Familjen_Grotesk, Martian_Mono, Source_Serif_4 } from "next/font/google";
import { pullRequests, repoCount } from "@/lib/prs";
import "./globals.css";

const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  axes: ["opsz"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"],
});

const description = `Frontend engineer building fast, accessible React and Next.js interfaces. ${pullRequests.length} pull requests merged across ${repoCount} open-source projects.`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Patrick Uje · Frontend engineer",
  description,
  openGraph: {
    title: "Patrick Uje · Frontend engineer",
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${familjen.variable} ${sourceSerif.variable} ${martian.variable} antialiased`}
      // The inline script below adds the "js" class before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Scroll-reveal content is only hidden when JS is running to reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh overflow-x-clip font-serif">{children}</body>
    </html>
  );
}
