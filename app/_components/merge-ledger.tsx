"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import type { Kind } from "@/lib/prs";

export type LedgerPr = {
  title: string;
  url: string;
  repo: string;
  date: string;
  /** Position in merge order across all rows, oldest first. Drives the load animation. */
  i: number;
};

export type LedgerRow = { kind: Kind; label: string; prs: LedgerPr[] };

type Pos = { row: number; col: number };

const kindColor = (kind: Kind) => `var(--color-k-${kind})`;

export function MergeLedger({ rows, latest }: { rows: LedgerRow[]; latest: Pos }) {
  const [active, setActive] = useState<Pos>(latest);
  const [run, setRun] = useState(0);
  const marks = useRef(new Map<string, HTMLAnchorElement>());
  const lastPointer = useRef<string>("mouse");

  const total = rows.reduce((n, r) => n + r.prs.length, 0);
  const activeRow = rows[active.row];
  const activePr = activeRow.prs[active.col];
  const isLatest = active.row === latest.row && active.col === latest.col;

  function moveTo(pos: Pos) {
    setActive(pos);
    marks.current.get(`${pos.row}-${pos.col}`)?.focus();
  }

  // Roving focus: one tab stop for the whole ledger, arrow keys move between marks.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const { row, col } = active;
    const len = rows[row].prs.length;
    const lastRow = rows.length - 1;
    const sameShare = (to: number) =>
      Math.min(rows[to].prs.length - 1, Math.round((col / Math.max(len - 1, 1)) * (rows[to].prs.length - 1)));

    let next: Pos | null = null;
    switch (e.key) {
      case "ArrowRight":
        next = col < len - 1 ? { row, col: col + 1 } : row < lastRow ? { row: row + 1, col: 0 } : null;
        break;
      case "ArrowLeft":
        next = col > 0 ? { row, col: col - 1 } : row > 0 ? { row: row - 1, col: rows[row - 1].prs.length - 1 } : null;
        break;
      case "ArrowDown":
        next = row < lastRow ? { row: row + 1, col: sameShare(row + 1) } : null;
        break;
      case "ArrowUp":
        next = row > 0 ? { row: row - 1, col: sameShare(row - 1) } : null;
        break;
      case "Home":
        next = { row, col: 0 };
        break;
      case "End":
        next = { row, col: len - 1 };
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next) moveTo(next);
  }

  // On touch there's no hover, so the first tap shows a PR and the second opens it.
  function onMarkClick(e: MouseEvent<HTMLAnchorElement>, pos: Pos) {
    const alreadyShown = pos.row === active.row && pos.col === active.col;
    if (lastPointer.current === "touch" && !alreadyShown) {
      e.preventDefault();
      setActive(pos);
    }
  }

  function replay() {
    setActive(latest);
    setRun((n) => n + 1);
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-rule bg-surface/80 shadow-[0_30px_80px_-40px_#3987e566] backdrop-blur">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule px-4 py-3 font-mono text-[0.68rem] tracking-wide text-mist uppercase [font-stretch:88%] sm:px-6">
        <span>
          <span className="text-snow">{total}</span> merged pull requests · oldest first
        </span>
        <button
          type="button"
          onClick={replay}
          className="group inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 uppercase transition-colors hover:border-glow-blue hover:text-snow"
        >
          <span aria-hidden className="inline-block transition-transform duration-500 group-hover:-rotate-180">
            ↺
          </span>
          Replay history
        </button>
      </figcaption>

      <div
        key={run}
        role="group"
        aria-label={`${total} merged pull requests, grouped by kind. Use arrow keys to move between them.`}
        onKeyDown={onKeyDown}
        className="px-4 sm:px-6"
      >
        {rows.map((row, r) => (
          <div
            key={row.kind}
            className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-t border-rule/70 py-3.5 first:border-t-0 sm:grid-cols-[10rem_2.5rem_1fr] sm:items-start"
          >
            <span className="flex items-center gap-2 font-display text-[0.95rem] font-semibold leading-none sm:pt-px">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ background: kindColor(row.kind), boxShadow: `0 0 10px ${kindColor(row.kind)}` }}
              />
              {row.label}
            </span>
            <span className="text-right font-mono text-xs text-mist tabular-nums sm:pt-px">{row.prs.length}</span>
            <ul className="col-span-2 flex flex-wrap gap-[4px] sm:col-span-1">
              {row.prs.map((pr, c) => {
                const isActive = r === active.row && c === active.col;
                return (
                  <li key={pr.url} className="flex">
                    <a
                      ref={(el) => {
                        if (el) marks.current.set(`${r}-${c}`, el);
                        else marks.current.delete(`${r}-${c}`);
                      }}
                      href={pr.url}
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`${pr.title}. ${pr.repo}, merged ${pr.date}.`}
                      onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                      onMouseEnter={() => setActive({ row: r, col: c })}
                      onFocus={() => setActive({ row: r, col: c })}
                      onClick={(e) => onMarkClick(e, { row: r, col: c })}
                      className={`mark block size-[14px] rounded-[3px] transition-[scale,box-shadow] duration-200 hover:scale-150 sm:size-3 ${
                        isActive ? "scale-150 outline-2 outline-offset-2 outline-snow" : ""
                      }`}
                      style={
                        {
                          background: kindColor(row.kind),
                          boxShadow: isActive ? `0 0 16px 2px ${kindColor(row.kind)}` : undefined,
                          "--i": pr.i,
                        } as CSSProperties
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid min-h-[9rem] content-start gap-2 border-t border-rule bg-night/50 px-4 py-4 sm:min-h-[8rem] sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-wide text-mist uppercase [font-stretch:88%]">
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ background: kindColor(activeRow.kind), boxShadow: `0 0 8px ${kindColor(activeRow.kind)}` }}
          />
          {isLatest ? "Latest merge" : activeRow.label} · {activePr.date}
        </p>
        <p className="line-clamp-2 font-display text-lg leading-snug font-semibold text-balance sm:text-xl">{activePr.title}</p>
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs text-mist">
          <span>{activePr.repo}</span>
          <a
            href={activePr.url}
            className="text-glow-gold underline decoration-glow-gold/40 underline-offset-4 hover:decoration-glow-gold"
          >
            Open on GitHub ↗
          </a>
        </p>
      </div>
    </figure>
  );
}
