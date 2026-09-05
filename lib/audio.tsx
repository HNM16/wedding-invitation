"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import wedding from "@/data/wedding";
import { useMediaAvailability } from "@/lib/media";

const STORAGE_KEY = "sino-sayora:music";
const TARGET_VOLUME = 0.55;
const FADE_MS = 1400;
const FADE_STEP_MS = 50;

type AudioValue = {
  /** False while the music file is absent — the control hides itself. */
  available: boolean;
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
};

const AudioContext = createContext<AudioValue | null>(null);

/**
 * Owns the single <audio> element for the whole site, so the opening veil and
 * the floating control share one source of truth and playback survives every
 * re-render. The intent (playing / paused) is remembered for the session.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const { audio: available } = useMediaAvailability();

  const elementRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  /** Ramps the volume so the music never cuts in or out abruptly. */
  const fadeTo = useCallback(
    (target: number, onDone?: () => void) => {
      const el = elementRef.current;
      if (!el) return;
      clearFade();

      const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
      const delta = (target - el.volume) / steps;
      let i = 0;

      fadeRef.current = window.setInterval(() => {
        const audio = elementRef.current;
        if (!audio) return clearFade();
        i += 1;
        audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
        if (i >= steps) {
          audio.volume = target;
          clearFade();
          onDone?.();
        }
      }, FADE_STEP_MS);
    },
    [clearFade],
  );

  const play = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    el.volume = 0;
    el.play()
      .then(() => {
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, "on");
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* Autoplay refused by the browser — never fight it, stay paused. */
        setPlaying(false);
      });
  }, [fadeTo]);

  const pause = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    fadeTo(0, () => elementRef.current?.pause());
    setPlaying(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "off");
    } catch {
      /* ignore */
    }
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [pause, play, playing]);

  /* Restore the session's choice once the file is confirmed present. A browser
     may still refuse to start without a gesture; `play()` handles that. */
  useEffect(() => {
    if (!available) return;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "on") play();
    } catch {
      /* ignore */
    }
  }, [available, play]);

  useEffect(() => clearFade, [clearFade]);

  const value = useMemo<AudioValue>(
    () => ({ available, playing, play, pause, toggle }),
    [available, playing, play, pause, toggle],
  );

  return (
    <AudioContext.Provider value={value}>
      {available ? (
        <audio
          ref={elementRef}
          src={wedding.media.audio}
          loop
          preload="auto"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
