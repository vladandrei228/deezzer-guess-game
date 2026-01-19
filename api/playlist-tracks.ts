import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
    // ✅ CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // ✅ Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    
    const playlistId = req.query.playlistId;

    if (!playlistId || typeof playlistId !== 'string') {
        return res.status(400).json({ error: "Invalid or missing playlistId" });
    }

    try{
        const response = await fetch(
      `https://api.deezer.com/playlist/${playlistId}`
    );
    const data = await response.json();

    if (!data.tracks || !data.tracks.data) {
      return res.status(404).json({
        error: "Playlist not found or has no tracks"
      });
    }

    // ✅ Clean & filter tracks
    const tracks = data.tracks.data
      .filter((track: any) => track.preview)
      .map((track: any) => ({
        id: track.id,
        preview: track.preview,
        cover: track.album.cover_medium,
        answer: {
          title: track.title.toLowerCase(),
          artist: track.artist.name.toLowerCase()
        }
      }));

    if (tracks.length === 0) {
      return res.status(404).json({
        error: "No playable tracks (no previews)"
      });
    }

    res.status(200).json({
      playlist: {
        id: data.id,
        title: data.title
      },
      tracks
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch playlist"
    });
  }
}