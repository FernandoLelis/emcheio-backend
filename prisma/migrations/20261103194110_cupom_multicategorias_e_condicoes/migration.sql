-- AlterTable
ALTER TABLE "cupom" ADD COLUMN     "condicoes" TEXT;

-- CreateTable
CREATE TABLE "_CategoriaToCupom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoriaToCupom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoriaToCupom_B_index" ON "_CategoriaToCupom"("B");

-- AddForeignKey
ALTER TABLE "_CategoriaToCupom" ADD CONSTRAINT "_CategoriaToCupom_A_fkey" FOREIGN KEY ("A") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToCupom" ADD CONSTRAINT "_CategoriaToCupom_B_fkey" FOREIGN KEY ("B") REFERENCES "cupom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
