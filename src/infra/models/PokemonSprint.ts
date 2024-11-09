export interface SprintImage {
  front_default: string;
  front_female?: string;
  front_shiny?: string;
  front_shiny_female?: string;
  back_default?: string;
  back_female?: string;
  back_shiny?: string;
  back_shiny_female?: string;
}

export interface SprintOthers {
  dream_world: Pick<SprintImage, 'front_default' | 'front_female'>;
  home: Pick<SprintImage, 'front_default' | 'front_female' | 'front_shiny' | 'front_shiny_female'>;
  'official-artwork': Pick<SprintImage, 'front_default' | 'front_shiny'>;
  showdown: SprintImage;
}
