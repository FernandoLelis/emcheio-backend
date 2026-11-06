-- AlterTable
ALTER TABLE "cupom" ADD COLUMN     "origem" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "tipo_desconto" TEXT,
ADD COLUMN     "valor_desconto" DOUBLE PRECISION;
