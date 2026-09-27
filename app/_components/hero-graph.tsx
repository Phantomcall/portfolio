"use client";

import { useEffect, useRef } from "react";
import type { Kind } from "@/lib/prs";

export type GraphPr = { label: string; kind: Kind };

// Bright tints of the ledger colours: this is decoration, not a chart, so it can glow.
const TINT: Record<Kind, string> = {
  feature: "#6ea8ff",
  fix: "#ff8a5b",
  test: "#3ddba5",
  docs: "#b3a8ff",
  ci: "#ffc845",
};

type Branch = {
  x: number; // fork position in world space
  len: number;
  lane: number;
  pr: GraphPr;
  mergedAt: number | null; // time the merge crossed the "now" line
};

const SPEED = 26; // px per second the history scrolls left
const RAMP = 64; // horizontal distance a branch takes to leave or rejoin the trunk
const LANES = [-1, -2, -3, 1, 2];

const smooth = (t: number) => t * t * (3 - 2 * t);

export function HeroGraph({ prs }: { prs: GraphPr[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || prs.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-martian").trim() || "monospace";

    let w = 0;
    let h = 0;
    let trunkY = 0;
    let laneGap = 40;
    let nowX = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      trunkY = h * 0.64;
      laneGap = Math.max(26, Math.min(52, h * 0.085));
      nowX = w * 0.84;
    }
    resize();

    // ---- World state -------------------------------------------------------
    let offset = 0; // how far the world has scrolled
    let nextX = w * 0.15; // world x where the next branch forks
    let prIndex = 0;
    const branches: Branch[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    function spawnUntil(limit: number) {
      while (nextX - offset < limit) {
        const len = 170 + Math.random() * 230;
        // Pick a lane that no still-open branch is using over this span.
        const busy = new Set(branches.filter((b) => b.x + b.len > nextX - 20).map((b) => b.lane));
        const free = LANES.filter((l) => !busy.has(l));
        const lane = free.length ? free[Math.floor(Math.random() * free.length)] : LANES[0];
        branches.push({ x: nextX, len, lane, pr: prs[prIndex % prs.length], mergedAt: null });
        prIndex++;
        nextX += 70 + Math.random() * 120;
      }
    }

    // Pre-fill so the first frame already shows a history, with some merges already done.
    spawnUntil(w + 260);
    for (const b of branches) if (b.x + b.len - offset < nowX) b.mergedAt = -10;

    // ---- Geometry ----------------------------------------------------------
    function branchY(b: Branch, sx: number) {
      const fork = b.x - offset;
      const merge = fork + b.len;
      const laneY = trunkY + b.lane * laneGap;
      let t = 1;
      if (sx < fork + RAMP) t = smooth(Math.max(0, (sx - fork) / RAMP));
      else if (sx > merge - RAMP) t = smooth(Math.max(0, (merge - sx) / RAMP));
      return trunkY + (laneY - trunkY) * t;
    }

    // Lines lean gently toward the pointer.
    function warp(x: number, y: number) {
      if (!pointer.active) return y;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const falloff = Math.exp(-(dx * dx + dy * dy) / (2 * 150 * 150));
      return y + (pointer.y - y) * 0.22 * falloff;
    }

    function nearPointer(x: number, y: number) {
      if (!pointer.active) return 0;
      const d = Math.hypot(x - pointer.x, y - pointer.y);
      return Math.max(0, 1 - d / 110);
    }

    // ---- Drawing -----------------------------------------------------------
    function strokePath(points: [number, number][], color: string, width: number, alpha: number) {
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = width;
      ctx!.beginPath();
      points.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y)));
      ctx!.stroke();
    }

    function dot(x: number, y: number, r: number, color: string, alpha: number) {
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = color;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";

      // Trunk: the main branch everything merges back into.
      const trunk: [number, number][] = [];
      for (let x = -10; x <= w + 10; x += 8) trunk.push([x, warp(x, trunkY)]);
      strokePath(trunk, "#e8ecf5", 7, 0.05);
      strokePath(trunk, "#e8ecf5", 1.6, 0.4);

      // Trunk commits, anchored to the world so they scroll with it.
      const step = 46;
      for (let wx = Math.floor(offset / step) * step; wx - offset < w + step; wx += step) {
        const x = wx - offset;
        const y = warp(x, trunkY);
        const n = nearPointer(x, y);
        dot(x, y, 2.2 + n * 2.5, "#e8ecf5", 0.35 + n * 0.5);
      }

      // "Now" line: branches merge as they cross it.
      ctx!.globalAlpha = 0.14;
      ctx!.strokeStyle = "#e8ecf5";
      ctx!.lineWidth = 1;
      ctx!.setLineDash([3, 6]);
      ctx!.beginPath();
      ctx!.moveTo(nowX, trunkY - laneGap * 3.6);
      ctx!.lineTo(nowX, trunkY + laneGap * 2.6);
      ctx!.stroke();
      ctx!.setLineDash([]);

      for (const b of branches) {
        const fork = b.x - offset;
        const merge = fork + b.len;
        if (merge < -20 || fork > w + 20) continue;

        const color = TINT[b.pr.kind];
        const pending = b.mergedAt === null;
        const points: [number, number][] = [];
        for (let x = fork; x <= merge; x += 6) points.push([x, warp(x, branchY(b, x))]);
        points.push([merge, warp(merge, trunkY)]);

        // Open branches (right of "now") are drawn fainter and dashed.
        if (pending) ctx!.setLineDash([2, 5]);
        strokePath(points, color, 8, pending ? 0.04 : 0.1);
        strokePath(points, color, 1.8, pending ? 0.45 : 0.9);
        ctx!.setLineDash([]);

        // Commits along the branch.
        for (let x = fork + RAMP + 10; x < merge - RAMP; x += 34) {
          const y = warp(x, branchY(b, x));
          const n = nearPointer(x, y);
          dot(x, y, 2.6 + n * 3, color, (pending ? 0.5 : 0.95) * (0.8 + n * 0.2));
          if (n > 0.2) dot(x, y, 9 * n, color, 0.12 * n);
        }

        // Merge node.
        const my = warp(merge, trunkY);
        dot(merge, my, 3.6, color, pending ? 0.4 : 1);

        // Merge pulse and label, just after the branch crosses "now".
        if (b.mergedAt !== null && b.mergedAt > 0) {
          const age = (time - b.mergedAt) / 1000;
          if (age < 1.4) {
            ctx!.globalAlpha = 0.6 * (1 - age / 1.4);
            ctx!.strokeStyle = color;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.arc(merge, my, 4 + age * 26, 0, Math.PI * 2);
            ctx!.stroke();
          }
          // Labels only where there is room beside the text (not on phones).
          if (age < 2.8 && w >= 1024) {
            ctx!.globalAlpha = age < 2 ? 0.95 : 0.95 * (1 - (age - 2) / 0.8);
            ctx!.fillStyle = color;
            ctx!.font = `500 11px ${monoFamily}`;
            ctx!.fillText(`merged ${b.pr.label}`, merge + 10, my + 22);
          }
        }
      }
      ctx!.globalAlpha = 1;
    }

    // ---- Loop --------------------------------------------------------------
    let raf = 0;
    let last = 0;
    let visible = true;

    function frame(time: number) {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      offset += SPEED * dt;
      spawnUntil(w + 260);
      for (const b of branches) {
        if (b.mergedAt === null && b.x + b.len - offset <= nowX) b.mergedAt = time;
      }
      // Drop branches that have scrolled off the left edge.
      while (branches.length && branches[0].x + branches[0].len - offset < -40) branches.shift();
      draw(time);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reduceMotion || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y > -40 && pointer.y < rect.height + 40;
      if (reduceMotion) draw(performance.now());
    };
    const onLeave = () => (pointer.active = false);
    const onResize = () => {
      resize();
      draw(performance.now());
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    draw(performance.now());
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [prs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent_0%,transparent_51%,#000_66%,#000_94%,transparent_100%)] max-lg:opacity-35 max-lg:[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_40%,#000_75%)]"
    />
  );
}
