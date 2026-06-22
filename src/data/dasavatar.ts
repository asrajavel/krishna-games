export interface DasavatarItem {
  id: string;
  name: string;
  image: string;
}

export const DASAVATAR_ITEMS: DasavatarItem[] = [
  { id: "matsya", name: "Matsya", image: "./dasavatar/matsya.png" },
  { id: "kurma", name: "Kurma", image: "./dasavatar/kurma.png" },
  { id: "varaha", name: "Varaha", image: "./dasavatar/varaha.png" },
  { id: "narasimha", name: "Narasimha", image: "./dasavatar/narasimha.png" },
  { id: "vamana", name: "Vamana", image: "./dasavatar/vamana.png" },
  { id: "parashurama", name: "Parashurama", image: "./dasavatar/parashurama.png" },
  { id: "rama", name: "Ram", image: "./dasavatar/rama.png" },
  { id: "balaram", name: "Balaram", image: "./dasavatar/balaram.png" },
  { id: "buddha", name: "Buddha", image: "./dasavatar/buddha.png" },
  { id: "kalki", name: "Kalki", image: "./dasavatar/kalki.png" },
];

export function shuffleDasavatarItems(): DasavatarItem[] {
  return [...DASAVATAR_ITEMS].sort(() => Math.random() - 0.5);
}
