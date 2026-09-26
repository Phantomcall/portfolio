"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties, type PointerEvent } from "react";

// Frames are 16:10, so a 1440px-wide shot fills one frame at 900px of height.
const FRAME_HEIGHT_AT_1440 = 900;

/**
 * A browser-style frame around a full-page screenshot. It tilts toward the
 * pointer, and on hover (or when a link in the project has focus) the
 * screenshot scrolls through the whole page.
 */
export function ProjectFrame({
  image,
  alt,
  accent,
  url,
}: {
  image: StaticImageData;
  alt: string;
  accent: string;
  url?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const extraScreens = Math.max(0, image.height / FRAME_HEIGHT_AT_1440 - 1);
  const pan = `${(extraScreens * 2.6).toFixed(1)}s`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 6}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  }
  function onLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="[perspective:1400px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group/frame relative rounded-xl border border-rule bg-surface transition-[transform,box-shadow] duration-500 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:[transform:none]"
        style={
          {
            "--pan": pan,
            boxShadow: `0 40px 90px -50px ${accent}aa, 0 0 0 1px ${accent}14`,
          } as CSSProperties
        }
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-rule px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
          </span>
          {url && (
            <span className="truncate rounded-md bg-night/70 px-3 py-1 font-mono text-[0.65rem] text-mist">
              {url.replace(/^https:\/\//, "").replace(/\/$/, "")}
            </span>
          )}
          {extraScreens > 0 && (
            <span className="ml-auto hidden font-mono text-[0.62rem] tracking-wide text-mist/80 uppercase transition-opacity group-hover/frame:opacity-0 sm:block">
              Hover to scroll
            </span>
          )}
        </div>
        <div className="frame relative aspect-[16/10] overflow-hidden rounded-b-xl">
          <Image
            src={image}
            alt={alt}
            sizes="(min-width: 1024px) 660px, 100vw"
            placeholder="blur"
            className="frame-shot absolute inset-x-0 top-0 h-auto w-full"
          />
          {/* Glare that follows the pointer. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/frame:opacity-100"
            style={{
              background: `radial-gradient(600px circle at var(--gx,50%) var(--gy,50%), ${accent}22, transparent 45%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
