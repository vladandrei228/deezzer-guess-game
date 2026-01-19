import { useState } from "react";
import { PlaylistInput } from "./components/PlaylistInput";
import { Game } from "./components/Game";
import type { PlaylistResponse } from "./types/Playlist";
import "./index.css";

export default function App() {
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white gap-30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          🎧 Deezer Guess Game
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Guess the song. Guess the artist. Beat the timer.
        </p>
      </header>

      {/* Main */}
      <main className="w-full max-w-xl">
        {!playlist ? (
          <PlaylistInput onPlaylistLoaded={setPlaylist} />
        ) : (
          <Game
            playlistTracks={playlist.tracks}
            onRestart={() => setPlaylist(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-xs text-center text-zinc-500">
        Built with ❤️ using Deezer API
      </footer>
    </div>
  );
}
