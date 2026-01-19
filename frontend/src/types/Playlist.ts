export type PlaylistTrack = {
    id: number;
    preview: string;
    cover: string;
    answer: {
        title: string;
        artist: string;
    };
}

export type PlaylistResponse = {
    playlist: {
        id: number;
        title: string;
    };
    tracks: PlaylistTrack[];
};