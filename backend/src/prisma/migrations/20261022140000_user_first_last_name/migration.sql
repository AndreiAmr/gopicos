-- GP-081: nome e sobrenome separados + normalização de e-mails.

-- Aborta se a normalização de e-mail causaria colisão (resolver manualmente antes).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "User" GROUP BY lower(btrim("email")) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'E-mails duplicados após normalização (lower/btrim); resolva antes de migrar.';
  END IF;
END $$;

UPDATE "User" SET "email" = lower(btrim("email")) WHERE "email" <> lower(btrim("email"));

ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

-- name atual: primeira palavra vira firstName; o restante vira lastName.
UPDATE "User" SET
  "firstName" = split_part(btrim("name"), ' ', 1),
  "lastName" = btrim(substr(btrim("name"), length(split_part(btrim("name"), ' ', 1)) + 1));

ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" DROP DEFAULT;
ALTER TABLE "User" DROP COLUMN "name";
