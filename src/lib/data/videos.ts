// Free preview clips from Mixkit (hot-linked for development; replace with compressed self-hosted webm/mp4 in production)
const mk = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-360.mp4`;

export const VIDEOS = {
  party: [49097, 49096, 49095, 51771, 51770, 42324, 1240, 1228, 1234, 51283, 51275, 51287, 50433].map(mk),
  wedding: [51230, 51231, 51260, 51232, 51233, 51228, 51229].map(mk),
  cafe: [51257, 51252, 51255, 51258, 51256, 42944, 51253].map(mk),
  urban: [1231, 1232, 1227, 1229, 1226, 44694, 1238, 1237, 44691].map(mk),
  kids: [48598, 1226, 47330, 47324].map(mk),
  product: [50800, 50799, 18365, 42944].map(mk),
};

export const ALL_VIDEOS = Array.from(new Set(Object.values(VIDEOS).flat()));
