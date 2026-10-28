-- AlterTable
ALTER TABLE "inscrito" ADD COLUMN     "aceita_email" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aceita_whatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nome" VARCHAR(100),
ADD COLUMN     "whatsapp" VARCHAR(20);
