export const up = (pgm) => {
  pgm.sql(`
    CREATE TYPE pet_status AS ENUM ('draft', 'lost', 'found', 'reunited', 'archived');

    CREATE TABLE pets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      type TEXT NOT NULL CHECK (length(trim(type)) > 0),
      breed TEXT,
      color TEXT NOT NULL CHECK (length(trim(color)) > 0),
      description TEXT NOT NULL CHECK (length(trim(description)) > 0),
      image_url TEXT NOT NULL,
      status pet_status NOT NULL DEFAULT 'draft',
      location_description TEXT NOT NULL CHECK (length(trim(location_description)) > 0),
      observed_at TIMESTAMPTZ NOT NULL,
      location_point geography(Point, 4326) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX pets_active_feed_idx ON pets (status, observed_at DESC, id DESC);
    CREATE INDEX pets_user_id_idx ON pets (user_id);
    CREATE INDEX pets_location_point_gix ON pets USING GIST (location_point);

    CREATE FUNCTION enforce_pet_status_transition()
    RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'INSERT' AND NEW.status NOT IN ('draft', 'lost', 'found') THEN
        RAISE EXCEPTION 'Pet reports must start as draft, lost, or found'
          USING ERRCODE = '23514';
      END IF;

      IF TG_OP = 'UPDATE' AND NEW.status <> OLD.status THEN
        IF NOT (
          (OLD.status = 'draft' AND NEW.status IN ('lost', 'found', 'archived')) OR
          (OLD.status = 'lost' AND NEW.status IN ('found', 'archived')) OR
          (OLD.status = 'found' AND NEW.status IN ('reunited', 'archived')) OR
          (OLD.status = 'reunited' AND NEW.status = 'archived')
        ) THEN
          RAISE EXCEPTION 'Invalid pet status transition from % to %', OLD.status, NEW.status
            USING ERRCODE = '23514';
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER pets_set_updated_at
      BEFORE UPDATE ON pets
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

    CREATE TRIGGER pets_enforce_status_transition
      BEFORE INSERT OR UPDATE ON pets
      FOR EACH ROW EXECUTE FUNCTION enforce_pet_status_transition();
  `);
};

export const down = (pgm) => {
  pgm.sql('DROP TABLE pets');
  pgm.sql('DROP FUNCTION enforce_pet_status_transition()');
  pgm.sql('DROP TYPE pet_status');
};
