-- GP-070: data de cadastro do usuário (usuários existentes recebem a data da migration).
ALTER TABLE "public"."User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
