import type { RoundResult, Confidence } from "../types/GameResult";

function badge(conf: Confidence) {
  if (conf === "perfect") return "bg-green-600 text-white";
  if (conf === "close") return "bg-yellow-500 text-black";
  return "bg-red-600 text-white";
}

type Props = {
  result: RoundResult;
  onNext: () => void;
};

export function RoundResultCard({ result, onNext }: Props) {
  return (
    <div className="p-4 mt-6 text-sm text-center shadow-inner bg-zinc-900 rounded-xl animate-slide-up">
      <h2 className="mb-3 text-lg font-bold">Round Result</h2>

      <div className="flex items-center justify-between mb-2">
        <span>🎵 {result.correctTitle}</span>
        <span className={`px-2 py-1 rounded ${badge(result.titleConfidence)}`}>
          {result.titleConfidence}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span>🎤 {result.correctArtist}</span>
        <span className={`px-2 py-1 rounded ${badge(result.artistConfidence)}`}>
          {result.artistConfidence}
        </span>
      </div>

      <div className="pt-2 text-left border-t border-zinc-700">
        <p>Base points: {result.titlePoints + result.artistPoints}</p>
        <p>Multiplier: x{result.multiplier}</p>
        <p className="mt-1 font-bold text-green-400">
          +{result.totalPoints} points
        </p>
      </div>

      <button
        className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700 active:scale-95"
        onClick={onNext}
      >
        Next Round
      </button>
    </div>
  );
}
