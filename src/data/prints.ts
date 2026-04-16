export type Print = {
  slug: string;
  title: string;
  location: string;
  collection: "balkans" | "wildlife" | "macro";
  collectionLabel: string;
  year: number;
  edition: number;
  sold: number;
  sizes: { label: string; price: number }[];
  story: string;
  camera: string;
  lens: string;
  aspect: "landscape" | "portrait" | "square";
  placeholderColor: string;
};

export const prints: Print[] = [
  {
    slug: "kotor-dawn",
    title: "Kotor Dawn",
    location: "Kotor, Montenegro",
    collection: "balkans",
    collectionLabel: "The Balkans",
    year: 2026,
    edition: 50,
    sold: 12,
    sizes: [
      { label: '12"×18"', price: 150 },
      { label: '20"×30"', price: 280 },
      { label: '30"×45"', price: 420 },
    ],
    story: "Found this view at 5am after climbing the old city walls in complete darkness. The bay was perfectly still — not a boat moving, not a sound. The light lasted maybe four minutes.",
    camera: "Nikon Z7 II",
    lens: "24–70mm f/2.8",
    aspect: "landscape",
    placeholderColor: "#1a1f2e",
  },
  {
    slug: "moth-wing",
    title: "Moth Wing",
    location: "Kotor, Montenegro",
    collection: "macro",
    collectionLabel: "Macro",
    year: 2026,
    edition: 30,
    sold: 8,
    sizes: [
      { label: '12"×12"', price: 180 },
      { label: '20"×20"', price: 320 },
      { label: '30"×30"', price: 480 },
    ],
    story: "A moth resting on a stone wall at dusk. At this magnification you stop seeing an insect and start seeing architecture — scales like roof tiles, each one placed with impossible precision.",
    camera: "Nikon Z7 II",
    lens: "105mm Macro f/2.8",
    aspect: "square",
    placeholderColor: "#1c1a10",
  },
  {
    slug: "red-fox-snowfield",
    title: "Red Fox, Snowfield",
    location: "Julian Alps, Slovenia",
    collection: "wildlife",
    collectionLabel: "Wild",
    year: 2025,
    edition: 40,
    sold: 31,
    sizes: [
      { label: '12"×18"', price: 175 },
      { label: '20"×30"', price: 310 },
      { label: '30"×45"', price: 460 },
    ],
    story: "Three hours in the snow before this fox appeared. She moved across the field without looking once in my direction — completely indifferent to my existence. I had exactly one clear frame.",
    camera: "Nikon Z7 II",
    lens: "500mm f/5.6 PF",
    aspect: "landscape",
    placeholderColor: "#1a1a1a",
  },
  {
    slug: "adriatic-fisherman",
    title: "Adriatic Fisherman",
    location: "Perast, Montenegro",
    collection: "balkans",
    collectionLabel: "The Balkans",
    year: 2026,
    edition: 50,
    sold: 4,
    sizes: [
      { label: '12"×16"', price: 145 },
      { label: '20"×27"', price: 265 },
      { label: '30"×40"', price: 395 },
    ],
    story: "The island of St. George appears at dawn as a dark silhouette against a copper sky. The fisherman had already been out for two hours when I found this spot.",
    camera: "Nikon Z7 II",
    lens: "70–200mm f/2.8",
    aspect: "portrait",
    placeholderColor: "#1f1812",
  },
  {
    slug: "dew-on-spider",
    title: "Dew on Spider",
    location: "Budva, Montenegro",
    collection: "macro",
    collectionLabel: "Macro",
    year: 2026,
    edition: 25,
    sold: 7,
    sizes: [
      { label: '10"×10"', price: 160 },
      { label: '18"×18"', price: 290 },
      { label: '24"×24"', price: 420 },
    ],
    story: "Early morning before the heat burns off the dew. Each drop refracts the entire garden. This particular spider had built her web between two lavender branches — the background bokeh took care of itself.",
    camera: "Nikon Z7 II",
    lens: "105mm Macro f/2.8",
    aspect: "square",
    placeholderColor: "#101a12",
  },
  {
    slug: "old-city-gate",
    title: "Old City Gate",
    location: "Kotor, Montenegro",
    collection: "balkans",
    collectionLabel: "The Balkans",
    year: 2026,
    edition: 50,
    sold: 19,
    sizes: [
      { label: '12"×18"', price: 150 },
      { label: '20"×30"', price: 280 },
      { label: '30"×45"', price: 420 },
    ],
    story: "The Sea Gate has stood since 1555. Photographed during the blue hour when the stone takes on a warmth the midday sun never allows. The only figure in the frame walked through entirely by accident.",
    camera: "Nikon Z7 II",
    lens: "24–70mm f/2.8",
    aspect: "portrait",
    placeholderColor: "#1a1510",
  },
];

export const collections = [
  { slug: "all", label: "All" },
  { slug: "balkans", label: "The Balkans" },
  { slug: "wildlife", label: "Wild" },
  { slug: "macro", label: "Macro" },
];
