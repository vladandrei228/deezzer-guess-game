export type Confidence = "perfect" | "close" | "wrong";

export type RoundResult = {
  correctTitle: string;
  correctArtist: string;

  titleConfidence: Confidence;
  artistConfidence: Confidence;

  titlePoints: number;
  artistPoints: number;

  multiplier: number;
  totalPoints: number;
};
