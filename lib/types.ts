/* Sdílené datové typy (server i prohlížeč). Vše musí být čisté JSON. */

export type VariantId = "kapka" | "vlna" | "ocean";
export type Gender = "zeny" | "muzi";
export type SeasonId = "jaro" | "leto" | "podzim" | "zima";

export type IconKey =
  | "coffee"
  | "flame"
  | "droplet"
  | "droplets"
  | "circleDot"
  | "cylinder"
  | "sparkles"
  | "notebookPen"
  | "hexagon"
  | "glassWater"
  | "gem"
  | "messageCircleHeart"
  | "zap"
  | "cookie"
  | "wind"
  | "leaf"
  | "gift";

export type ModelKey =
  | "tin"
  | "candle"
  | "candleCeramic"
  | "tube"
  | "bottle"
  | "dropper"
  | "balm"
  | "ball"
  | "roller"
  | "foamRoller"
  | "massageGun"
  | "gem"
  | "card"
  | "voucher"
  | "notebook"
  | "honey"
  | "glass"
  | "chocolate";

export type ItemData = {
  name: string;
  detail: string;
  icon: IconKey;
  /** 3D model v animaci boxu */
  model: ModelKey;
};

export type BoxData = {
  id: VariantId;
  name: string;
  tagline: string;
  description: string;
  price: number;
  items: Record<Gender, ItemData[]>;
};

export type Edition = {
  season: SeasonId;
  year: number;
  /** uzávěrka objednávek, ISO datum YYYY-MM-DD */
  deadline: string;
  /** text doručení, např. „leden 2027“ */
  delivery: string;
  /** jsou objednávky otevřené? */
  open: boolean;
};

export type Catalog = {
  boxes: BoxData[];
  edition: Edition;
  updatedAt: string;
};

export type Client = {
  id: string;
  company: string;
  ico: string;
  dic: string;
  street: string;
  city: string;
  zip: string;
  contactName: string;
  email: string;
  phone: string;
  delivery: "kancelar" | "domu";
  /** hash přístupového kódu (scrypt) */
  codeHash: string;
  codeSalt: string;
  createdAt: string;
};

/** Klient bez citlivých polí (posílá se do prohlížeče). */
export type PublicClient = Omit<Client, "codeHash" | "codeSalt">;

export type OrderStatus =
  | "nova"
  | "potvrzena"
  | "zaplacena"
  | "baleni"
  | "odeslana"
  | "dorucena"
  | "zrusena";

export type OrderLine = { variant: VariantId; zeny: number; muzi: number };

export type Order = {
  id: string;
  number: string;
  clientId: string;
  edition: string;
  createdAt: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  note: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  jmeno: string;
  firma: string;
  email: string;
  pocet: string;
  varianta: string;
  zprava: string;
  handled: boolean;
};
