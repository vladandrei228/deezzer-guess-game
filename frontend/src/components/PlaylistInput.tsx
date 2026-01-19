import { useState } from "react";
import type { PlaylistResponse } from "../types/Playlist";

type Props = {
  onPlaylistLoaded: (playlist: PlaylistResponse) => void;
};

const PRESET_PLAYLISTS = [
  { name: "🔥 Global Hits", id: "3155776842" },
  { name: "🎸 Rock Classics", id: "908622995" },
  { name: "🎧 Chill Vibes", id: "1313621735" },
];

export function PlaylistInput({ onPlaylistLoaded }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function extractPlaylistId(input: string): string | null {
    return input.match(/playlist\/(\d+)/)?.[1] ?? null;
  }

  async function loadPlaylist(id: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/playlist-tracks?playlistId=${id}`
);


      if (!res.ok) throw new Error();
      const data: PlaylistResponse = await res.json();
      onPlaylistLoaded(data);
    } catch {
      setError("Could not load playlist");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    const id = extractPlaylistId(url);
    if (!id) {
      setError("Invalid Deezer playlist URL");
      return;
    }
    loadPlaylist(id);
  }

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 text-white shadow-xl bg-zinc-800 rounded-3xl">
        <h1 className="mb-4 text-3xl font-bold text-center">
          🎶 Choose a Playlist
        </h1>

        <input
          className="w-full h-12 px-4 mb-3 border rounded-xl bg-zinc-900 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste Deezer playlist URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full h-12 mb-4 transition bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          {loading ? "Loading…" : "Start Game"}
        </button>

        <p className="mb-2 text-sm text-center text-zinc-400">
          Or try one of these:
        </p>

        <div className="space-y-2">
          {PRESET_PLAYLISTS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPlaylist(p.id)}
              className="w-full px-4 py-2 text-left transition rounded-lg bg-zinc-700 hover:bg-zinc-600"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
