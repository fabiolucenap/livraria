import { Router, Request, Response } from "express";


const router = Router();


type ping = {
  id: number;
  msg: string;
};


const ping: ping[] = [
  { id: 1, msg: "pong" }
];


router.get("/", (req: Request, res: Response) => {
  res.json(ping);
});


export default router;