export const up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis');
};

export const down = (pgm) => {
  pgm.sql('DROP EXTENSION IF EXISTS postgis');
  pgm.sql('DROP EXTENSION IF EXISTS pgcrypto');
};
