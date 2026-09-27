"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useInView } from "@/app/_components/motion";
import type { Kind } from "@/lib/prs";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------------------------
 * Commit spine: a git line down the left margin. It fills as you scroll, and each
 * section is a commit node that lights up once you've passed it. Wide screens only;
 * the header nav is the accessible way around the page, so this is mouse-only.
 * ---------------------------------------------------------------------------------- */

const SPINE = [
  { id: "top", label: "Intro", color: "#6ea8ff" },
  { id: "proof", label: "Proof", color: "#3ddba5" },
  { id: "work", label: "Work", color: "#ffc845" },
  { id: "practice", label: "How I work", color: "#b3a8ff" },
  { id: "redesign", label: "Redesign", color: "#ff8a5b" },
  { id: "rates", label: "Rates", color: "#6ea8ff" },
  { id: "contact", label: "Contact", color: "#3ddba5" },
];

export function CommitSpine() {
  const [marks, setMarks] = useState<((typeof SPINE)[number] & { at: number })[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const scrollMax = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () =>
      setMarks(
        SPINE.map((s) => {
          const el = document.getElementById(s.id);
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          return { ...s, at: Math.min(1, Math.max(0, top / scrollMax())) };
        }),
      );
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setProgress(window.scrollY / scrollMax()));
    };
    // The observer fires once on observe, so it also does the first measurement.
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-24 bottom-10 left-[calc((100vw-72rem)/2-3.25rem)] z-30 hidden w-6 min-[1360px]:block"
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rule/80" />
      <span
        className="absolute top-0 left-1/2 h-full w-[2px] origin-top bg-gradient-to-b from-glow-blue via-glow-violet to-glow-aqua shadow-[0_0_12px_#6ea8ff88]"
        style={{ transform: `translateX(-50%) scaleY(${progress})` }}
      />
      {marks.map((m) => {
        const passed = progress >= m.at - 0.002;
        return (
          <a
            key={m.id}
            href={`#${m.id}`}
            tabIndex={-1}
            className="group pointer-events-auto absolute left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ top: `${m.at * 100}%` }}
          >
            <span
              className="block size-3 rounded-full border-2 transition-all duration-500 group-hover:scale-150"
              style={{
                borderColor: passed ? m.color : "var(--color-rule)",
                background: passed ? m.color : "var(--color-night)",
                boxShadow: passed ? `0 0 14px ${m.color}` : "none",
              }}
            />
            <span className="absolute top-1/2 left-7 -translate-x-1 -translate-y-1/2 rounded-md border border-rule bg-night/90 px-2 py-1 font-mono text-[0.62rem] whitespace-nowrap text-snow uppercase opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              {m.label}
            </span>
          </a>
        );
      })}
    </div>
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
