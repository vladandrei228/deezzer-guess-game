import { useState } from "react";
import { useGame } from "../hooks/useGame";
import type { PlaylistTrack } from "../types/Playlist";
import { FinalResultScreen } from "./FinalResultScreen";
import { RoundResultCard } from "./RoundResultCard";
import { AnimatedScore } from "./AnimatedScore";


type Props = {
  playlistTracks: PlaylistTrack[];
  onRestart: () => void;
};

export function Game({ playlistTracks, onRestart }: Props) {
  const {
    round,
    score,
    track,
    phase,
    secondsLeft,
    multiplier,
    submitGuess,
    nextRound,
    isGameOver,
    maxQuestions,
    lastResult,
    results,
  } = useGame(playlistTracks);

  const [titleGuess, setTitleGuess] = useState("");
  const [artistGuess, setArtistGuess] = useState("");

  if (isGameOver) {
    return <FinalResultScreen   score={score} results={results} onRestart={onRestart} />;
  }

  if (!track) {
    return <p className="text-center text-white">Loading...</p>;
  }

  const inputsDisabled = phase === "submitted";

  return (
    <div className="flex items-center justify-center text-white">
      <div className="relative w-full max-w-md p-6 shadow-xl bg-zinc-800 rounded-2xl animate-fade-in">

        {/* HEADER */}
        <h1 className="mb-1 text-xl font-bold">
          Round {round} / {maxQuestions}
        </h1>

        <p className="mb-2 text-sm text-zinc-400">
  Score:{" "}
  <AnimatedScore
    value={score}
    className="font-semibold text-green-400"
  />
</p>


        <p className="mb-3 text-sm transition-all">
          {phase === "grace" && `🎧 Listen time: ${secondsLeft}s`}
          {phase === "active" && `⏱ ${secondsLeft}s • x${multiplier}`}
          {phase === "submitted" && "✅ Answer submitted"}
        </p>

        {/* COVER */}
        <img
          src={track.cover}
          alt="cover"
          className="mx-auto my-4 transition-transform duration-300 rounded-lg shadow-md hover:scale-105"
        />

        {/* AUDIO */}
        <audio autoPlay controls src={track.preview} className="w-full" />

        {/* INPUTS */}
        <div className="mt-4 space-y-2">
          <input
            className="w-full p-2 border rounded bg-zinc-900 border-zinc-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Song title"
            value={titleGuess}
            disabled={inputsDisabled}
            onChange={(e) => setTitleGuess(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded bg-zinc-900 border-zinc-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Artist name"
            value={artistGuess}
            disabled={inputsDisabled}
            onChange={(e) => setArtistGuess(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        {phase !== "submitted" && (
          <button
            className="w-full py-2 mt-4 transition bg-blue-600 rounded hover:bg-blue-700 active:scale-95"
            onClick={() => submitGuess(titleGuess, artistGuess)}
          >
            Submit
          </button>
        )}

        {/* ROUND RESULT */}
        {phase === "submitted" && lastResult && (
          <RoundResultCard
            result={lastResult}
            onNext={() => {
              setTitleGuess("");
              setArtistGuess("");
              nextRound();
            }}
          />
        )}
      </div>
    </div>
  );
}
