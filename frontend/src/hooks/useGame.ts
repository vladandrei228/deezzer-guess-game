import { useEffect, useRef, useState } from "react";
import type { PlaylistTrack } from "../types/Playlist";
import type { RoundResult, Confidence } from "../types/GameResult";
import { normalize, similarity } from "../utils/stringSimilarity";

/* ================== CONFIG ================== */

const MAX_QUESTIONS = 5;
const GRACE_SECONDS = 5;
const ACTIVE_SECONDS = 30;
const MAX_MULTIPLIER = 4;
const MULTIPLIER_DECAY = 0.1;

type Phase = "grace" | "active" | "submitted";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getConfidence(
  value: number,
  perfect: number,
  close: number
): Confidence {
  if (value >= perfect) return "perfect";
  if (value >= close) return "close";
  return "wrong";
}

/* ================== HOOK ================== */

export function useGame(tracks: PlaylistTrack[]) {
  const [playableTracks] = useState(() =>
    shuffle(tracks).slice(0, MAX_QUESTIONS)
  );

  const [trackIndex, setTrackIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);


  const [phase, setPhase] = useState<Phase>("grace");
  const [secondsLeft, setSecondsLeft] = useState(GRACE_SECONDS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = playableTracks[trackIndex] ?? null;
  const isGameOver = trackIndex >= playableTracks.length;

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function getMultiplier() {
    if (phase !== "active") return 1;
    const elapsed = ACTIVE_SECONDS - secondsLeft;
    return Math.max(
      1,
      +(MAX_MULTIPLIER - elapsed * MULTIPLIER_DECAY).toFixed(1)
    );
  }

  /* ================== ROUND INIT ================== */

  useEffect(() => {
    clearTimer();
    if (isGameOver || !track) return;

    queueMicrotask(() => {
      setPhase("grace");
      setSecondsLeft(GRACE_SECONDS);
      setLastResult(null);
    });
  }, [trackIndex, isGameOver, track]);

  /* ================== SUBMIT ================== */

  function submitGuess(titleGuess: string, artistGuess: string) {
    if (!track || phase === "submitted") return;

    clearTimer();
    setPhase("submitted");

    const titleSim = similarity(
      normalize(titleGuess),
      normalize(track.answer.title)
    );

    const artistSim = similarity(
      normalize(artistGuess),
      normalize(track.answer.artist)
    );

    const titleConfidence = getConfidence(titleSim, 0.9, 0.75);
    const artistConfidence = getConfidence(artistSim, 0.9, 0.8);

    const titlePoints = titleConfidence !== "wrong" ? 50 : 0;
    const artistPoints = artistConfidence !== "wrong" ? 50 : 0;

    const basePoints = titlePoints + artistPoints;
    const multiplier = getMultiplier();
    const totalPoints = Math.round(basePoints * multiplier);

    setScore((s) => s + totalPoints);

    setLastResult({
      correctTitle: track.answer.title,
      correctArtist: track.answer.artist,
      titleConfidence,
      artistConfidence,
      titlePoints,
      artistPoints,
      multiplier,
      totalPoints,
    });

    setResults((r) => [...r, {
  correctTitle: track.answer.title,
  correctArtist: track.answer.artist,
  titleConfidence,
  artistConfidence,
  titlePoints,
  artistPoints,
  multiplier,
  totalPoints,
}]);

  }

  function autoSubmit() {
    submitGuess("", "");
  }

  function nextRound() {
    clearTimer();
    setTrackIndex((i) => i + 1);
    setRound((r) => r + 1);
  }

  /* ================== TIMERS ================== */

  useEffect(() => {
    if (phase !== "grace") return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimer();
          setPhase("active");
          setSecondsLeft(ACTIVE_SECONDS);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase]);

  useEffect(() => {
    if (phase !== "active") return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimer();
          autoSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase]);

  return {
    round,
    score,
    track,
    phase,
    secondsLeft,
    multiplier: getMultiplier(),
    submitGuess,
    nextRound,
    isGameOver,
    maxQuestions: playableTracks.length,
    lastResult,
    results,
  };
}
