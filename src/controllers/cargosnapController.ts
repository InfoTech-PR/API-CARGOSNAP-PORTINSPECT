import { Request, Response } from "express";
import { cargosnapRequest } from "../services/cargosnapService";

export const getArquivos = async (req: Request, res: Response) => {
  try {
    const data = await cargosnapRequest("/files", "GET");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRecurso = async (req: Request, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const data = await cargosnapRequest("/create-resource", "POST", { nome, descricao });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};