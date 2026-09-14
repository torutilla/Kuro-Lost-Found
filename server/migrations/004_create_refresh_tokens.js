export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX refresh_tokens_active_user_idx ON refresh_tokens (user_id)
      WHERE revoked_at IS NULL;
  `);
};

export const down = (pgm) => {
  pgm.sql('DROP TABLE refresh_tokens');
};
