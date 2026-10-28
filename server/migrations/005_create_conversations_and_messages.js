export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE conversation_participants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (conversation_id, user_id)
    );

    CREATE TABLE messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL CHECK (length(trim(body)) > 0),
      read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX conversations_pet_id_idx
      ON conversations (pet_id);

    CREATE INDEX conversation_participants_conversation_id_idx
      ON conversation_participants (conversation_id);

    CREATE INDEX conversation_participants_user_id_idx
      ON conversation_participants (user_id);

    CREATE INDEX messages_conversation_id_idx
      ON messages (conversation_id, created_at DESC);

    CREATE INDEX messages_sender_id_idx
      ON messages (sender_id);

    CREATE TRIGGER conversations_set_updated_at
      BEFORE UPDATE ON conversations
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();

    CREATE TRIGGER messages_set_updated_at
      BEFORE UPDATE ON messages
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS conversation_participants;
    DROP TABLE IF EXISTS conversations;
  `);
};
