"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { setCurrency, useCurrency } from "@/app/_components/use-currency";
import { formatPrice } from "@/lib/rates";
import { redesignFrom, redesignTimeline } from "@/lib/redesign";

/**
 * Drag (or use the arrow keys) to wipe between two screenshots. A native range input
 * covers the image, so pointer, touch and keyboard all work without extra handlers.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: StaticImageData;
  after: StaticImageData;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // The first time the slider scrolls into view, sweep it once to show it moves.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / 2200);
          // Roughly 50 → 23 → 75 → 50, settling back to the middle.
          setPos(50 + Math.sin(t * Math.PI * 2) * -28 * (1 - t * 0.15));
          if (t < 1) raf = requestAnimationFrame(tick);
          else setPos(50);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const shown = Math.round(pos);

  return (
    <figure>
      <div
        ref={frameRef}
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-rule bg-surface shadow-[0_40px_90px_-50px_#6ea8ffaa] select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-glow-gold"
      >
        <Image src={after} alt={afterAlt} sizes="(min-width: 1152px) 1088px, 100vw" placeholder="blur" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={beforeAlt} sizes="(min-width: 1152px) 1088px, 100vw" placeholder="blur" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-night/80 px-3 py-1 font-mono text-[0.65rem] tracking-wide text-snow uppercase backdrop-blur">
          Before
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-gradient-to-r from-glow-blue to-glow-violet px-3 py-1 font-mono text-[0.65rem] tracking-wide text-night uppercase">
          After
        </span>

        {/* Divider and handle */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-snow shadow-[0_0_18px_#6ea8ff]" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-snow bg-night/85 font-mono text-sm text-snow shadow-[0_0_24px_#6ea8ff88] backdrop-blur">
            ‹›
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={shown}
          onChange={(e) => {
            touched.current = true;
            setPos(Number(e.target.value));
          }}
          onPointerDown={() => (touched.current = true)}
          aria-label="Compare the old and new design"
          aria-valuetext={`${shown}% old design, ${100 - shown}% new design`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-xs text-mist">
        <span>This site, before and after. Drag the handle or use the arrow keys.</span>
        <span>Same content, new design.</span>
      </figcaption>
    </figure>
  );
}

export function RedesignPrice() {
  const currency = useCurrency();
  const other = currency === "USD" ? "NGN" : "USD";
  return (
    <div className="rounded-2xl border border-glow-violet/40 bg-surface p-6 shadow-[0_30px_70px_-45px_#b3a8ff]">
      <p className="font-mono text-[0.65rem] tracking-wide text-mist uppercase">Redesigns start at</p>
      <p
        key={currency}
        className="mt-1 animate-[word-in_450ms_cubic-bezier(0.2,0.7,0.2,1)_both] bg-gradient-to-r from-glow-violet to-glow-blue bg-clip-text font-display text-5xl font-semibold tracking-tight text-transparent motion-reduce:animate-none"
      >
        {formatPrice(redesignFrom[currency], currency)}
      </p>
      <p className="mt-2 text-sm text-mist">{redesignTimeline}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
        <button type="button" onClick={() => setCurrency(other)} className="text-mist underline decoration-rule underline-offset-4 hover:text-snow">
          Show in {other}
        </button>
        <a href="#rates" className="text-glow-gold underline decoration-glow-gold/40 underline-offset-4 hover:decoration-glow-gold">
          Rates and terms ↓
        </a>
      </div>
    </div>
  );
}
