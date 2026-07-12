export interface ShowcaseItem {
  title: string;
  site: string;
  href: string;
  gradient: string;
}

export const showcaseItems: ShowcaseItem[] = [
  { title: "Studio Nord — Portfolio 2025", site: "studio-nord.example", href: "#", gradient: "linear-gradient(135deg,#7c5cff,#241f3d)" },
  { title: "Nova Interactive", site: "nova.example", href: "#", gradient: "linear-gradient(135deg,#ff6b4a,#241f3d)" },
  { title: "Atlas Type Foundry", site: "atlas-type.example", href: "#", gradient: "linear-gradient(135deg,#47bfff,#1c1a2b)" },
  { title: "Kinetic Museum", site: "kinetic-museum.example", href: "#", gradient: "linear-gradient(135deg,#22c55e,#1c1a2b)" },
  { title: "Loop Studio", site: "loop.example", href: "#", gradient: "linear-gradient(135deg,#eab308,#241f3d)" },
  { title: "Drift Agency", site: "drift.example", href: "#", gradient: "linear-gradient(135deg,#ec4899,#1c1a2b)" },
];
