-- CreateTable
CREATE TABLE "Autor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "bio" TEXT,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT,
    "ano" INTEGER NOT NULL,
    "paginas" INTEGER,
    "isbn" TEXT NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "editora_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editora" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "endereco" TEXT,
    "telefone" VARCHAR(20),

    CONSTRAINT "Editora_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_editora_id_fkey" FOREIGN KEY ("editora_id") REFERENCES "Editora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
