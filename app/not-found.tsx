import Link from "next/link";

// The site's own vocabulary for a missing page: a branch that forked off and never came back.
export default function NotFound() {
  return (
    <main className="relative isolate mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
      <div aria-hidden className="absolute top-1/4 left-1/2 -z-10 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#ff8a5b26,transparent)]" />
      <svg aria-hidden viewBox="0 0 420 120" className="w-full max-w-md" fill="none">
        <path d="M0 90 H420" stroke="#e8ecf5" strokeOpacity=".35" strokeWidth="1.5" />
        {[20, 80, 140, 320, 380].map((x) => (
          <circle key={x} cx={x} cy="90" r="3" fill="#e8ecf5" fillOpacity=".5" />
        ))}
        <path
          d="M140 90 C180 90 180 30 220 30 H300"
          stroke="#ff8a5b"
          strokeWidth="2"
          strokeDasharray="4 6"
          className="animate-[dash_1.2s_linear_infinite] motion-reduce:animate-none"
        />
        <circle cx="300" cy="30" r="5" fill="#ff8a5b" />
        <circle cx="300" cy="30" r="12" stroke="#ff8a5b" strokeOpacity=".4" />
      </svg>
      <p className="mt-10 font-mono text-[0.7rem] tracking-wide text-mist uppercase">404 · page not found</p>
      <h1 className="mt-3 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[1] font-semibold tracking-[-0.03em] text-balance">
        This branch was never merged.
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">
        The page you’re looking for doesn’t exist, or it moved. Everything that did ship is on the home page.
      </p>
      <Link
        href="/"
        className="cta-ring mt-9 w-fit rounded-full px-7 py-3.5 font-display font-semibold text-snow"
      >
        Back to the home page
      </Link>
    </main>
  );
}
