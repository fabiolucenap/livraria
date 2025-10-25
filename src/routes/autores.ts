import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /autores — retorna todos os autores
router.get("/", async (req: Request, res: Response) => {
  try {
    const autores = await prisma.autor.findMany({
      include: {
        livros: true // Inclui os livros do autor
      }
    });
    res.json(autores);
  } catch (error) {
    console.error("Erro ao buscar autores:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /autores/:id — retorna um autor específico por ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    const autor = await prisma.autor.findUnique({
      where: { id },
      include: {
        livros: true // Inclui os livros do autor
      }
    });

    if (!autor) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    res.json(autor);
  } catch (error) {
    console.error("Erro ao buscar autor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /autores — cria um novo autor
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome, email, telefone, bio } = req.body;

    // Validação básica
    if (!nome || !email) {
      return res.status(400).json({ 
        error: "Nome e email são obrigatórios" 
      });
    }

    // Verifica se o email já existe
    const autorExistente = await prisma.autor.findUnique({
      where: { email }
    });

    if (autorExistente) {
      return res.status(409).json({ 
        error: "Já existe um autor com este email" 
      });
    }

    const novoAutor = await prisma.autor.create({
      data: {
        nome,
        email,
        telefone: telefone || null,
        bio: bio || null
      }
    });

    res.status(201).json(novoAutor);
  } catch (error) {
    console.error("Erro ao criar autor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT /autores/:id — atualiza um autor existente
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, telefone, bio } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se o autor existe
    const autorExistente = await prisma.autor.findUnique({
      where: { id }
    });

    if (!autorExistente) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    // Se o email está sendo alterado, verifica se já existe outro autor com este email
    if (email && email !== autorExistente.email) {
      const emailExistente = await prisma.autor.findUnique({
        where: { email }
      });

      if (emailExistente) {
        return res.status(409).json({ 
          error: "Já existe outro autor com este email" 
        });
      }
    }

    const autorAtualizado = await prisma.autor.update({
      where: { id },
      data: {
        nome: nome || autorExistente.nome,
        email: email || autorExistente.email,
        telefone: telefone !== undefined ? telefone : autorExistente.telefone,
        bio: bio !== undefined ? bio : autorExistente.bio
      }
    });

    res.json(autorAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar autor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE /autores/:id — deleta um autor
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    // Verifica se o autor existe
    const autorExistente = await prisma.autor.findUnique({
      where: { id },
      include: {
        livros: true
      }
    });

    if (!autorExistente) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    // Verifica se o autor tem livros associados
    if (autorExistente.livros.length > 0) {
      return res.status(409).json({ 
        error: "Não é possível deletar autor que possui livros associados" 
      });
    }

    await prisma.autor.delete({
      where: { id }
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erro ao deletar autor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;