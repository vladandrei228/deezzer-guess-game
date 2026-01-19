import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const playlistId = req.query.playlistId as string;

  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  try {
    const deezerRes = await fetch(
      `https://api.deezer.com/playlist/${playlistId}`
    );

    if (!deezerRes.ok) {
      return res.status(500).json({ error: "Failed to fetch playlist" });
    }

    const data = await deezerRes.json();

    const tracks = data.tracks.data
      .filter((t: any) => t.preview)
      .map((t: any) => ({
        id: t.id,
        preview: t.preview,
        cover: t.album.cover_medium,
        answer: {
          title: t.title,
          artist: t.artist.name,
        },
      }));

    res.status(200).json({
      playlist: {
        id: data.id,
        title: data.title,
      },
      tracks,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
