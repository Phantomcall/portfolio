"use client";

import { useSyncExternalStore } from "react";
import {
  CORE,
  DAY_NAMES,
  FLEX,
  TIMEZONE_LABEL,
  WEEK,
  inVisitorTime,
  myTime,
  statusAt,
  type Status,
} from "@/lib/availability";

const STATUS_COPY: Record<Status, { title: string; detail: string; color: string }> = {
  core: {
    title: "Available now",
    detail: "It’s within my core hours, so I’m usually quick to reply.",
    color: "#3ddba5",
  },
  flex: {
    title: "Outside core hours",
    detail: "Evenings and weekends are open by arrangement. Send a message and I’ll confirm a time.",
    color: "#ffc845",
  },
  off: {
    title: "Offline for the night",
    detail: "Leave a message and I’ll pick it up in the morning.",
    color: "#9aa6bf",
  },
};

const pct = (hour: number) => `${(hour / 24) * 100}%`;

// A clock that ticks every 30 seconds. The snapshot is the current 30-second bucket,
// so it stays stable between renders; the server has no clock and renders null.
const TICK = 30_000;
function subscribeClock(notify: () => void) {
  const t = setInterval(notify, TICK);
  return () => clearInterval(t);
}
const readClock = () => Math.floor(Date.now() / TICK) * TICK;
const serverClock = () => null;

export function Availability() {
  const tick = useSyncExternalStore(subscribeClock, readClock, serverClock);
  const now = tick === null ? null : new Date(tick);

  const mine = now ? myTime(now) : null;
  const status = mine ? STATUS_COPY[statusAt(mine.day, mine.hour)] : null;
  const visitorTz = now ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;

  return (
    <div className="grid gap-8 rounded-2xl border border-rule bg-surface p-6 sm:p-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-12">
      <div>
        <p className="font-mono text-[0.7rem] tracking-wide text-mist uppercase [font-stretch:88%]">Right now</p>
        <div aria-live="polite" className="mt-3 min-h-[7.5rem]">
          {status && mine ? (
            <>
              <p className="flex items-center gap-3 font-display text-2xl font-semibold">
                <span
                  aria-hidden
                  className="size-3 animate-pulse-dot rounded-full motion-reduce:animate-none"
                  style={{ background: status.color, color: status.color }}
                />
                {status.title}
              </p>
              <p className="mt-2 leading-relaxed text-mist">{status.detail}</p>
              <p className="mt-4 font-mono text-xs text-mist">
                My time: <span className="text-snow">{mine.label}</span> ({TIMEZONE_LABEL})
              </p>
            </>
          ) : (
            <p className="text-mist">Core hours are Monday to Friday, 9am to 6pm {TIMEZONE_LABEL}.</p>
          )}
        </div>

        <dl className="mt-6 space-y-3 border-t border-rule pt-6">
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wide text-mist uppercase">Core hours</dt>
            <dd className="mt-1">
              Mon–Fri, 9:00–18:00 {TIMEZONE_LABEL}
              {now && visitorTz && (
                <span className="block text-sm text-mist">
                  That’s {inVisitorTime(CORE.start, now)}–{inVisitorTime(CORE.end, now)} where you are ({visitorTz.replace(/_/g, " ")}).
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wide text-mist uppercase">Flexible</dt>
            <dd className="mt-1">
              Evenings and weekends, {FLEX.start}:00–{FLEX.end}:00, by arrangement
            </dd>
          </div>
        </dl>
      </div>

      <figure>
        <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] tracking-wide text-mist uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-5 rounded-full bg-gradient-to-r from-glow-aqua to-glow-blue" /> Core
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-5 rounded-full bg-[repeating-linear-gradient(135deg,#b3a8ff66_0_3px,transparent_3px_6px)] ring-1 ring-glow-violet/40"
            />
            Flexible
          </span>
          <span className="ml-auto">Hours in {TIMEZONE_LABEL}</span>
        </figcaption>

        <ol className="mt-4 space-y-2.5" aria-label="Weekly schedule">
          {WEEK.map((day) => {
            const isCore = CORE.days.includes(day);
            const isToday = mine?.day === day;
            return (
              <li key={day} className="grid grid-cols-[2.5rem_1fr] items-center gap-3">
                <span className={`font-mono text-xs ${isToday ? "text-snow" : "text-mist"}`}>{DAY_NAMES[day]}</span>
                <span className="relative h-5 overflow-hidden rounded-full bg-night ring-1 ring-rule">
                  <span
                    aria-hidden
                    className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,#b3a8ff55_0_3px,transparent_3px_6px)]"
                    style={{ left: pct(FLEX.start), width: pct(FLEX.end - FLEX.start) }}
                  />
                  {isCore && (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 rounded-full bg-gradient-to-r from-glow-aqua to-glow-blue shadow-[0_0_14px_#3ddba566]"
                      style={{ left: pct(CORE.start), width: pct(CORE.end - CORE.start) }}
                    />
                  )}
                  {isToday && mine && (
                    <span
                      aria-hidden
                      className="absolute inset-y-[-2px] w-0.5 bg-snow shadow-[0_0_10px_#fff]"
                      style={{ left: pct(mine.hour) }}
                    />
                  )}
                  <span className="sr-only">
                    {isCore
                      ? `Core hours 9:00 to 18:00, flexible ${FLEX.start}:00 to 9:00 and 18:00 to ${FLEX.end}:00.`
                      : `Flexible, ${FLEX.start}:00 to ${FLEX.end}:00, by arrangement.`}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <div aria-hidden className="mt-2 grid grid-cols-[2.5rem_1fr] gap-3 font-mono text-[0.62rem] text-mist">
          <span />
          <span className="relative h-3">
            {[0, 6, 12, 18, 24].map((h) => (
              <span key={h} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: pct(h) }}>
                {String(h).padStart(2, "0")}
              </span>
            ))}
          </span>
        </div>
      </figure>
    </div>
  );
}
