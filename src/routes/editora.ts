import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /editoras — retorna todas as editoras
router.get("/", async (req: Request, res: Response) => {
  try {
    const editoras = await prisma.editora.findMany({
      include: {
        livros: true // Inclui os livros da editora
      }
    });
    res.json(editoras);
  } catch (error) {
    console.error("Erro ao buscar editoras:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /editoras/:id — retorna uma editora específica por ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    const editora = await prisma.editora.findUnique({
      where: { id },
      include: {
        livros: {
          include: {
            autor: true,
            categoria: true
          }
        }
      }
    });

    if (!editora) {
      return res.status(404).json({ error: "Editora não encontrada" });
    }

    res.json(editora);
  } catch (error) {
    console.error("Erro ao buscar editora:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /editoras — cria uma nova editora
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome, endereco, telefone } = req.body;

    // Validação básica
    if (!nome || nome.trim() === "") {
      return res.status(400).json({ 
        error: "Nome da editora é obrigatório" 
      });
    }

    // Verifica se já existe uma editora com este nome
    const editoraExistente = await prisma.editora.findFirst({
      where: { 
        nome: {
          equals: nome.trim(),
          mode: 'insensitive' // Case insensitive
        }
      }
    });

    if (editoraExistente) {
      return res.status(409).json({ 
        error: "Já existe uma editora com este nome" 
      });
    }

    const novaEditora = await prisma.editora.create({
      data: {
        nome: nome.trim(),
        endereco: endereco?.trim() || null,
        telefone: telefone?.trim() || null
      }
    });

    res.status(201).json(novaEditora);
  } catch (error) {
    console.error("Erro ao criar editora:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /editoras/:id — atualiza uma editora existente
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, endereco, telefone } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ 
        error: "Nome da editora é obrigatório" 
      });
    }

    // Verifica se a editora existe
    const editoraExistente = await prisma.editora.findUnique({
      where: { id }
    });

    if (!editoraExistente) {
      return res.status(404).json({ error: "Editora não encontrada" });
    }

    // Se o nome está sendo alterado, verifica se já existe outra editora com este nome
    if (nome.trim() !== editoraExistente.nome) {
      const nomeExistente = await prisma.editora.findFirst({
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
          error: "Já existe outra editora com este nome" 
        });
      }
    }

    const editoraAtualizada = await prisma.editora.update({
      where: { id },
      data: {
        nome: nome.trim(),
        endereco: endereco !== undefined ? (endereco?.trim() || null) : editoraExistente.endereco,
        telefone: telefone !== undefined ? (telefone?.trim() || null) : editoraExistente.telefone
      }
    });

    res.json(editoraAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar editora:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /editoras/:id — deleta uma editora
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se a editora existe
    const editoraExistente = await prisma.editora.findUnique({
      where: { id },
      include: {
        livros: true
      }
    });

    if (!editoraExistente) {
      return res.status(404).json({ error: "Editora não encontrada" });
    }

    // Verifica se a editora tem livros associados
    if (editoraExistente.livros.length > 0) {
      return res.status(409).json({ 
        error: "Não é possível deletar editora que possui livros associados" 
      });
    }

    await prisma.editora.delete({
      where: { id }
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erro ao deletar editora:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;