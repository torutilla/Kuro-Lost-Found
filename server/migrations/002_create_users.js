export const up = (pgm) => {
  pgm.sql(`
    CREATE FUNCTION set_updated_at()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
      hash TEXT,
      provider TEXT NOT NULL CHECK (provider IN ('local', 'google')),
      provider_id TEXT,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      avatar TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT users_provider_credentials_check CHECK (
        (provider = 'local' AND hash IS NOT NULL AND provider_id IS NULL)
        OR (provider = 'google' AND hash IS NULL AND provider_id IS NOT NULL)
      ),
      CONSTRAINT users_provider_id_unique UNIQUE (provider, provider_id)
    );

    CREATE TRIGGER users_set_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);
};

export const down = (pgm) => {
  pgm.sql('DROP TABLE users');
  pgm.sql('DROP FUNCTION set_updated_at()');
};
