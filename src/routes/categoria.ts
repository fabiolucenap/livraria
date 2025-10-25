import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /categorias — retorna todas as categorias
router.get("/", async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        livros: true // Inclui os livros da categoria
      }
    });
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /categorias/:id — retorna uma categoria específica por ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        livros: {
          include: {
            autor: true,
            editora: true
          }
        }
      }
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /categorias — cria uma nova categoria
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;

    // Validação básica
    if (!nome || nome.trim() === "") {
      return res.status(400).json({ 
        error: "Nome da categoria é obrigatório" 
      });
    }

    // Verifica se já existe uma categoria com este nome
    const categoriaExistente = await prisma.categoria.findFirst({
      where: { 
        nome: {
          equals: nome.trim(),
          mode: 'insensitive' // Case insensitive
        }
      }
    });

    if (categoriaExistente) {
      return res.status(409).json({ 
        error: "Já existe uma categoria com este nome" 
      });
    }

    const novaCategoria = await prisma.categoria.create({
      data: {
        nome: nome.trim()
      }
    });

    res.status(201).json(novaCategoria);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /categorias/:id — atualiza uma categoria existente
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ 
        error: "Nome da categoria é obrigatório" 
      });
    }

    // Verifica se a categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    // Se o nome está sendo alterado, verifica se já existe outra categoria com este nome
    if (nome.trim() !== categoriaExistente.nome) {
      const nomeExistente = await prisma.categoria.findFirst({
        where: { 
          nome: {
            equals: nome.trim(),
            mode: 'insensitive'
          },
          NOT: { id }
        }
      });

      if (nomeExistente) {
        return res.status(409).json({ 
          error: "Já existe outra categoria com este nome" 
        });
      }
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: {
        nome: nome.trim()
      }
    });

    res.json(categoriaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /categorias/:id — deleta uma categoria
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se a categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id },
      include: {
        livros: true
      }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    // Verifica se a categoria tem livros associados
    if (categoriaExistente.livros.length > 0) {
      return res.status(409).json({ 
        error: "Não é possível deletar categoria que possui livros associados" 
      });
    }

    await prisma.categoria.delete({
      where: { id }
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;