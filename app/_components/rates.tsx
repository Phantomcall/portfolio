"use client";

import { Reveal, Spotlight } from "@/app/_components/motion";
import { setCurrency, useCurrency } from "@/app/_components/use-currency";
import { adjustments, formatPrice, hourly, packages, terms } from "@/lib/rates";

const SPOTS = ["#6ea8ff", "#3ddba5", "#b3a8ff", "#ffc845"];

export function Rates() {
  const currency = useCurrency();
  const choose = setCurrency;

  return (
    <div>
      <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[0.7rem] tracking-wide text-mist uppercase [font-stretch:88%]">Hourly rate</p>
          <p className="mt-2 flex items-baseline gap-3">
            <span
              key={currency}
              className="animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both] bg-gradient-to-r from-glow-aqua via-glow-blue to-glow-violet bg-clip-text font-display text-[clamp(3.2rem,8vw,5.5rem)] leading-none font-semibold tracking-tight text-transparent motion-reduce:animate-none"
            >
              {formatPrice(hourly[currency], currency)}
            </span>
            <span className="font-display text-xl text-mist">/ hour</span>
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-mist">
            For custom features, extra revision rounds and anything outside a package.
            {currency === "NGN" && " Local rate for clients in Nigeria."}
          </p>
        </div>

        <div
          role="group"
          aria-label="Show prices in"
          className="relative grid w-fit grid-cols-2 rounded-full border border-rule bg-surface p-1 font-mono text-xs"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-glow-blue to-glow-violet transition-transform duration-300 ease-out"
            style={{ transform: currency === "NGN" ? "translateX(100%)" : "none" }}
          />
          {(["USD", "NGN"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={currency === c}
              onClick={() => choose(c)}
              className={`relative z-10 rounded-full px-5 py-2 transition-colors ${currency === c ? "text-night" : "text-mist hover:text-snow"}`}
            >
              {c === "USD" ? "USD $" : "NGN ₦"}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {packages.map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className="h-full">
            <Spotlight
              color={SPOTS[i % SPOTS.length]}
              className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 ${
                p.featured ? "border-glow-blue/50 shadow-[0_30px_70px_-40px_#6ea8ff]" : "border-rule"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full border border-glow-blue/40 bg-night px-2.5 py-1 font-mono text-[0.62rem] tracking-wide text-glow-blue uppercase">
                  A good place to start
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm leading-snug text-mist">{p.forWho}</p>
              <p className="mt-5 font-mono text-[0.65rem] tracking-wide text-mist uppercase">Starting at</p>
              <p key={currency} className="animate-[word-in_450ms_cubic-bezier(0.2,0.7,0.2,1)_both] font-display text-3xl font-semibold tracking-tight motion-reduce:animate-none">
                {formatPrice(p.from[currency], currency)}
              </p>
              <p className="mt-1 font-mono text-xs text-mist">{p.timeline}</p>
              <ul className="mt-5 space-y-2 border-t border-rule pt-5 text-[0.95rem] leading-snug">
                {p.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.45em] size-1.5 shrink-0 rounded-full" style={{ background: SPOTS[i % SPOTS.length] }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h3 className="font-display text-lg font-semibold">Your deadline changes the price</h3>
          <ul className="mt-4 space-y-3">
            {adjustments.map((a) => (
              <li key={a.label} className="flex items-start gap-4 rounded-xl border border-rule bg-surface/60 p-4">
                <span
                  className={`font-display text-2xl font-semibold ${a.effect.startsWith("+") ? "text-glow-coral" : "text-glow-aqua"}`}
                >
                  {a.effect}
                </span>
                <span>
                  <span className="block font-semibold">{a.label}</span>
                  <span className="text-sm text-mist">{a.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">How it works</h3>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {terms.map((t) => (
              <li key={t} className="py-3 leading-relaxed text-mist">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
