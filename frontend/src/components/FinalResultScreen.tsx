import type { RoundResult } from "../types/GameResult";

type Props = {
  score: number;
  results: RoundResult[];
  onRestart: () => void;
};

export function FinalResultScreen({ score, results, onRestart }: Props) {
  return (
    <div className="flex items-center justify-center text-white">
      <div className="w-full max-w-md p-6 bg-zinc-800 rounded-2xl animate-fade-in">
        <h1 className="mb-4 text-3xl font-bold text-center">🎉 Game Over</h1>

        <p className="mb-4 text-center text-zinc-400">Final Score</p>
        <p className="mb-6 text-5xl font-bold text-center text-green-400">
          {score}
        </p>

        <div className="space-y-3 overflow-y-auto max-h-64">
          {results.map((r, i) => (
            <div
              key={i}
              className="p-3 text-sm rounded-lg bg-zinc-900"
            >
              <p className="font-semibold">
                {i + 1}. {r.correctTitle} – {r.correctArtist}
              </p>
              <p className="text-zinc-400">
                +{r.totalPoints} pts (x{r.multiplier})
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 mt-6 font-semibold transition bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Try New Playlist
        </button>
      </div>
    </div>
  );
}
