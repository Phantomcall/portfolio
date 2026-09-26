"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Render as a list item when the reveal wraps an item of an <ol>/<ul>. */
  as?: "div" | "li";
}) {
  const [ref, inView] = useInView<HTMLDivElement & HTMLLIElement>();
  return (
    <Tag
      ref={ref}
      data-reveal
      data-in={inView}
      className={className}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Counts up to `value` when it scrolls into view. Renders the final value without JS. */
export function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px");
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** A card whose border and surface glow where the pointer is. */
export function Spotlight({
  children,
  color = "#6ea8ff",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }
  return (
    <div onPointerMove={onMove} className={`spotlight ${className}`} style={{ "--spot": color } as CSSProperties}>
      {children}
    </div>
  );
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-rule px-5 py-3 font-mono text-xs text-mist transition-colors hover:border-glow-aqua hover:text-snow"
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy email"}</span>
    </button>
  );
}

const NAV = [
  { id: "proof", label: "Proof" },
  { id: "work", label: "Work" },
  { id: "redesign", label: "Redesign" },
  { id: "rates", label: "Rates" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // A section is "current" while it crosses the middle band of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Back at the hero, no nav item is current.
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...NAV.map((n) => n.id)]) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-rule/70 bg-night/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid size-7 grid-cols-2 gap-[3px] rounded-md bg-raised p-[5px] transition-transform duration-500 group-hover:rotate-90"
          >
            <span className="rounded-[2px] bg-glow-blue" />
            <span className="rounded-[2px] bg-glow-coral" />
            <span className="rounded-[2px] bg-glow-aqua" />
            <span className="rounded-[2px] bg-glow-gold" />
          </span>
          <span className="max-sm:sr-only">{name}</span>
        </a>
        <nav aria-label="Sections" className="flex gap-4 font-mono text-[0.7rem] tracking-wide uppercase [font-stretch:88%] sm:gap-7">
          {NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className="relative py-1 text-mist transition-colors hover:text-snow aria-[current=true]:text-snow after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-glow-blue after:to-glow-aqua after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=true]:after:scale-x-100"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
