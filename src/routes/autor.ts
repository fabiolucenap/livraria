import { Router, Request, Response } from "express";
import prisma from "../prisma";


const router = Router();


router.get("/", async (req: Request, res: Response) => {
  const autores = await prisma.autor.findMany();
  res.json(autores);
});


export default router;