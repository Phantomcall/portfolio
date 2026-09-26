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

  return (
    <figure className="rounded-lg border border-rule bg-panel">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-4 py-3 font-mono text-[0.68rem] tracking-wide text-graphite uppercase [font-stretch:88%] sm:px-5">
        <span>{total} merged pull requests</span>
        <span>Oldest first · each mark opens its PR</span>
      </figcaption>

      <div
        role="group"
        aria-label={`${total} merged pull requests, grouped by kind. Use arrow keys to move between them.`}
        onKeyDown={onKeyDown}
        className="px-4 sm:px-5"
      >
        {rows.map((row, r) => (
          <div
            key={row.kind}
            className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-t border-rule py-3 first:border-t-0 sm:grid-cols-[9.5rem_2.25rem_1fr] sm:items-start"
          >
            <span className="flex items-center gap-2 font-display text-[0.95rem] font-semibold leading-none sm:pt-px">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[2px]" style={{ background: kindColor(row.kind) }} />
              {row.label}
            </span>
            <span className="text-right font-mono text-xs text-graphite tabular-nums sm:pt-px">{row.prs.length}</span>
            <ul className="col-span-2 flex flex-wrap gap-[3px] sm:col-span-1">
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
                      className={`mark block size-[13px] rounded-[2px] transition-transform duration-150 hover:scale-125 focus-visible:outline-offset-2 sm:size-[11px] ${
                        isActive ? "scale-125 outline-2 outline-offset-1 outline-ink" : ""
                      }`}
                      style={{ background: kindColor(row.kind), "--i": pr.i } as CSSProperties}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid min-h-[8.5rem] content-start gap-1.5 border-t border-rule px-4 py-4 sm:min-h-[7.5rem] sm:px-5">
        <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-wide text-graphite uppercase [font-stretch:88%]">
          <span aria-hidden className="size-2 rounded-[2px]" style={{ background: kindColor(activeRow.kind) }} />
          {isLatest ? "Latest merge" : activeRow.label} · {activePr.date}
        </p>
        <p className="line-clamp-2 font-display text-lg leading-snug font-semibold text-balance">{activePr.title}</p>
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs text-graphite">
          <span>{activePr.repo}</span>
          <a href={activePr.url} className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
            Open on GitHub ↗
          </a>
        </p>
      </div>
    </figure>
  );
}
