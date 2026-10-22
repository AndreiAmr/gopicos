-- Migration do MVP (GP-016): modalidade fechada, avaliação com nota,
-- desativação lógica de usuário e código de recuperação de senha.

-- ============ Modality (D6) ============
CREATE TYPE "public"."Modality" AS ENUM ('street', 'park', 'bowl_pool', 'vertical', 'downhill', 'mixed');

-- Converte o texto livre atual de forma segura; valores desconhecidos viram 'mixed'
-- (nenhum pico é perdido).
ALTER TABLE "public"."Spot"
  ALTER COLUMN "modality" TYPE "public"."Modality"
  USING (
    CASE lower(btrim("modality"))
      WHEN 'street' THEN 'street'
      WHEN 'rua' THEN 'street'
      WHEN 'park' THEN 'park'
      WHEN 'skatepark' THEN 'park'
      WHEN 'bowl' THEN 'bowl_pool'
      WHEN 'pool' THEN 'bowl_pool'
      WHEN 'piscina' THEN 'bowl_pool'
      WHEN 'bowl/pool' THEN 'bowl_pool'
      WHEN 'bowl_pool' THEN 'bowl_pool'
      WHEN 'vertical' THEN 'vertical'
      WHEN 'downhill' THEN 'downhill'
      ELSE 'mixed'
    END::"public"."Modality"
  );

-- ============ User (D4) ============
ALTER TABLE "public"."User" ADD COLUMN "deactivatedAt" TIMESTAMP(3);

-- ============ SpotReview (D2, D3) ============
-- Respostas (parentId) saem do MVP: remove as respostas existentes e a coluna.
DELETE FROM "public"."SpotReview" WHERE "parentId" IS NOT NULL;
ALTER TABLE "public"."SpotReview" DROP CONSTRAINT "SpotReview_parentId_fkey";
ALTER TABLE "public"."SpotReview" DROP COLUMN "parentId";

-- Uma avaliação por (autor, pico): mantém a mais recente de cada par.
DELETE FROM "public"."SpotReview" r
USING (
  SELECT "id", ROW_NUMBER() OVER (
    PARTITION BY "authorId", "spotId" ORDER BY "createdAt" DESC, "id" DESC
  ) AS rn
  FROM "public"."SpotReview"
) d
WHERE r."id" = d."id" AND d.rn > 1;

-- Nota: avaliações antigas não tinham nota; recebem 3 (neutra).
ALTER TABLE "public"."SpotReview" ADD COLUMN "rating" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "public"."SpotReview" ALTER COLUMN "rating" DROP DEFAULT;
ALTER TABLE "public"."SpotReview" ADD CONSTRAINT "SpotReview_rating_check" CHECK ("rating" BETWEEN 1 AND 5);

ALTER TABLE "public"."SpotReview" DROP COLUMN "title";

-- Comentário opcional de até 500 caracteres (trunca o que excede; vazio vira NULL).
ALTER TABLE "public"."SpotReview" ALTER COLUMN "description" DROP NOT NULL;
UPDATE "public"."SpotReview" SET "description" = NULLIF(left(btrim("description"), 500), '');
ALTER TABLE "public"."SpotReview" ALTER COLUMN "description" TYPE VARCHAR(500);

-- FK do pico passa a remover as avaliações junto com o pico.
ALTER TABLE "public"."SpotReview" DROP CONSTRAINT "SpotReview_spotId_fkey";
ALTER TABLE "public"."SpotReview" ADD CONSTRAINT "SpotReview_spotId_fkey"
  FOREIGN KEY ("spotId") REFERENCES "public"."Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============ PasswordResetCode (D1) ============
CREATE TABLE "public"."PasswordResetCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "PasswordResetCode_id_key" ON "public"."PasswordResetCode"("id");
CREATE INDEX "PasswordResetCode_userId_createdAt_idx" ON "public"."PasswordResetCode"("userId", "createdAt");
ALTER TABLE "public"."PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============ Índices ============
CREATE UNIQUE INDEX "SpotReview_authorId_spotId_key" ON "public"."SpotReview"("authorId", "spotId");
CREATE INDEX "SpotReview_spotId_idx" ON "public"."SpotReview"("spotId");
CREATE INDEX "Spot_authorId_idx" ON "public"."Spot"("authorId");
CREATE INDEX "Spot_modality_idx" ON "public"."Spot"("modality");
