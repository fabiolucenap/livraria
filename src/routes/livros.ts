import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /livros — retorna todos os livros
router.get("/", async (req: Request, res: Response) => {
  try {
    const livros = await prisma.livro.findMany({
      include: {
        autor: true,
        categoria: true,
        editora: true
      }
    });
    res.json(livros);
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /livros/:id — retorna um livro específico por ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    const livro = await prisma.livro.findUnique({
      where: { id },
      include: {
        autor: true,
        categoria: true,
        editora: true
      }
    });

    if (!livro) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.json(livro);
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /livros — cria um novo livro
router.post("/", async (req: Request, res: Response) => {
  try {
    const { titulo, resumo, ano, paginas, isbn, categoria_id, editora_id, autor_id } = req.body;

    // Validação básica
    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ 
        error: "Título do livro é obrigatório" 
      });
    }

    if (!isbn || isbn.trim() === "") {
      return res.status(400).json({ 
        error: "ISBN do livro é obrigatório" 
      });
    }

    if (!ano || isNaN(Number(ano))) {
      return res.status(400).json({ 
        error: "Ano deve ser um número válido" 
      });
    }

    if (!categoria_id || isNaN(Number(categoria_id))) {
      return res.status(400).json({ 
        error: "ID da categoria é obrigatório e deve ser um número" 
      });
    }

    if (!editora_id || isNaN(Number(editora_id))) {
      return res.status(400).json({ 
        error: "ID da editora é obrigatório e deve ser um número" 
      });
    }

    if (!autor_id || isNaN(Number(autor_id))) {
      return res.status(400).json({ 
        error: "ID do autor é obrigatório e deve ser um número" 
      });
    }

    // Verifica se já existe um livro com este ISBN
    const livroExistente = await prisma.livro.findFirst({
      where: { 
        isbn: isbn.trim()
      }
    });

    if (livroExistente) {
      return res.status(409).json({ 
        error: "Já existe um livro com este ISBN" 
      });
    }

    // Verifica se a categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: Number(categoria_id) }
    });

    if (!categoria) {
      return res.status(400).json({ 
        error: "Categoria não encontrada" 
      });
    }

    // Verifica se a editora existe
    const editora = await prisma.editora.findUnique({
      where: { id: Number(editora_id) }
    });

    if (!editora) {
      return res.status(400).json({ 
        error: "Editora não encontrada" 
      });
    }

    // Verifica se o autor existe
    const autor = await prisma.autor.findUnique({
      where: { id: Number(autor_id) }
    });

    if (!autor) {
      return res.status(400).json({ 
        error: "Autor não encontrado" 
      });
    }

    const novoLivro = await prisma.livro.create({
      data: {
        titulo: titulo.trim(),
        resumo: resumo?.trim() || null,
        ano: Number(ano),
        paginas: paginas ? Number(paginas) : null,
        isbn: isbn.trim(),
        categoria_id: Number(categoria_id),
        editora_id: Number(editora_id),
        autor_id: Number(autor_id)
      },
      include: {
        autor: true,
        categoria: true,
        editora: true
      }
    });

    res.status(201).json(novoLivro);
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /livros/:id — atualiza um livro existente
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { titulo, resumo, ano, paginas, isbn, categoria_id, editora_id, autor_id } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se o livro existe
    const livroExistente = await prisma.livro.findUnique({
      where: { id }
    });

    if (!livroExistente) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    // Validações condicionais (só valida se o campo foi enviado)
    if (titulo !== undefined && (!titulo || titulo.trim() === "")) {
      return res.status(400).json({ 
        error: "Título do livro é obrigatório" 
      });
    }

    if (isbn !== undefined && (!isbn || isbn.trim() === "")) {
      return res.status(400).json({ 
        error: "ISBN do livro é obrigatório" 
      });
    }

    if (ano !== undefined && (!ano || isNaN(Number(ano)))) {
      return res.status(400).json({ 
        error: "Ano deve ser um número válido" 
      });
    }

    // Se o ISBN está sendo alterado, verifica se já existe outro livro com este ISBN
    if (isbn && isbn.trim() !== livroExistente.isbn) {
      const isbnExistente = await prisma.livro.findFirst({
        where: { 
          isbn: isbn.trim(),
          NOT: { id }
        }
      });

      if (isbnExistente) {
        return res.status(409).json({ 
          error: "Já existe outro livro com este ISBN" 
        });
      }
    }

    // Verifica relacionamentos se foram fornecidos
    if (categoria_id !== undefined) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: Number(categoria_id) }
      });

      if (!categoria) {
        return res.status(400).json({ 
          error: "Categoria não encontrada" 
        });
      }
    }

    if (editora_id !== undefined) {
      const editora = await prisma.editora.findUnique({
        where: { id: Number(editora_id) }
      });

      if (!editora) {
        return res.status(400).json({ 
          error: "Editora não encontrada" 
        });
      }
    }

    if (autor_id !== undefined) {
      const autor = await prisma.autor.findUnique({
        where: { id: Number(autor_id) }
      });

      if (!autor) {
        return res.status(400).json({ 
          error: "Autor não encontrado" 
        });
      }
    }

    const livroAtualizado = await prisma.livro.update({
      where: { id },
      data: {
        titulo: titulo !== undefined ? titulo.trim() : livroExistente.titulo,
        resumo: resumo !== undefined ? (resumo?.trim() || null) : livroExistente.resumo,
        ano: ano !== undefined ? Number(ano) : livroExistente.ano,
        paginas: paginas !== undefined ? (paginas ? Number(paginas) : null) : livroExistente.paginas,
        isbn: isbn !== undefined ? isbn.trim() : livroExistente.isbn,
        categoria_id: categoria_id !== undefined ? Number(categoria_id) : livroExistente.categoria_id,
        editora_id: editora_id !== undefined ? Number(editora_id) : livroExistente.editora_id,
        autor_id: autor_id !== undefined ? Number(autor_id) : livroExistente.autor_id
      },
      include: {
        autor: true,
        categoria: true,
        editora: true
      }
    });

    res.json(livroAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /livros/:id — deleta um livro
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se o livro existe
    const livroExistente = await prisma.livro.findUnique({
      where: { id }
    });

    if (!livroExistente) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    await prisma.livro.delete({
      where: { id }
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;