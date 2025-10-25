import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import autoresRouter from "./routes/autores";
import livrosRouter from "./routes/livros";
import pingRouter from "./routes/ping";
import autorRouter from "./routes/autor";
import categoriaRouter from "./routes/categoria";
import editoraRouter from "./routes/editora";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Primeira rota de teste:
app.get("/", (req: Request, res: Response) => {
  res.json({ mensagem: "Bem-vindo à API da Livraria!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rotas CRUD
app.use("/autores", autoresRouter);
app.use("/livros", livrosRouter);
app.use("/categorias", categoriaRouter);
app.use("/editoras", editoraRouter);

// Rotas auxiliares
app.use("/ping", pingRouter);
app.use("/autor", autorRouter);