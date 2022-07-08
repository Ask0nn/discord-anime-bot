type AniModel = {
  id: BigInt;
  code: string;
  names: { ru: string; en: string; alternative: string };
  announce: string;
  status: { string: string; code: number };
  posters: PosterModel;
  type: {
    full_string: string;
    code: number;
    string: string;
    series: number;
    length: number;
  };
  genres: Array<string>;
  team: object;
  season: { string: string; code: number; year: number; week_day: number };
  description: string;
  in_favorites: number;
  blocked: { blocked: boolean; bakanim: boolean };
  player: object;
  torrents: object;
}
