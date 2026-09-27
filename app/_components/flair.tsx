"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useInView } from "@/app/_components/motion";
import type { Kind } from "@/lib/prs";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------------------------
 * Section rail: a compact "you are here" navigator on the right edge. Seven evenly
 * spaced commit nodes; the line fills toward the next one as you scroll, the current
 * section's label stays visible, and the rest appear on hover or keyboard focus.
 * ---------------------------------------------------------------------------------- */

const SECTIONS = [
  { id: "top", label: "Intro", color: "#6ea8ff" },
  { id: "proof", label: "Proof", color: "#3ddba5" },
  { id: "work", label: "Work", color: "#ffc845" },
  { id: "practice", label: "How I work", color: "#b3a8ff" },
  { id: "redesign", label: "Redesign", color: "#ff8a5b" },
  { id: "rates", label: "Rates", color: "#6ea8ff" },
  { id: "contact", label: "Contact", color: "#3ddba5" },
];

export function SectionRail() {
  // `at` is the current section index plus how far through it you are (0–1),
  // so 2.5 means halfway between Work and How I work.
  const [at, setAt] = useState(0);

  useEffect(() => {
    let raf = 0;
    let tops: number[] = [];
    const measure = () => {
      tops = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= max - 2) return setAt(SECTIONS.length - 1);
        // A section counts as current once its top passes 35% down the viewport.
        const pos = window.scrollY + window.innerHeight * 0.35;
        let i = 0;
        while (i < tops.length - 1 && tops[i + 1] <= pos) i++;
        const next = tops[i + 1] ?? document.documentElement.scrollHeight;
        setAt(i + Math.min(1, Math.max(0, (pos - tops[i]) / Math.max(1, next - tops[i]))));
      });
    };
    // The observer fires once on observe, so it also takes the first measurement.
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = Math.floor(at);
  const last = SECTIONS.length - 1;

  return (
    <nav aria-label="Page sections" className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 min-[1280px]:block">
      <ol className="relative flex flex-col gap-3.5">
        {/* Track, and the fill that follows your scroll position. Both run dot centre to dot centre. */}
        <span aria-hidden className="absolute top-[11px] right-[8.5px] bottom-[11px] w-px bg-rule" />
        <span
          aria-hidden
          className="absolute top-[11px] right-[8px] bottom-[11px] w-[2px] origin-top bg-gradient-to-b from-glow-blue via-glow-violet to-glow-aqua transition-transform duration-150"
          style={{ transform: `scaleY(${at / last})` }}
        />
        {SECTIONS.map((s, i) => {
          const isCurrent = i === current;
          const passed = i <= current;
          return (
            <li key={s.id} className="relative flex justify-end">
              <a
                href={`#${s.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className="group flex items-center gap-3 rounded-full py-0.5 pl-2 focus-visible:outline-offset-2"
              >
                <span
                  className={`rounded-md border border-rule bg-night/90 px-2 py-0.5 font-mono text-[0.62rem] tracking-wide whitespace-nowrap uppercase backdrop-blur transition-all duration-200 ${
                    isCurrent
                      ? "translate-x-0 text-snow opacity-100"
                      : "translate-x-1 text-mist opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  aria-hidden
                  className={`relative block size-[18px] shrink-0 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${isCurrent ? "scale-110" : ""}`}
                  style={{
                    borderColor: passed ? s.color : "var(--color-rule)",
                    background: isCurrent ? s.color : "var(--color-night)",
                    boxShadow: isCurrent ? `0 0 14px ${s.color}` : "none",
                  }}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------------------------
 * Terminal ticker: types out recent merges one at a time.
 * Renders the first line in full on the server, so there's text without JS.
 * ---------------------------------------------------------------------------------- */

export type TickerItem = { ref: string; title: string; kind: Kind };

const TINT: Record<Kind, string> = {
  feature: "#6ea8ff",
  fix: "#ff8a5b",
  test: "#3ddba5",
  docs: "#b3a8ff",
  ci: "#ffc845",
};

const lineOf = (items: TickerItem[], i: number) => `${items[i].ref}  ${items[i].title}`;

export function HeroTicker({ items }: { items: TickerItem[] }) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(() => lineOf(items, 0).length);
  const [phase, setPhase] = useState<"hold" | "erase" | "type">("hold");

  useEffect(() => {
    if (items.length < 2 || prefersReducedMotion()) return;
    const full = lineOf(items, index).length;
    let t: ReturnType<typeof setTimeout>;
    if (phase === "hold") t = setTimeout(() => setPhase("erase"), 2800);
    else if (phase === "erase")
      t = setTimeout(() => {
        if (chars > 0) setChars(Math.max(0, chars - 3));
        else {
          setIndex((index + 1) % items.length);
          setPhase("type");
        }
      }, 14);
    else t = setTimeout(() => (chars < full ? setChars(chars + 1) : setPhase("hold")), 24);
    return () => clearTimeout(t);
  }, [index, chars, phase, items]);

  const item = items[index];
  const shown = lineOf(items, index).slice(0, chars);
  const refPart = shown.slice(0, item.ref.length);
  const titlePart = shown.slice(item.ref.length);

  return (
    <p
      aria-hidden
      className="flex max-w-full items-center gap-3 overflow-hidden rounded-full border border-rule/80 bg-night/70 py-2 pr-5 pl-3 font-mono text-[0.72rem] whitespace-nowrap text-mist backdrop-blur sm:w-fit"
    >
      <span className="rounded-full bg-raised px-2 py-0.5 text-[0.62rem] tracking-wide uppercase" style={{ color: TINT[item.kind] }}>
        merged
      </span>
      <span className="min-w-0 truncate">
        <span className="text-snow">{refPart}</span>
        {titlePart}
        <span className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.2em] animate-[blink_1s_steps(1)_infinite] bg-glow-aqua motion-reduce:animate-none" />
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------------------------
 * Section headings whose words rise in, one after another, when scrolled into view.
 * ---------------------------------------------------------------------------------- */

export function SplitHeading({ id, text, className = "" }: { id: string; text: string; className?: string }) {
  const [ref, inView] = useInView<HTMLHeadingElement>();
  const words = text.split(" ");
  return (
    <h2 ref={ref} id={id} data-in={inView} className={`split ${className}`}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="split-w" style={{ "--w": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------------------------
 * Magnetic: the wrapped element leans toward a mouse pointer hovering over it.
 * ---------------------------------------------------------------------------------- */

export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  function onMove(e: PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }
  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-block transition-transform duration-300 ease-out"
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------------------
 * Cursor glow: a soft light that follows a mouse across the dark background.
 * ---------------------------------------------------------------------------------- */

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-700"
      style={{ background: "radial-gradient(560px circle at var(--x, 50%) var(--y, 50%), #6ea8ff14, transparent 60%)" }}
    />
  );
}
