
export const
  IMAGES: Array<HTMLImageElement> = [],
  TWO_PI = 2 * Math.PI,
  SPRITE_ORG = 128,
  GRID_ORG = 130,
  SCALE = 1,

  MARGIN = 6,
  GRID_SIZE = 130,
  SPRITE_SIZE = 128,
  HALF_SPRITE = (SPRITE_SIZE >> 1),

  FIELD_X = 5,
  FIELD_Y = 5,

  WIDTH = FIELD_X * GRID_SIZE + (FIELD_X - 1) * MARGIN,//537,
  HEIGHT = FIELD_Y * GRID_SIZE + (FIELD_Y - 1) * MARGIN,//809,

  MAX_OBJ = FIELD_X * FIELD_Y,

  GROW_SPEED = 700,
  SHRINK_SPEED = 160,
  MAX_SIZE = SPRITE_SIZE * 1.17,

  MAX_ANIMALS = 100,

  PARTICLES_COUNT = 15,

  RELEASED = 0,
  PRESSED = 1;