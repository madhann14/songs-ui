export interface Song {
  index: number;
  id: string;
  title: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
  num_bars: number;
  num_sections: number;
  num_segments: number;
  song_class: number;
  rating: number;
}

export interface PaginatedSongsResponse {
  total: number;
  page: number;
  page_size: number;
  songs: Song[];
}
