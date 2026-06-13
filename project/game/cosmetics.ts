export interface Cosmetic {
  id: string;
  name: string;
  price: number;
  borderStyle: BorderStyle;
}

export interface BorderStyle {
  borderWidth: number;
  borderRadius: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  secondBorder?: boolean;
  glowColor?: string;
  glowRadius?: number;
}

export const COSMETICS: Cosmetic[] = [
  {
    id: 'default',
    name: 'Varsayılan',
    price: 0,
    borderStyle: {
      borderWidth: 2,
      borderRadius: 8,
      borderStyle: 'solid',
    },
  },
  {
    id: 'neon_orange',
    name: 'Neon Turuncu',
    price: 50,
    borderStyle: {
      borderWidth: 2,
      borderRadius: 8,
      borderStyle: 'solid',
      glowColor: 'rgba(255, 107, 0, 0.4)',
      glowRadius: 8,
    },
  },
  {
    id: 'sharp_corners',
    name: 'Keskin Köşeler',
    price: 75,
    borderStyle: {
      borderWidth: 3,
      borderRadius: 0,
      borderStyle: 'solid',
    },
  },
  {
    id: 'rounded_soft',
    name: 'Yuvarlatılmış',
    price: 75,
    borderStyle: {
      borderWidth: 2,
      borderRadius: 16,
      borderStyle: 'solid',
    },
  },
  {
    id: 'double_line',
    name: 'Çift Çizgi',
    price: 100,
    borderStyle: {
      borderWidth: 4,
      borderRadius: 8,
      borderStyle: 'solid',
    },
  },
  {
    id: 'glitch',
    name: 'Glitch',
    price: 150,
    borderStyle: {
      borderWidth: 2,
      borderRadius: 4,
      borderStyle: 'dashed',
    },
  },
  {
    id: 'minimal_thin',
    name: 'Minimal İnce',
    price: 150,
    borderStyle: {
      borderWidth: 1,
      borderRadius: 4,
      borderStyle: 'solid',
    },
  },
  {
    id: 'premium_fire',
    name: 'Premium Ateş Turuncusu',
    price: 250,
    borderStyle: {
      borderWidth: 2,
      borderRadius: 10,
      borderStyle: 'solid',
      glowColor: 'rgba(255, 107, 0, 0.6)',
      glowRadius: 12,
    },
  },
];

export function getCosmeticById(id: string): Cosmetic {
  return COSMETICS.find((c) => c.id === id) || COSMETICS[0];
}

export function getDefaultCosmetic(): Cosmetic {
  return COSMETICS[0];
}
