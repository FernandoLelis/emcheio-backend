-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icone" VARCHAR(50),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "marca" VARCHAR(100),
    "imagem_url" TEXT,
    "categoria_id" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "loja" VARCHAR(50) NOT NULL,
    "preco_atual" DECIMAL(10,2) NOT NULL,
    "preco_original" DECIMAL(10,2),
    "url_afiliado" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupom" (
    "id" SERIAL NOT NULL,
    "loja" VARCHAR(50) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255),
    "desconto_texto" VARCHAR(50),
    "url_afiliado" TEXT,
    "validade_inicio" DATE,
    "validade_fim" DATE,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cupom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscrito" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscrito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_slug_key" ON "categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "produto_slug_key" ON "produto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "inscrito_email_key" ON "inscrito"("email");

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta" ADD CONSTRAINT "oferta_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
