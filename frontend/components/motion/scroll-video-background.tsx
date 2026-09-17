"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LAST_FRAME_EPSILON = 0.05;

export type ScrollVideoRange = {
  /** Absolute scroll position in pixels, unless startSelector is provided. */
  start?: number;
  /** Absolute scroll position in pixels, unless endSelector is provided. */
  end?: number;
  /** The top edge of this element becomes the scrub start. */
  startSelector?: string;
  /** The bottom edge of this element aligned with the viewport becomes the scrub end. */
  endSelector?: string;
};

type ScrollVideoBackgroundProps = {
  src: string;
  poster?: string;
  subjectPosition?: string;
  range?: ScrollVideoRange;
};

type ScrollBounds = {
  start: number;
  end: number;
};

// Keep a value inside the playable scroll interval so the first and last frame remain deterministic.
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Resolve absolute document coordinates from optional selectors while keeping the whole page as the default range.
function getScrollBounds(range: ScrollVideoRange): ScrollBounds {
  const scrollLimit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const startElement = range.startSelector ? document.querySelector<HTMLElement>(range.startSelector) : null;
  const endElement = range.endSelector ? document.querySelector<HTMLElement>(range.endSelector) : null;
  const start = startElement ? startElement.getBoundingClientRect().top + window.scrollY : range.start ?? 0;
  const end = endElement
    ? endElement.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
    : range.end ?? scrollLimit;
  const safeStart = clamp(start, 0, scrollLimit);

  return {
    start: safeStart,
    end: Math.max(safeStart, clamp(end, safeStart, scrollLimit)),
  };
}

// A paused video acts as a visual layer; the scroll position is the only clock that advances it.
export function ScrollVideoBackground({ src, poster = "/brand/about-byjhor.png", subjectPosition = "50% 50%", range = {} }: Readonly<ScrollVideoBackgroundProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRequestRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const boundsRef = useRef<ScrollBounds>({ start: 0, end: 0 });
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  // Read the preference before mounting the video so reduced-motion users keep the static fallback only.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Schedule one frame at a time and read the newest scroll position when it runs, dropping stale seek requests.
  const scheduleSync = useCallback(() => {
    if (frameRequestRef.current !== null) return;

    frameRequestRef.current = window.requestAnimationFrame(() => {
      frameRequestRef.current = null;
      const video = videoRef.current;
      const duration = durationRef.current;

      if (!video || !duration || boundsRef.current.end <= boundsRef.current.start) return;

      const { start, end } = boundsRef.current;
      const progress = clamp((window.scrollY - start) / (end - start), 0, 1);
      const targetTime = progress >= 1 ? Math.max(0, duration - LAST_FRAME_EPSILON) : progress * duration;

      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    });
  }, []);

  // Bind scroll, resize, content-size and metadata events, then remove every observer and pending frame on teardown.
  useEffect(() => {
    if (reducedMotion !== false || hasError) return;

    const video = videoRef.current;
    if (!video) return;

    const refreshBounds = () => {
      boundsRef.current = getScrollBounds(range);
      scheduleSync();
    };
    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
        refreshBounds();
      }
    };
    const handleResize = () => refreshBounds();
    const resizeObserver = new ResizeObserver(handleResize);
    const mutationObserver = new MutationObserver(handleResize);

    boundsRef.current = getScrollBounds(range);
    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", scheduleSync);
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    scheduleSync();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", scheduleSync);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (frameRequestRef.current !== null) {
        window.cancelAnimationFrame(frameRequestRef.current);
        frameRequestRef.current = null;
      }
    };
  }, [hasError, range, reducedMotion, scheduleSync]);

  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper">
    <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url(${poster})`, backgroundPosition: subjectPosition }} />
    {!hasError && reducedMotion === false && <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-80" style={{ objectPosition: subjectPosition }} src={src} poster={poster} preload="auto" muted playsInline tabIndex={-1} />}
    <div className="absolute inset-0 bg-paper/55" />
  </div>;
}
