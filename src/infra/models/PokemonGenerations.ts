interface Sprite {
  back_default: string | null;
  back_gray?: string | null;
  back_transparent?: string | null;
  back_shiny?: string | null;
  back_female?: string | null;
  back_shiny_female?: string | null;
  front_default: string | null;
  front_gray?: string | null;
  front_transparent?: string | null;
  front_shiny?: string | null;
  front_female?: string | null;
  front_shiny_female?: string | null;
}

interface AnimatedSprite extends Sprite {
  back_default: string | null;
  front_default: string | null;
  front_shiny: string | null;
  front_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
}

interface GenerationI {
  'red-blue': Sprite;
  yellow: Sprite;
}

interface GenerationII {
  crystal: Sprite;
  gold: Sprite;
  silver: Sprite;
}

interface GenerationIII {
  emerald: Pick<Sprite, 'front_default' | 'front_shiny'>;
  'firered-leafgreen': Sprite;
  'ruby-sapphire': Sprite;
}

interface GenerationIV {
  'diamond-pearl': Sprite;
  'heartgold-soulsilver': Sprite;
  platinum: Sprite;
}

interface GenerationV {
  'black-white': Sprite & { animated: AnimatedSprite };
}

interface GenerationVI {
  'omegaruby-alphasapphire': Pick<Sprite, 'front_default' | 'front_shiny' | 'front_female' | 'front_shiny_female'>;
  'x-y': Pick<Sprite, 'front_default' | 'front_shiny' | 'front_female' | 'front_shiny_female'>;
}

export interface Generations {
  'generation-i': GenerationI;
  'generation-ii': GenerationII;
  'generation-iii': GenerationIII;
  'generation-iv': GenerationIV;
  'generation-v': GenerationV;
  'generation-vi': GenerationVI;
}
